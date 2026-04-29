const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, getRestaurantFoods, addRestaurantReview } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/foods', getRestaurantFoods);
router.post('/:id/reviews', protect, addRestaurantReview);

module.exports = router;
