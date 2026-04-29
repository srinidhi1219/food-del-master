const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'out_for_delivery', 'delivered'], default: 'pending' },
  deliveryAddress: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
