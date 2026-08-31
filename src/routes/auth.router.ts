import express from 'express';
import { registerUser, logInUser } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Public network routes for security handling.
 * Exempt from access token validation as per architectural requirements.
 */
router.post('/register', registerUser);
router.post('/login', logInUser);

export default router;
