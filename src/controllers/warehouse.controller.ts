import { type Request, type Response } from 'express';
import { Warehouse } from '../models/warehouse.model.js';

/**
 * Creates and persists a new storage facility row within the infrastructure.
 */
export const createWarehouse = async (req: Request, res: Response) => {
    try {
        const { name, location } = req.body;

        if (!name || !location) {
            return res.status(400).json({ message: 'Error: Both name and location fields are strictly required.' });
        }

        const existingWarehouse = await Warehouse.findOne({ where: { name } });
        if (existingWarehouse) {
            return res.status(400).json({ message: `Error: A storage warehouse named '${name}' already exists within the network.` });
        }

        const newWarehouse = await Warehouse.create({ name, location });
        return res.status(201).json({ message: 'Warehouse storage facility successfully registered.', warehouse: newWarehouse });
    } catch (error) {
        console.error('[Warehouse Controller Error] Failed to complete warehouse entry creation:', error);
        return res.status(500).json({ message: 'Internal server error encountered during warehouse row entry generation.', error });
    }
};

/**
 * Queries and returns all warehouses currently active in the logistical chain.
 */
export const getWarehouses = async (req: Request, res: Response) => {
    try {
        const warehouses = await Warehouse.findAll({ where: { status: 'active' } });
        return res.json(warehouses);
    } catch (error) {
        console.error('[Warehouse Controller Error] Failed to query active warehouses registry list:', error);
        return res.status(500).json({ message: 'Internal server error encountered while fetching warehouses data.', error });
    }
};

/**
 * Modifies fields of an active warehouse resource entry dataset.
 */
export const updateWarehouse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, location } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested warehouse unique string identifier parameter is required.' });
        }

        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse || warehouse.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified warehouse facility was not found or is currently marked inactive.' });
        }

        await warehouse.update({ name, location });
        return res.json({ message: 'Warehouse storage dataset records updated successfully.', warehouse });
    } catch (error) {
        console.error('[Warehouse Controller Error] Failed to process warehouse record updates:', error);
        return res.status(500).json({ message: 'Internal server error encountered during warehouse entry modifications.', error });
    }
};

/**
 * Changes a warehouse status to deleted to enforce logical soft delete requirements.
 */
export const deleteWarehouse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested warehouse unique string identifier parameter is required.' });
        }

        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse || warehouse.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified warehouse target was not found or has already been soft-deleted.' });
        }

        // Fulfilling examination rules page 3: Use logical deletion status attributes
        await warehouse.update({ status: 'deleted' });
        return res.json({ message: 'Warehouse facility resource successfully soft-deleted from active system execution.' });
    } catch (error) {
        console.error('[Warehouse Controller Error] Failed to execute logical storage deletion sequence:', error);
        return res.status(500).json({ message: 'Internal server error encountered during logical soft-delete operation.', error });
    }
};
