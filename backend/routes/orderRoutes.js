const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getRestaurantOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, isSuperAdminOrRestaurantAdmin } = require('../middleware/authMiddleware');
const { orderRules, validate } = require('../validators');

router.post('/', protect, orderRules, validate, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/restaurant/:restaurantId', protect, isSuperAdminOrRestaurantAdmin, getRestaurantOrders);
// Fix #23: New order status update endpoint for restaurant admins
router.patch('/:id/status', protect, isSuperAdminOrRestaurantAdmin, updateOrderStatus);

module.exports = router;
