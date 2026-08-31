import express from 'express';
import { createClinic, getClinics, updateClinic, deleteClinic } from '../controllers/clinic.controller.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate clinic resources management.
 */
router.post('/', createClinic);
router.get('/', getClinics);
router.put('/:id', updateClinic);
router.delete('/:id', deleteClinic);

export default router;
