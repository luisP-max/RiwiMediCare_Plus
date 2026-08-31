import express from 'express';
import { createWarehouse, getWarehouses, updateWarehouse, deleteWarehouse } from '../controllers/warehouse.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate warehouse logistics.
 * Secured via cryptographic token verification and admin privilege validation routines.
 */
router.post('/', checkAuth, requireAdmin, createWarehouse);
router.get('/', checkAuth, getWarehouses);
router.put('/:id', checkAuth, requireAdmin, updateWarehouse);
router.delete('/:id', checkAuth, requireAdmin, deleteWarehouse);

export default router;
