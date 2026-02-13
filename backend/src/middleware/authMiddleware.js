import jwt from 'jsonwebtoken';
import { User } from '../../database/models/index.js';


export const protectRoute = async (req, res, next) => {
  try {
    
    console.log('[DEBUG] protectRoute - Request URL:', req.originalUrl);
    console.log('[DEBUG] protectRoute - Cookies received:', req.cookies);
    console.log('[DEBUG] protectRoute - Cookie header:', req.headers.cookie);
    console.log('[DEBUG] protectRoute - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('[DEBUG] protectRoute - JWT_SECRET value:', process.env.JWT_SECRET);
    
    const token = req.cookies.jwt;
    console.log('[DEBUG] protectRoute - Token from cookie:', token ? (token.substring(0, 20) + '...') : 'NO TOKEN');

    if (!token) {
      console.log('[DEBUG] protectRoute - NO TOKEN FOUND - returning 401');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[DEBUG] protectRoute - Token decoded successfully:', decoded);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export default { protectRoute };
