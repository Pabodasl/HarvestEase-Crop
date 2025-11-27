const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes and verify the token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from header
      // Verify token using the same secret and payload fields used when signing
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Attach user data to the request
      req.user = await User.findById(decoded.id).select('-password');
      next(); // Proceed to the next middleware
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user has the required role
const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};

module.exports = { protect, roleAuth };  // Ensure roleAuth is exported here
