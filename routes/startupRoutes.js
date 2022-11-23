import express from 'express';
const router = express.Router();
import {
  registerStartup,
  investStartup,
  updateStartupInfo,
  getAllStartups,
  getStartupInfo,
} from '../controllers/startup/startupController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerStartup);
router.route('/all').get(getAllStartups);
router.route('/info/:id').get(getStartupInfo);
router.route('/invest/:id').post(protect, investStartup);
router.route('/update/:id').patch(protect, updateStartupInfo);

export default router;
