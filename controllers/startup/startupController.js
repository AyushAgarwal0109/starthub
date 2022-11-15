import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import Startup from '../../models/startup.js';

// @desc    Register a new Startup
// @route    POST /api/users/startup
// @access   Private
const registerStartup = asyncHandler(async (req, res) => {});

export { registerStartup };
