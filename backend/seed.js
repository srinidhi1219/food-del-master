const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food-delivery')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const restaurantsData = [
    {
        name: 'Babai Hotel',
        description: 'Authentic South Indian tiffins and meals.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '20-30 min'
    },
    {
        name: 'Minerva Coffee Shop',
        description: 'A classic spot for comforting South Indian cuisine.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '30-40 min'
    },
    {
        name: 'Sweet Magic',
        description: 'Known for delightful sweets, bakery items, and meals.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '25-35 min'
    },
    {
        name: 'Crossroads Restaurant',
        description: 'Flavorful Biryani and spicy Andhra specialties.',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '35-45 min'
    },
    {
        name: 'Barkaas Arabic Restaurant',
        description: 'Popular for authentic Mandi and Middle Eastern delicacies.',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '40-50 min'
    },
    {
        name: 'Ironhill Cafe',
        description: 'A vibrant cafe serving loaded burgers, pizzas, and shakes.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
        rating: +(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
        deliveryTime: '30-45 min'
    }
];

const seedDB = async () => {
    try {
        await Restaurant.deleteMany({});
        await Food.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        const createdRestaurants = await Restaurant.insertMany(restaurantsData);

        const foodsData = [
            {
                name: 'Idli Babai',
                description: 'Super soft idlis served with famous ghee, podi, and chutney.',
                price: 60,
                image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                category: 'South Indian',
                restaurant: createdRestaurants[0]._id
            },
            {
                name: 'MLA Dosa',
                description: 'Signature dosa served with potato filling and a rich Andhra-style topping.',
                price: 130,
                image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800',
                category: 'South Indian',
                restaurant: createdRestaurants[0]._id
            },
            {
                name: 'Filter Coffee',
                description: 'Traditional South Indian decoction coffee served hot and frothy.',
                price: 30,
                image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
                category: 'Beverages',
                restaurant: createdRestaurants[0]._id
            },
            {
                name: 'Plain Dosa',
                description: 'Crisp dosa served with chutneys and sambar.',
                price: 80,
                image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800',
                category: 'South Indian',
                restaurant: createdRestaurants[1]._id
            },
            {
                name: 'Andhra Meals',
                description: 'Rice meal with dal, curry, chutney, papad, and curd-style accompaniments.',
                price: 220,
                image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800',
                category: 'Meals',
                restaurant: createdRestaurants[1]._id
            },
            {
                name: 'Kova Sweet',
                description: 'Classic milk-based sweet popular for quick takeaways and gifting.',
                price: 120,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ_wqLRk40WE0TDcYj8_SKbD_tdGy_ST2b-w&s',
                category: 'Sweets',
                restaurant: createdRestaurants[2]._id
            },
            {
                name: 'Special Chicken Biryani',
                description: 'Andhra-style biryani with fry pieces and gravy on the side.',
                price: 299,
                image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
                category: 'Biryani',
                restaurant: createdRestaurants[3]._id
            },
            {
                name: 'Chicken Mandi',
                description: 'Traditional slow-cooked meat with spiced rice, served with garlic mayo.',
                price: 450,
                image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800',
                category: 'Arabic',
                restaurant: createdRestaurants[4]._id
            },
            {
                name: 'Peri Peri Burger',
                description: 'Spicy chicken patty with peri peri sauce, cheese, and fresh veggies.',
                price: 180,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
                category: 'Fast Food',
                restaurant: createdRestaurants[5]._id
            },
            {
                name: 'Margherita Pizza',
                description: 'Classic cheese and tomato pizza with a wood-fired crust.',
                price: 250,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
                category: 'Pizza',
                restaurant: createdRestaurants[5]._id
            }
        ];

        await Food.insertMany(foodsData);
        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
