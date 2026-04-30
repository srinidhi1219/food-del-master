const express = require('express');
const router = express.Router();
const { registerUser, registerVendor, loginUser, logoutUser, getMe, getVendors } = require('../controllers/authController');
const { protect, isSuperAdmin } = require('../middleware/authMiddleware');
const { registerRules, loginRules, validate } = require('../validators');

router.post('/register', registerRules, validate, registerUser);
router.post('/register-vendor', registerRules, validate, registerVendor);
router.post('/login', loginRules, validate, loginUser);
router.post('/logout', logoutUser);
// Session-check endpoint: returns user if logged in, otherwise null (no 401 noise on app load)
router.get('/me', getMe);
router.get('/vendors', protect, isSuperAdmin, getVendors);

module.exports = router;
