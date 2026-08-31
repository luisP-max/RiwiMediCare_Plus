import express from 'express';
import multer from 'multer';
import { uploadBulkSeed } from '../controllers/seed.controller.js';

const router = express.Router();

// Configure multer memory allocating footprint routines
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Endpoint route mapping focused on seeding base operational tables records.
 * Binds multer single form file fields named 'seedFile' into the injection cycle.
 */
router.post('/upload', upload.single('seedFile'), uploadBulkSeed);

export default router;
