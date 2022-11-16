import express from 'express';
const router = express.Router();
import { registerStartup } from '../controllers/startup/startupController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerStartup);

export default router;
