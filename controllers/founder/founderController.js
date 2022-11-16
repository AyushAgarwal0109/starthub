import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import User from '../../models/user.js';
import Founder from '../../models/founder.js';

// @desc    Register a new Founder
// @route    POST /api/founders
// @access   Private
const registerFounder = asyncHandler(async (req, res) => {
  let { phone, gender, dob, state, city } = req.body;
  const { _id } = req.user;

  gender = gender.toLowerCase();
  state = state.toLowerCase();
  city = city.toLowerCase();

  let registerSchema = Joi.object({
    phone: Joi.string()
      .pattern(new RegExp(/\+?([\d|\(][\h|\(\d{3}\)|\.|\-|\d]{4,}\d)/))
      .required(),
    gender: Joi.string().required().valid('male', 'female', 'other'),
    dob: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
  });

  let error = registerSchema.validate({
    phone,
    gender,
    dob,
    state,
    city,
  }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid data input');
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

  const founderExists = await Founder.findById(_id);
  if (founderExists) {
    res.status(400);
    throw new Error('Founder already exists');
  }

  const getAge = (dob) => {
    var dob = new Date(dob);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    var age = Math.abs(year - 1970);
    return age;
  };

  const founder = await Founder.create({
    _id,
    phone,
    gender,
    dob,
    age: getAge(dob),
    addr: {
      state,
      city,
    },
  });

  user.role = 'founder';
  await user.save();

  if (founder) {
    res.status(201).json({
      name: user.name,
      email: user.email,
      founder,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { registerFounder };
