const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  // Fix #21: isAvailable flag — lets admins mark items unavailable without deleting
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

// Fix #20: compound indexes for common queries
foodSchema.index({ restaurant: 1 });
foodSchema.index({ category: 1 });
foodSchema.index({ restaurant: 1, isAvailable: 1 });

module.exports = mongoose.model('Food', foodSchema);
