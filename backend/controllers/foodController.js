const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

const getFoods = async (req, res) => {
  try {
    // Fix #19: pagination support
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.isAvailable !== undefined) query.isAvailable = req.query.isAvailable !== 'false';

    const foods = await Food.find(query)
      .limit(limit)
      .skip(page * limit);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, description, price, image, category, restaurant } = req.body;

    const parentRestaurant = await Restaurant.findById(restaurant);
    if (!parentRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && parentRestaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add items for this restaurant' });
    }

    const food = new Food({ name, description, price, image, category, restaurant });
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable } = req.body;
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    const parentRestaurant = await Restaurant.findById(food.restaurant);
    if (!parentRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && parentRestaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit items for this restaurant' });
    }

    food.name = name || food.name;
    food.description = description || food.description;
    food.price = price != null ? price : food.price;
    food.image = image || food.image;
    food.category = category || food.category;
    // Fix #21: isAvailable flag support
    if (isAvailable !== undefined) food.isAvailable = isAvailable;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Fix #8: Orphaned food auth bypass — if restaurant no longer exists, ONLY super admin can delete
    const parentRestaurant = await Restaurant.findById(food.restaurant);
    if (!parentRestaurant) {
      if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Not authorized — parent restaurant not found' });
      }
    } else if (req.user.role !== 'SUPER_ADMIN' && parentRestaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete items for this restaurant' });
    }

    await Food.deleteOne({ _id: req.params.id });
    res.json({ message: 'Food removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };
