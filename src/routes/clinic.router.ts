import express from 'express';
import { createClinic, getClinics, updateClinic, deleteClinic } from '../controllers/clinic.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate clinic resources management.
 * Secured via JWT checkAuth and administrative role authorization gates.
 */
router.post('/', checkAuth, requireAdmin, createClinic);
router.get('/', checkAuth, getClinics);
router.put('/:id', checkAuth, requireAdmin, updateClinic);
router.delete('/:id', checkAuth, requireAdmin, deleteClinic);

export default router;
