const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  getRestaurantFoods,
  addRestaurantReview,
  createRestaurant,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect, isSuperAdmin, isSuperAdminOrRestaurantAdmin } = require('../middleware/authMiddleware');
const { restaurantRules, reviewRules, validate } = require('../validators');

router.get('/', getRestaurants);
router.get('/mine', protect, isSuperAdminOrRestaurantAdmin, getMyRestaurants);
router.post('/', protect, isSuperAdminOrRestaurantAdmin, restaurantRules, validate, createRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', protect, isSuperAdminOrRestaurantAdmin, restaurantRules, validate, updateRestaurant);
router.delete('/:id', protect, isSuperAdminOrRestaurantAdmin, deleteRestaurant);
// getRestaurantFoods is public — pass req.user optionally for admin visibility of unavailable items
router.get('/:id/foods', (req, res, next) => {
  // Optionally decode user if cookie present, but don't block unauthenticated requests
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).select('-password').then(user => {
        req.user = user;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
}, getRestaurantFoods);
router.post('/:id/reviews', protect, reviewRules, validate, addRestaurantReview);

module.exports = router;
