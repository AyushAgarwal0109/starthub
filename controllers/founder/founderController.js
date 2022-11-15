import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import Founder from '../../models/founder.js';

// @desc    Register a new Founder
// @route    POST /api/users/founder
// @access   Private
const registerFounder = asyncHandler(async (req, res) => {});

export { registerFounder };
