import express from 'express';
const router = express.Router();
import { registerInvestor } from '../controllers/investor/investorController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerInvestor);

export default router;
