import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Filter } from 'lucide-react';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Pizza', 'Burger', 'Sushi', 'Salad', 'Dessert'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, restaurantsRes] = await Promise.all([
          axios.get('/api/food'),
          axios.get('/api/restaurants')
        ]);
        setFoods(foodsRes.data);
        setRestaurants(restaurantsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          food.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Fix #16: use spread copy to avoid mutating state-derived array in place
  if (sortBy === 'price-low') {
    filteredFoods = [...filteredFoods].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredFoods = [...filteredFoods].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Delicious Food, Delivered Fast</h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Craving something special? Explore our menu and find your next favorite meal.
          </p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-600 focus:ring-white focus:border-white sm:text-sm transition duration-150 ease-in-out shadow-lg"
              placeholder="Search for food or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-white text-orange-600' 
                  : 'bg-orange-500 hover:bg-orange-400 text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            {/* Restaurants Section */}
            {!searchTerm && activeCategory === 'All' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {restaurants.map(restaurant => (
                    <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group block">
                      <div className="h-40 overflow-hidden relative">
                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-bold flex items-center shadow-sm text-gray-800">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          {restaurant.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{restaurant.name}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-1">{restaurant.description}</p>
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <Clock className="h-4 w-4 mr-1 text-orange-500" />
                          {restaurant.deliveryTime}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Dishes Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? 'Search Results' : (activeCategory !== 'All' ? `${activeCategory} Dishes` : 'Popular Dishes')}
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500 px-3 py-2 border shadow-sm outline-none"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredFoods.map(food => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>

              {filteredFoods.length === 0 && (
                <div className="text-center text-gray-500 mt-12">
                  No foods found matching your search.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
