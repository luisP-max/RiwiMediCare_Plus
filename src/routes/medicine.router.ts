import express from 'express';
import { createMedicine, getMedicines, updateMedicine, deleteMedicine } from '../controllers/medicine.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Register a new medicine product in the catalog
 *     tags: [Medicines]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acetaminophen 500mg"
 *               description:
 *                 type: string
 *                 example: "Analgesic and antipyretic formulation for pain management."
 *     responses:
 *       201:
 *         description: Pharmaceutical item successfully registered in the catalog.
 *       400:
 *         description: Missing mandatory fields or duplicate medicine name code.
 *       401:
 *         description: Missing or invalid Bearer access token signature.
 *       403:
 *         description: Forbidden resource access due to missing Administrator privileges.
 */
router.post('/', checkAuth, requireAdmin, createMedicine);

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Retrieve all active medicine products in the catalog
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active pharmaceutical items successfully fetched.
 *       401:
 *         description: Unauthorized credentials exception.
 */
router.get('/', checkAuth, getMedicines);

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Modify properties of an existing active medicine record
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique medicine string identifier UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acetaminophen Forte 650mg"
 *               description:
 *                 type: string
 *                 example: "Enhanced analgesic formulation for chronic pain management."
 *     responses:
 *       200:
 *         description: Medicine item data records updated successfully.
 *       404:
 *         description: Medicine product data was not identified or is inactive.
 */
router.put('/:id', checkAuth, requireAdmin, updateMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Soft-delete a medicine item resource from active database execution
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique medicine string identifier UUID
 *     responses:
 *       200:
 *         description: Medicine item resource successfully soft-deleted.
 *       404:
 *         description: Target pharmaceutical resource was not found.
 */
router.delete('/:id', checkAuth, requireAdmin, deleteMedicine);

export default router;
