import express from 'express';
const router = express.Router();
import {
  getInvestedStartups,
  getInvestorProfile,
  registerInvestor,
} from '../controllers/investor/investorController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerInvestor);
router.route('/profile').get(protect, getInvestorProfile);
router.route('/startups').get(protect, getInvestedStartups);

export default router;
