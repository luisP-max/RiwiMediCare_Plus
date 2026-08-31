import express from 'express';
import { createWarehouse, getWarehouses, updateWarehouse, deleteWarehouse } from '../controllers/warehouse.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Create and persist a new logistics supply storage facility
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: "North Distribution Hub"
 *               location:
 *                 type: string
 *                 example: "Industrial Zone Row 4, Block C"
 *     responses:
 *       201:
 *         description: Warehouse storage facility successfully registered.
 *       400:
 *         description: Missing mandatory fields or duplicate storage warehouse name.
 *       401:
 *         description: Missing or invalid Bearer access token signature.
 *       403:
 *         description: Forbidden resource access due to missing Administrator privileges.
 */
router.post('/', checkAuth, requireAdmin, createWarehouse);

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Retrieve all active logistical warehouses in the chain
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active warehouses successfully fetched.
 *       401:
 *         description: Unauthorized credentials exception.
 */
router.get('/', checkAuth, getWarehouses);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Modify field properties of an existing active warehouse resource
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique warehouse string identifier UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "North Distribution Hub S.A."
 *               location:
 *                 type: string
 *                 example: "Industrial Zone Row 4, Block F-10"
 *     responses:
 *       200:
 *         description: Warehouse storage dataset records updated successfully.
 *       404:
 *         description: Warehouse facility target was not identified or is inactive.
 */
router.put('/:id', checkAuth, requireAdmin, updateWarehouse);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Soft-delete a warehouse facility resource from active execution
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique warehouse string identifier UUID
 *     responses:
 *       200:
 *         description: Warehouse facility resource successfully soft-deleted.
 *       404:
 *         description: Target resource was not found.
 */
router.delete('/:id', checkAuth, requireAdmin, deleteWarehouse);

export default router;
