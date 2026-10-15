
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import Login from '../modal/login.js';


export const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // Check if header format is 'Bearer <token>'
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Extract token string
      token = authHeader.split(' ')[1];

      // Verify token signature and payload
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("jwt token", decoded);

      // Find user from decoded payload (decoded.id)
      const user = Login.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User associated with token no longer exists' });
      }

      // Attach sanitized user data to request object
      req.user = Login.sanitizeUser(user);

      return next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided in Authorization header' });
  }
};
