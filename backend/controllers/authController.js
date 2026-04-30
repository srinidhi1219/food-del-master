const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const createAuthUser = async ({ name, email, password, role }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
};

// Fix #10: role is NOT accepted from req.body — always CUSTOMER on public signup
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await createAuthUser({
      name,
      email,
      password,
      role: 'CUSTOMER', // Always CUSTOMER — RESTAURANT_ADMIN assigned only by SUPER_ADMIN
    });

    const token = generateToken(user._id);
    res.cookie('jwt', token, cookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const registerVendor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await createAuthUser({
      name,
      email,
      password,
      role: 'RESTAURANT_ADMIN',
    });

    const token = generateToken(user._id);
    res.cookie('jwt', token, cookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.cookie('jwt', token, cookieOptions);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(200).json(null);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      // Token invalid/expired — clear cookie and treat as logged out
      res.cookie('jwt', '', { ...cookieOptions, expires: new Date(0) });
      return res.status(200).json(null);
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      // User deleted — clear cookie and treat as logged out
      res.cookie('jwt', '', { ...cookieOptions, expires: new Date(0) });
      return res.status(200).json(null);
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'RESTAURANT_ADMIN' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, registerVendor, loginUser, logoutUser, getMe, getVendors };
