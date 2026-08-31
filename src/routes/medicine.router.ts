import express from 'express';
import { createMedicine, getMedicines, updateMedicine, deleteMedicine } from '../controllers/medicine.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate pharmaceutical catalog items.
 * Enforces token payload evaluations and strict role criteria verification procedures.
 */
router.post('/', checkAuth, requireAdmin, createMedicine);
router.get('/', checkAuth, getMedicines);
router.put('/:id', checkAuth, requireAdmin, updateMedicine);
router.delete('/:id', checkAuth, requireAdmin, deleteMedicine);

export default router;
