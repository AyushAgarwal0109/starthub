import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import Investor from '../../models/investor.js';

// @desc    Register a new Investor
// @route    POST /api/users/investor
// @access   Private
const registerInvestor = asyncHandler(async (req, res) => {});

export { registerInvestor };
