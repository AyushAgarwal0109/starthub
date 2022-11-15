import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log(decoded);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not Authorized, No Token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not Authorized, No Token');
  }
});

export { protect };
