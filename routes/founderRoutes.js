import express from 'express';
const router = express.Router();
import {
  getFounderProfile,
  registerFounder,
  getStartupInfo,
} from '../controllers/founder/founderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerFounder);
router.route('/profile').get(protect, getFounderProfile);
router.route('/startup').get(protect, getStartupInfo);

export default router;
