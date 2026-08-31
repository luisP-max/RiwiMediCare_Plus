import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/request.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Open a new medical supply replenishment request order
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clinicId
 *               - medicineId
 *               - warehouseId
 *               - requestedQuantity
 *             properties:
 *               clinicId:
 *                 type: string
 *                 format: uuid
 *                 example: "a3b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d"
 *               medicineId:
 *                 type: string
 *                 format: uuid
 *                 example: "b4c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e"
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *                 example: "c5d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f"
 *               requestedQuantity:
 *                 type: integer
 *                 example: 250
 *     responses:
 *       201:
 *         description: Supply replenishment request order successfully created.
 *       400:
 *         description: Invalid payload data or requested quantity is less than or equal to zero.
 *       401:
 *         description: Missing or invalid Bearer access token signature.
 *       404:
 *         description: One of the linked relational target entity UUIDs does not exist.
 */
router.post('/', checkAuth, createRequest);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Retrieve the complete list of replenishment orders with eager loading
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete requests logs database database fields successfully fetched with relations.
 *       401:
 *         description: Unauthorized credentials exception.
 */
router.get('/', checkAuth, getRequests);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Mutate the operational state transition status of an open supply order
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique supply transaction request order identifier UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *                 example: "Approved"
 *     responses:
 *       200:
 *         description: Supply request order processing status state successfully updated.
 *       400:
 *         description: Invalid status enum mutation value parameter provided.
 *       401:
 *         description: Missing or invalid credentials token.
 *       403:
 *         description: Forbidden resource access due to missing Administrator privileges.
 *       404:
 *         description: The specified transaction unique identifier was not identified.
 */
router.patch('/:id/status', checkAuth, requireAdmin, updateRequestStatus);

export default router;
