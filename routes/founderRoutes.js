import express from 'express';
const router = express.Router();
import {
  getFounderProfile,
  registerFounder,
} from '../controllers/founder/founderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerFounder);
router.route('/profile').get(protect, getFounderProfile);

export default router;
