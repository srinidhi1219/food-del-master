const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fix #6: Added null user check — if user deleted after token issued, reject cleanly
const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Super Admin access required' });
};

const isSuperAdminOrRestaurantAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'RESTAURANT_ADMIN')) {
    return next();
  }
  return res.status(403).json({ message: 'Super Admin or Restaurant Admin access required' });
};

const isRestaurantAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'RESTAURANT_ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Restaurant Admin access required' });
};

module.exports = { protect, isSuperAdmin, isSuperAdminOrRestaurantAdmin, isRestaurantAdmin };
