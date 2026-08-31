import express from 'express';
import { createWarehouse, getWarehouses, updateWarehouse, deleteWarehouse } from '../controllers/warehouse.controller.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate warehouse resources management.
 */
router.post('/', createWarehouse);
router.get('/', getWarehouses);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);

export default router;
