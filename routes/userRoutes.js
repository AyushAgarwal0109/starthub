import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/userController.js';
import verifyContact from '../controllers/verifyContact.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);
router.route('/verify').post(protect, verifyContact);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
