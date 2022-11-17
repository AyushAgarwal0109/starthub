import express from 'express';
const router = express.Router();
import {
  registerStartup,
  investStartup,
  updateStartupInfo,
} from '../controllers/startup/startupController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerStartup);
router.route('/invest/:id').patch(protect, investStartup);
router.route('/update/:id').patch(protect, updateStartupInfo);

export default router;
