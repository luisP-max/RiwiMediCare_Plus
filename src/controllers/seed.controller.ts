import { type Request, type Response } from 'express';
import { Clinic } from '../models/clinic.model.js';
import { Warehouse } from '../models/warehouse.model.js';
import { Medicine } from '../models/medicine.model.js';

/**
 * Handles bulk data ingestion by parsing an uploaded JSON file footprint via multer.
 * Populates base infrastructure catalogs dynamically to support test validations.
 */
export const uploadBulkSeed = async (req: Request, res: Response) => {
    try {
        // Enforce file existence checking validation rules before streaming data arrays
        if (!req.file) {
            return res.status(400).json({ message: 'Error: No payload data file detected. Please attach a valid .json file.' });
        }

        // Convert the buffer memory string physically into clean executable JavaScript objects
        const fileContent = req.file.buffer.toString('utf-8');
        const seedData = JSON.parse(fileContent);

        const { clinics, warehouses, medicines } = seedData;

        // 1. Bulk Ingestion process for clinics records using Sequelize bulkCreate abstraction
        if (clinics && Array.isArray(clinics)) {
            await Clinic.bulkCreate(clinics, { ignoreDuplicates: true });
        }

        // 2. Bulk Ingestion process for warehouses resources distribution logs
        if (warehouses && Array.isArray(warehouses)) {
            await Warehouse.bulkCreate(warehouses, { ignoreDuplicates: true });
        }

        // 3. Bulk Ingestion process for medicines catalog items entries
        if (medicines && Array.isArray(medicines)) {
            await Medicine.bulkCreate(medicines, { ignoreDuplicates: true });
        }

        return res.status(201).json({
            message: 'Database storage tables successfully populated through automated seed file ingestion streaming routines.',
            ingestedRecords: {
                clinicsCount: clinics ? clinics.length : 0,
                warehousesCount: warehouses ? warehouses.length : 0,
                medicinesCount: medicines ? medicines.length : 0
            }
        });
    } catch (error) {
        console.error('[Seed Ingestion Controller Error] Critical failure during file dataset processing:', error);
        return res.status(500).json({ 
            message: 'Internal server error triggered while streaming metadata into database clusters.', 
            error: error instanceof Error ? error.message : error 
        });
    }
};
