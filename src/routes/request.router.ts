import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/request.controller.js';
import { checkAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate supply request transactions.
 * Configured with multi-tier route access controls based on corporate roles matrix.
 */
router.post('/', checkAuth, createRequest);
router.get('/', checkAuth, getRequests);
router.patch('/:id/status', checkAuth, requireAdmin, updateRequestStatus);

export default router;
