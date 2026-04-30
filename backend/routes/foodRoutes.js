const express = require('express');
const router = express.Router();
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, isSuperAdminOrRestaurantAdmin } = require('../middleware/authMiddleware');
const { foodRules, validate } = require('../validators');

router.get('/', getFoods);
router.post('/', protect, isSuperAdminOrRestaurantAdmin, foodRules, validate, createFood);
router.get('/:id', getFoodById);
router.put('/:id', protect, isSuperAdminOrRestaurantAdmin, validate, updateFood);
router.delete('/:id', protect, isSuperAdminOrRestaurantAdmin, deleteFood);

module.exports = router;
