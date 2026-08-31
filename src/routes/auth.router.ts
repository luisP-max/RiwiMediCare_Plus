import express from 'express';
import { registerUser, logInUser } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new system administrative or request manager user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Luis Admin"
 *               email:
 *                 type: string
 *                 example: "luis.admin@riwicare.com"
 *               password:
 *                 type: string
 *                 example: "corporate_password_123"
 *               role:
 *                 type: string
 *                 enum: [Administrator, Request Manager]
 *                 example: "Administrator"
 *     responses:
 *       201:
 *         description: Administrative account successfully created.
 *       400:
 *         description: Missing mandatory fields or invalid user role classification selection.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user credentials and retrieve a cryptographic Bearer JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "luis.admin@riwicare.com"
 *               password:
 *                 type: string
 *                 example: "corporate_password_123"
 *     responses:
 *       200:
 *         description: Authentication successful. JWT access token payload successfully compiled.
 *       401:
 *         description: Invalid credentials provided due to email or password mismatch.
 */
router.post('/login', logInUser);

export default router;
