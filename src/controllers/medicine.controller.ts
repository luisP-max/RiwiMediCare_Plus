import { type Request, type Response } from 'express';
import { Medicine } from '../models/medicine.model.js';

/**
 * Creates and persists a new pharmaceutical entry row within the database catalog.
 */
export const createMedicine = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Error: Both name and description payload fields are strictly required.' });
        }

        const existingMedicine = await Medicine.findOne({ where: { name } });
        if (existingMedicine) {
            return res.status(400).json({ message: `Error: A pharmaceutical item named '${name}' is already registered in the catalog.` });
        }

        const newMedicine = await Medicine.create({ name, description });
        return res.status(201).json({ message: 'Pharmaceutical product successfully registered in the catalog.', medicine: newMedicine });
    } catch (error) {
        console.error('[Medicine Controller Error] Failed to complete medicine entry creation:', error);
        return res.status(500).json({ message: 'Internal server error encountered during medicine catalog row entry generation.', error });
    }
};

/**
 * Queries and returns all medicines currently active in the inventory system catalog.
 */
export const getMedicines = async (req: Request, res: Response) => {
    try {
        const medicines = await Medicine.findAll({ where: { status: 'active' } });
        return res.json(medicines);
    } catch (error) {
        console.error('[Medicine Controller Error] Failed to query active pharmaceutical catalog list:', error);
        return res.status(500).json({ message: 'Internal server error encountered while fetching medicine catalog items.', error });
    }
};

/**
 * Modifies field properties of an existing active medicine resource entry dataset.
 */
export const updateMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested medicine unique string identifier parameter is required.' });
        }

        const medicine = await Medicine.findByPk(id);
        if (!medicine || medicine.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified medicine product was not found or is currently marked inactive.' });
        }

        await medicine.update({ name, description });
        return res.json({ message: 'Medicine product data records updated successfully.', medicine });
    } catch (error) {
        console.error('[Medicine Controller Error] Failed to process medicine record updates:', error);
        return res.status(500).json({ message: 'Internal server error encountered during medicine entry modifications.', error });
    }
};

/**
 * Changes a medicine status to deleted to enforce logical soft delete requirements.
 */
export const deleteMedicine = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested medicine unique string identifier parameter is required.' });
        }

        const medicine = await Medicine.findByPk(id);
        if (!medicine || medicine.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified medicine target was not found or has already been soft-deleted.' });
        }

        // Use logical deletion status attributes
        await medicine.update({ status: 'deleted' });
        return res.json({ message: 'Medicine item resource successfully soft-deleted from active system execution.' });
    } catch (error) {
        console.error('[Medicine Controller Error] Failed to execute logical medicine deletion sequence:', error);
        return res.status(500).json({ message: 'Internal server error encountered during logical soft-delete operation.', error });
    }
};
