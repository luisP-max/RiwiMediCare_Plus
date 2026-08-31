import { type Request, type Response } from 'express';
import { RequestSupply } from '../models/request.model.js';
import { Clinic } from '../models/clinic.model.js';
import { Medicine } from '../models/medicine.model.js';
import { Warehouse } from '../models/warehouse.model.js';

/**
 * Creates and persists a new medical replenishment request order.
 * Validates existence of linked entities before ingestion.
 */
export const createRequest = async (req: Request, res: Response) => {
    try {
        const { clinicId, medicineId, warehouseId, requestedQuantity } = req.body;

        if (!clinicId || !medicineId || !warehouseId || requestedQuantity === undefined) {
            return res.status(400).json({ message: 'Error: All payload keys (clinicId, medicineId, warehouseId, requestedQuantity) are mandatory.' });
        }

        if (requestedQuantity <= 0) {
            return res.status(400).json({ message: 'Error: Requested supply quantity must be an integer strictly greater than zero.' });
        }

        // Integrity Verification 1: Enforce clinic row existence checking
        const clinicExists = await Clinic.findByPk(clinicId);
        if (!clinicExists || clinicExists.status === 'deleted') {
            return res.status(404).json({ message: `Error: Target clinic unique identifier ${clinicId} does not exist.` });
        }

        // Integrity Verification 2: Enforce medicine entry row checking
        const medicineExists = await Medicine.findByPk(medicineId);
        if (!medicineExists || medicineExists.status === 'deleted') {
            return res.status(404).json({ message: `Error: Target pharmaceutical medicine unique identifier ${medicineId} does not exist.` });
        }

        // Integrity Verification 3: Enforce warehouse target row checking
        const warehouseExists = await Warehouse.findByPk(warehouseId);
        if (!warehouseExists || warehouseExists.status === 'deleted') {
            return res.status(404).json({ message: `Error: Target warehouse storage facility unique identifier ${warehouseId} does not exist.` });
        }

        const newRequest = await RequestSupply.create({ clinicId, medicineId, warehouseId, requestedQuantity });
        return res.status(201).json({ message: 'Medical supply replenishment order successfully opened.', request: newRequest });
    } catch (error) {
        console.error('[Request Controller Error] Failed to process supply request creation:', error);
        return res.status(500).json({ message: 'Internal server error encountered during order generation processing.', error });
    }
};

/**
 * Retrieves the complete list of replenishment orders using relational Eager Loading.
 * Solves query mappings for clinic names, medicines, and target storages.
 */
export const getRequests = async (req: Request, res: Response) => {
    try {
        const requests = await RequestSupply.findAll({
            include: [
                { model: Clinic, as: 'clinic', attributes: ['nit', 'name', 'managerName'] },
                { model: Medicine, as: 'medicine', attributes: ['name', 'description'] },
                { model: Warehouse, as: 'warehouse', attributes: ['name', 'location'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        return res.json(requests);
    } catch (error) {
        console.error('[Request Controller Error] Failed to fetch system requests logs:', error);
        return res.status(500).json({ message: 'Internal server error encountered while fetching requests databases.', error });
    }
};

/**
 * Updates the state transition metadata footprint of an open replenishment order.
 */
export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The target request unique identifier string parameter is required.' });
        }

        if (!status || (status !== 'Pending' && status !== 'Approved' && status !== 'Rejected')) {
            return res.status(400).json({ message: "Error: Supply order state mutation must be exactly 'Pending', 'Approved', or 'Rejected'." });
        }

        const supplyOrder = await RequestSupply.findByPk(id);
        if (!supplyOrder) {
            return res.status(404).json({ message: 'Error: The specified supply replenishment order record was not identified.' });
        }

        await supplyOrder.update({ status });
        return res.json({ message: 'Supply order processing status state successfully updated.', order: supplyOrder });
    } catch (error) {
        console.error('[Request Controller Error] Failed to process request status mutation:', error);
        return res.status(500).json({ message: 'Internal server error triggered during request status modification routines.', error });
    }
};
