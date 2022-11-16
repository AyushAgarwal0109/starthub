import asyncHandler from 'express-async-handler';
import Joi from 'Joi';

import OtpService from '../../services/OtpService.js';
import generateToken from '../../utils/generateToken.js';

import User from '../../models/user.js';
import otpToken from '../../models/otpToken.js';

// @desc    Auth user & get token
// @route    POST /api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route    POST /api/users
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;

  name = name.toLowerCase();

  let signSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'in', 'edu'] },
      })
      .required(),
  });

  let error = signSchema.validate({ name, email }).error;

  if (error) {
    res.status(400);
    throw new Error('Invalid data input');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  signSchema = Joi.object({
    password: Joi.string()
      .pattern(
        new RegExp(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'
        )
      )
      .required(),
    confirmPassword: Joi.ref('password'),
  });

  error = signSchema.validate({ password, confirmPassword }).error;

  if (error) {
    res.status(400);
    throw new Error(
      'Password should atleast contain 8 characters, one uppercase, one lowercase, one digit and one symbol.'
    );
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  let otp = OtpService.generateOtp();

  const otpRes = await otpToken.create({ _id: user._id, otpToken: otp });

  if (user && otpRes) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      otp: otp,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route    POST /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, registerUser, getUserProfile };
