import express from 'express';
import { createMedicine, getMedicines, updateMedicine, deleteMedicine } from '../controllers/medicine.controller.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate medicine resources management.
 */
router.post('/', createMedicine);
router.get('/', getMedicines);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;
