const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
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
    const foods = await Food.find({ restaurant: req.params.id }).populate('restaurant');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRestaurantReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
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
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRestaurants, getRestaurantById, getRestaurantFoods, addRestaurantReview };
