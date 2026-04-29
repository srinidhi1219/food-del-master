import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import useAuthStore from '../store/useAuthStore';
import { Star, Clock } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [resResponse, foodsResponse] = await Promise.all([
          axios.get(`/api/restaurants/${id}`),
          axios.get(`/api/restaurants/${id}/foods`)
        ]);
        setRestaurant(resResponse.data);
        setFoods(foodsResponse.data);
      } catch (error) {
        console.error('Failed to fetch restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    try {
      await axios.post(`/api/restaurants/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      // Refresh restaurant data to show the new review
      const resResponse = await axios.get(`/api/restaurants/${id}`);
      setRestaurant(resResponse.data);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-gray-600">
        Restaurant not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 w-full">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-white mb-2">{restaurant.name}</h1>
            <p className="text-gray-200 text-lg mb-4">{restaurant.description}</p>
            <div className="flex items-center text-white space-x-6">
              <span className="flex items-center font-bold">
                <Star className="h-5 w-5 text-yellow-400 mr-2 fill-current" />
                {restaurant.rating.toFixed(1)} ({restaurant.numReviews} Reviews)
              </span>
              <span className="flex items-center font-bold">
                <Clock className="h-5 w-5 text-orange-400 mr-2" />
                {restaurant.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
          {foods.length === 0 ? (
            <p className="text-gray-500">No foods available for this restaurant yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {foods.map(food => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={submitReview}>
                {reviewError && <div className="text-red-500 text-sm mb-2">{reviewError}</div>}
                {reviewSuccess && <div className="text-green-500 text-sm mb-2">{reviewSuccess}</div>}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea 
                    required
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-gray-600 mb-3 text-sm">Please log in to write a review.</p>
                <Link to="/login" className="inline-block bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium">Log In</Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map(review => (
                <div key={review._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{review.name}</span>
                    <span className="flex items-center text-sm font-bold text-yellow-500">
                      {review.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantDetail;
