import express from 'express';
import { createClinic, getClinics, updateClinic, deleteClinic } from '../controllers/clinic.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Register a new medical clinic facility
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nit
 *               - name
 *               - address
 *               - managerName
 *             properties:
 *               nit:
 *                 type: string
 *                 example: "901234567-1"
 *               name:
 *                 type: string
 *                 example: "RiwiMediCare Central Clinic"
 *               address:
 *                 type: string
 *                 example: "Avenida El Poblado 45-12"
 *               managerName:
 *                 type: string
 *                 example: "Dr. Luis Hernandez"
 *     responses:
 *       201:
 *         description: Clinic successfully created and stored.
 *       400:
 *         description: Missing mandatory fields or duplicate NIT tax code.
 *       401:
 *         description: Missing or invalid Bearer access token signature.
 *       403:
 *         description: Forbidden resource access due to missing Administrator privileges.
 */
router.post('/', checkAuth, requireAdmin, createClinic);

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Retrieve all registered operational active clinics
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active clinics successfully fetched.
 *       401:
 *         description: Unauthorized credentials exception.
 */
router.get('/', checkAuth, getClinics);

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Modify field properties of an existing active clinic record
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique clinic string identifier UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "RiwiMediCare Central S.A.S"
 *               address:
 *                 type: string
 *                 example: "Calle 74 # 53-21, Sede Norte"
 *               managerName:
 *                 type: string
 *                 example: "Dr. Carlos Ruiz"
 *     responses:
 *       200:
 *         description: Clinic dataset record successfully updated.
 *       404:
 *         description: Clinic dataset target was not identified or is inactive.
 */
router.put('/:id', checkAuth, requireAdmin, updateClinic);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Soft-delete a clinic resource from active system workflows
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique clinic string identifier UUID
 *     responses:
 *       200:
 *         description: Clinic account resource successfully soft-deleted.
 *       404:
 *         description: Target resource was not found.
 */
router.delete('/:id', checkAuth, requireAdmin, deleteClinic);

export default router;
