const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;
    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        deliveryAddress
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.food');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders };
