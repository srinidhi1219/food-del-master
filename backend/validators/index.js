const { body, validationResult } = require('express-validator');

// Reusable middleware to return 400 if validation fails
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    return res.status(400).json({
      message: allErrors[0]?.msg || 'Validation failed',
      errors: allErrors,
    });
  }
  next();
};

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const restaurantRules = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('description').trim().isLength({ min: 5, max: 500 }).withMessage('Description must be 5–500 characters'),
  body('image').notEmpty().withMessage('Image URL required'),
  body('deliveryTime').trim().notEmpty().withMessage('Delivery time required'),
];

const foodRules = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('description').trim().isLength({ min: 5, max: 500 }).withMessage('Description must be 5–500 characters'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category required'),
  body('restaurant').isMongoId().withMessage('Valid restaurant ID required'),
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5, max: 1000 }).withMessage('Comment must be 5–1000 characters'),
];

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.food').isMongoId().withMessage('Each item must have a valid food ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item quantity must be at least 1'),
  body('deliveryAddress').trim().isLength({ min: 5 }).withMessage('Delivery address required'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  restaurantRules,
  foodRules,
  reviewRules,
  orderRules,
};
