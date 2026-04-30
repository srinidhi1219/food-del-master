const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['CUSTOMER', 'SUPER_ADMIN', 'RESTAURANT_ADMIN'], default: 'CUSTOMER' },
}, { timestamps: true });

// email already has an index via unique: true — no need for a separate schema.index() call

module.exports = mongoose.model('User', userSchema);
