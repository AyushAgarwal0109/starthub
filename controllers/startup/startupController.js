import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import User from '../../models/user.js';
import Founder from '../../models/founder.js';
import Investor from '../../models/investor.js';
import Startup from '../../models/startup.js';

// @desc    Register a new Startup
// @route    POST /api/startup
// @access   Private
const registerStartup = asyncHandler(async (req, res) => {
  let {
    name,
    description,
    inceptionDate,
    type,
    sector,
    stage,
    turnover,
    city,
    url,
    gstin,
    investmentRaised,
  } = req.body;
  const { _id, role } = req.user;

  name = name.toLowerCase();
  description = description.toLowerCase();
  type = type.toLowerCase();
  sector = sector.toLowerCase();
  stage = stage.toLowerCase();
  city = city.toLowerCase();

  let registerSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(100).required(),
    inceptionDate: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid(
        'private limited company',
        'registered partnership firm',
        'limited liability partnership'
      ),
    sector: Joi.string().required(),
    stage: Joi.string()
      .required()
      .valid(
        'idea stage',
        'proof of concept',
        'beta launched',
        'early traction',
        'steady revenues'
      ),
    turnover: Joi.number().required(),
    city: Joi.string().required(),
    url: Joi.string(),
    investmentRaised: Joi.number(),
  });

  let error = registerSchema.validate({
    name,
    description,
    inceptionDate,
    type,
    sector,
    stage,
    turnover,
    city,
    url,
    investmentRaised,
  }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid data input');
  }

  registerSchema = Joi.object({
    gstin: Joi.string().pattern(
      new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)
    ),
  });

  error = registerSchema.validate({ gstin }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid GSTIN Number');
  }

  const user = await User.findById(_id);
  if (!user) {
    res.status(400);
    throw new Error('User not registered');
  }

  const founder = await Founder.findById(_id);
  if (!founder || role !== 'founder') {
    res.status(400);
    throw new Error('User not registered as founder');
  }

  const startupExists = await Startup.findOne({
    $and: [{ founder: _id }, { name: name }],
  });

  if (startupExists) {
    res.status(400);
    throw new Error('Startup already registered');
  }

  const getAge = (dob) => {
    var dob = new Date(dob);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);
    return age;
  };

  const startup = await Startup.create({
    founder: _id,
    name,
    description,
    inceptionDate,
    existenceYears: getAge(inceptionDate),
    type,
    sector,
    stage,
    turnover,
    city,
    url,
  });

  if (startup && gstin) {
    startup.gstin = gstin;
    await startup.save();
  }

  if (startup && investmentRaised) {
    startup.investmentRaised = investmentRaised;
    await startup.save();
  }

  if (startup) {
    res.status(201).json({
      founder,
      startup,
    });
  } else {
    res.status(400);
    throw new Error('Invalid startup data');
  }
});

// @desc    Invest in a startup
// @route    POST /api/startup/invest/:id
// @access   Private
const investStartup = asyncHandler(async (req, res) => {
  const { noofstocks } = req.body;
  const { _id, role } = req.user;
  const { id } = req.params;

  let investmentSchema = Joi.object({
    noofstocks: Joi.number().min(1),
  });

  let error = investmentSchema.validate({ noofstocks }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid data input');
  }

  if (!_id || !role || role !== 'investor') {
    res.status(400);
    throw new Error('Invalid user');
  }

  const investor = await Investor.findById(_id);
  if (!investor) {
    res.status(400);
    throw new Error('Investor not registered');
  }

  const startup = await Startup.findById(id);
  if (!startup) {
    res.status(400);
    throw new Error('Startup not registered');
  }

  if (noofstocks > startup.availableStocks) {
    res.status(400);
    throw new Error('Stocks unavailable');
  }

  startup.investors.push({
    name: _id,
    investment: startup.currentStockPrice * noofstocks,
  });
  startup.availableStocks -= noofstocks;
  startup.stocksSold += noofstocks;
  startup.investmentRaised += startup.currentStockPrice * noofstocks;
  await startup.save();

  res.status(200).json({
    startup,
  });
});

// @desc    Update startup information
// @route    PATCH /api/startup/update/:id
// @access   Private
const updateStartupInfo = asyncHandler(async (req, res) => {
  const { availableStocks, currentStockPrice } = req.body;
  const { _id, role } = req.user;
  const { id } = req.params;

  let infoSchema = Joi.object({
    availableStocks: Joi.number(),
    currentStockPrice: Joi.number(),
  });

  let error = infoSchema.validate({ availableStocks, currentStockPrice }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid data input');
  }

  if (!_id || !role || role !== 'founder') {
    res.status(400);
    throw new Error('Invalid user');
  }

  const founder = await Founder.findById(_id);
  if (!founder) {
    res.status(400);
    throw new Error('Founder not registered');
  }

  const startup = await Startup.findById(id);
  if (!startup) {
    res.status(400);
    throw new Error('Startup not registered');
  }

  if (!startup.founder.equals(_id)) {
    res.status(400);
    throw new Error('Startup not owned by the current founder');
  }

  startup.availableStocks = availableStocks;
  startup.currentStockPrice = currentStockPrice;
  await startup.save();

  res.status(200).json({
    startup,
  });
});

// @desc    Get startup info
// @route    GET /api/startup/info/:id
// @access   Public
const getStartupInfo = asyncHandler(async (req, res) => {
  const startup = await Startup.findById(req.params.id);

  if (startup) {
    res.json({
      startup,
    });
  } else {
    res.status(404);
    throw new Error('Startup not registered');
  }
});

// @desc    Get all startups
// @route    GET /api/startup/all
// @access   Public
const getAllStartups = asyncHandler(async (req, res) => {
  const startups = await Startup.find();
  if (startups) {
    res.json({
      startups,
      count: startups.length,
    });
  } else {
    res.status(404);
    throw new Error('No startups found');
  }
});

export {
  registerStartup,
  investStartup,
  updateStartupInfo,
  getStartupInfo,
  getAllStartups,
};
