import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'revibe_secret_jwt_key_fallback_2026'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been suspended' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[AuthMiddleware] Error verifying token:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
