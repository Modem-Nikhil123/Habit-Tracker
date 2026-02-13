import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../database/models/index.js';
import { generateToken } from '../lib/token.js';


export const signup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    
    if (!email || !fullName || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = await User.create({
      email: email.toLowerCase(),
      fullName,
      password: hashedPassword,
    });

    
    generateToken(user._id, res);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    
    console.log('[DEBUG] login - About to generate token for user:', user._id);
    generateToken(user._id, res);
    console.log('[DEBUG] login - Token generated, checking response cookies');
    console.log('[DEBUG] login - Response Set-Cookie header:', res.getHeaders()['set-cookie']);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};


export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};


export const protectRoute = async (req, res, next) => {
  try {
    
    console.log('[DEBUG] protectRoute (auth.js) - Request URL:', req.originalUrl);
    console.log('[DEBUG] protectRoute (auth.js) - Cookies received:', req.cookies);
    console.log('[DEBUG] protectRoute (auth.js) - Cookie header:', req.headers.cookie);
    console.log('[DEBUG] protectRoute (auth.js) - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('[DEBUG] protectRoute (auth.js) - JWT_SECRET value:', process.env.JWT_SECRET);
    
    const token = req.cookies.jwt;
    console.log('[DEBUG] protectRoute (auth.js) - Token from cookie:', token ? (token.substring(0, 20) + '...') : 'NO TOKEN');

    if (!token) {
      console.log('[DEBUG] protectRoute (auth.js) - NO TOKEN FOUND - returning 401');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[DEBUG] protectRoute (auth.js) - Token decoded successfully:', decoded);

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


export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export default { signup, login, logout, protectRoute, checkAuth };
