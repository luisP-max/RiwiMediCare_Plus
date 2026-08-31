import { type Request, type Response } from 'express';
import { Clinic } from '../models/clinic.model.js';

/**
 * Persists a new healthcare facility row into the database infrastructure.
 * Enforces prevention of duplicate entry constraints according to corporate tax numbers.
 */
export const createClinic = async (req: Request, res: Response) => {
    try {
        const { nit, name, address, managerName } = req.body;

        if (!nit || !name || !address || !managerName) {
            return res.status(400).json({ message: 'Error: All payload keys (nit, name, address, managerName) are strictly required.' });
        }

        // Prevent duplicate corporate registries prior to hitting database constraints
        const existingClinic = await Clinic.findOne({ where: { nit } });
        if (existingClinic) {
            return res.status(400).json({ message: `Error: A medical facility with the NIT tax code ${nit} is already registered.` });
        }

        const newClinic = await Clinic.create({ nit, name, address, managerName });
        return res.status(201).json({ message: 'Healthcare clinic successfully registered within the platform.', clinic: newClinic });
    } catch (error) {
        console.error('[Clinic Controller Error] Failed to complete clinic entry creation:', error);
        return res.status(500).json({ message: 'Internal server error encountered during clinic row entry generation.', error });
    }
};

/**
 * Retrieves all registered clinics currently marked with an active status footprint.
 */
export const getClinics = async (req: Request, res: Response) => {
    try {
        const clinics = await Clinic.findAll({ where: { status: 'active' } });
        return res.json(clinics);
    } catch (error) {
        console.error('[Clinic Controller Error] Failed to query active clinics list:', error);
        return res.status(500).json({ message: 'Internal server error encountered while fetching the active clinics registry list.', error });
    }
};

/**
 * Modifies specific field properties of an existing active clinic record dataset.
 */
export const updateClinic = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, address, managerName } = req.body;

        // Strict defensive data validation to eliminate TypeScript findByPk string exceptions
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested clinic unique string identifier parameter is required.' });
        }

        const clinic = await Clinic.findByPk(id);
        if (!clinic || clinic.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified clinic record was not found or is currently marked inactive.' });
        }

        await clinic.update({ name, address, managerName });
        return res.json({ message: 'Clinic dataset records updated successfully.', clinic });
    } catch (error) {
        console.error('[Clinic Controller Error] Failed to process clinic dataset modification updates:', error);
        return res.status(500).json({ message: 'Internal server error encountered during clinic entity record modifications.', error });
    }
};

/**
 * Executes a logical soft-delete workflow upon a clinic entity row.
 * Alters the operational status metadata to ensure historical query preservation data logs.
 */
export const deleteClinic = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Strict defensive data validation to eliminate TypeScript findByPk string exceptions
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Error: The requested clinic unique string identifier parameter is required.' });
        }

        const clinic = await Clinic.findByPk(id);
        if (!clinic || clinic.status === 'deleted') {
            return res.status(404).json({ message: 'Error: The specified clinic target was not found or has already been soft-deleted.' });
        }

        // Fulfilling examination rules page 3: Switch status instead of dropping rows physically
        await clinic.update({ status: 'deleted' });
        return res.json({ message: 'Clinic account resource successfully soft-deleted from active system execution.' });
    } catch (error) {
        console.error('[Clinic Controller Error] Failed to execute logical entity deletion sequence:', error);
        return res.status(500).json({ message: 'Internal server error encountered during logical soft-delete operation.', error });
    }
};
