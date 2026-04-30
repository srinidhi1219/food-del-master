const Order = require('../models/Order');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant'); // Fix #5: moved require to top of file

const createOrder = async (req, res) => {
  try {
    // Fix #4: totalAmount is NOT accepted from client — computed server-side to prevent price manipulation
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const foodIds = items.map((item) => item.food);
    const foods = await Food.find({ _id: { $in: foodIds } }).select('restaurant price');

    if (foods.length !== foodIds.length) {
      return res.status(400).json({ message: 'One or more food items are invalid' });
    }

    const restaurantIds = new Set(foods.map((food) => String(food.restaurant)));
    if (restaurantIds.size > 1) {
      return res.status(400).json({ message: 'You can only order items from one restaurant at a time' });
    }

    // Server-side price computation — clients cannot manipulate this
    const foodMap = new Map(foods.map((f) => [String(f._id), f]));
    const totalAmount = items.reduce((sum, item) => {
      const food = foodMap.get(String(item.food));
      return sum + (food ? food.price * item.quantity : 0);
    }, 0);

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      restaurant: Array.from(restaurantIds)[0],
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    // Fix #19: pagination support — page query param defaults to 0
    const page = parseInt(req.query.page) || 0;
    const limit = 10;
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(page * limit);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view orders for this restaurant' });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('items.food')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(page * limit);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fix #23: New endpoint — allows RESTAURANT_ADMIN to update their order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    // Mark paymentStatus as paid when order is confirmed from pending
    if (status === 'preparing' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getRestaurantOrders, updateOrderStatus };
