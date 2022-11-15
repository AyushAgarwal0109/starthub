import asyncHandler from 'express-async-handler';
import Joi from 'joi';

import user from '../models/user.js';
import otpToken from '../models/otpToken.js';

const verifyContact = asyncHandler(async (req, res, next) => {
  let { otp, contact } = req.body;

  let loginSchema = Joi.object({
    contact: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'in', 'edu'] },
      })
      .required(),
  });

  // ************** validating  email **************
  const { error } = loginSchema.validate({ contact });

  if (error) {
    res.status(400);
    throw new Error(
      'Given email pattern does not match. Please enter valid email'
    );
  }

  let result = await user.findOne({ email: contact });

  if (!result) {
    res.status(400);
    throw new Error('User does not exist');
  } else {
    let Token = await otpToken.findOne({
      $and: [{ _id: result._id }, { otpToken: parseInt(otp) }],
    });
    if (!Token) {
      res.status(400);
      throw new Error('Invalid OTP');
    }
    result.verified.email = true;
    await result.save();
  }

  res.json({
    status: 'success',
    message: `${contact} is sucessfully verified`,
  });
});

export default verifyContact;
