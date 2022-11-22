import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import User from '../../models/user.js';
import Investor from '../../models/investor.js';
import Startup from '../../models/startup.js';

// @desc    Register a new Investor
// @route    POST /api/investors
// @access   Private
const registerInvestor = asyncHandler(async (req, res) => {
  let { phone, gender, dob, occupation, budget, state, city, gstin } = req.body;
  const { _id } = req.user;

  gender = gender.toLowerCase();
  occupation = occupation.toLowerCase();
  state = state.toLowerCase();
  city = city.toLowerCase();

  let registerSchema = Joi.object({
    phone: Joi.string()
      .pattern(new RegExp(/\+?([\d|\(][\h|\(\d{3}\)|\.|\-|\d]{4,}\d)/))
      .required(),
    gender: Joi.string().required().valid('male', 'female', 'other'),
    dob: Joi.string().required(),
    occupation: Joi.string()
      .required()
      .valid(
        'business owner',
        'professional',
        'angel network',
        'family office',
        'startup founder',
        'incubator',
        'student',
        'other'
      ),
    budget: Joi.number().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
  });

  let error = registerSchema.validate({
    phone,
    gender,
    dob,
    occupation,
    budget,
    state,
    city,
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

  if (user.role) {
    res.status(400);
    throw new Error('User already registered as founder or investor');
  }

  const investorExists = await Investor.findById(_id);
  if (investorExists) {
    res.status(400);
    throw new Error('Investor already exists');
  }

  const getAge = (dob) => {
    var dob = new Date(dob);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);
    return age;
  };

  const investor = await Investor.create({
    _id,
    phone,
    gender,
    dob,
    age: getAge(dob),
    occupation,
    budget,
    addr: {
      state,
      city,
    },
  });

  if (investor && gstin) {
    investor.gstin = gstin;
    await investor.save();
  }

  user.role = 'investor';
  await user.save();

  if (investor) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      investor,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get investor profile
// @route    GET /api/investors/profile
// @access   Private
const getInvestorProfile = asyncHandler(async (req, res) => {
  const investor = await Investor.findById(req.user._id).populate(
    '_id',
    'name email verified role'
  );
  if (investor) {
    res.json({
      investor,
    });
  } else {
    res.status(404);
    throw new Error('Not registered as an Investor');
  }
});

// @desc    Get startups invested into
// @route    GET /api/investors/startups
// @access   Private
const getInvestedStartups = asyncHandler(async (req, res) => {
  const startups = await Startup.find({
    'investors.name': req.user._id,
  }).select(
    'founder investors name description availableStocks currentStockPrice existenceYears type sector city'
  );

  if (startups) {
    res.json({
      startups,
      count: startups.length,
    });
  } else {
    res.status(404);
    throw new Error('Not invested in any startups');
  }
});

export { registerInvestor, getInvestorProfile, getInvestedStartups };
