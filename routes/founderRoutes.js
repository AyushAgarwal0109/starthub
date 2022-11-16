import express from 'express';
const router = express.Router();
import { registerFounder } from '../controllers/founder/founderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerFounder);

export default router;
