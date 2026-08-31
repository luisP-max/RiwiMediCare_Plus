import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/request.controller.js';

const router = express.Router();

/**
 * REST Endpoint paths mapping for corporate supply request transactions management.
 */
router.post('/', createRequest);
router.get('/', getRequests);
router.patch('/:id/status', updateRequestStatus);

export default router;
