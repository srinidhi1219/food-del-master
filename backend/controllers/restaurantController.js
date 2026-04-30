const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const User = require('../models/User');

const getRestaurants = async (req, res) => {
  try {
    // Fix #19: pagination support
    const page = parseInt(req.query.page) || 0;
    const limit = 20;
    const restaurants = await Restaurant.find({}).limit(limit).skip(page * limit);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantFoods = async (req, res) => {
  try {
    // Fix #21: filter by isAvailable for public consumers
    const isAdmin = req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'RESTAURANT_ADMIN');
    const query = { restaurant: req.params.id };
    if (!isAdmin) query.isAvailable = true;

    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRestaurantReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const alreadyReviewed = restaurant.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Restaurant already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    restaurant.reviews.push(review);
    restaurant.numReviews = restaurant.reviews.length;
    restaurant.rating =
      restaurant.reviews.reduce((acc, item) => item.rating + acc, 0) /
      restaurant.reviews.length;

    await restaurant.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, description, image, deliveryTime, ownerId } = req.body;

    // Fix #3: Validate that the provided ownerId is an actual RESTAURANT_ADMIN
    let restaurantOwnerId = req.user._id;
    if (req.user.role === 'SUPER_ADMIN' && ownerId) {
      const owner = await User.findById(ownerId);
      if (!owner || owner.role !== 'RESTAURANT_ADMIN') {
        return res.status(400).json({ message: 'Provided owner must be an existing RESTAURANT_ADMIN user' });
      }
      restaurantOwnerId = ownerId;
    }

    const restaurant = new Restaurant({
      ownerId: restaurantOwnerId,
      name,
      description,
      image,
      deliveryTime,
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRestaurants = async (req, res) => {
  try {
    let restaurants;
    if (req.user.role === 'SUPER_ADMIN') {
      restaurants = await Restaurant.find({});
    } else {
      restaurants = await Restaurant.find({ ownerId: req.user._id });
    }
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { name, description, image, deliveryTime } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.image = image || restaurant.image;
    restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (req.user.role !== 'SUPER_ADMIN' && restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }

    // Clean up all foods belonging to this restaurant on delete
    await Food.deleteMany({ restaurant: req.params.id });
    await Restaurant.deleteOne({ _id: req.params.id });
    res.json({ message: 'Restaurant and all its menu items removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantFoods,
  addRestaurantReview,
  createRestaurant,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
};
