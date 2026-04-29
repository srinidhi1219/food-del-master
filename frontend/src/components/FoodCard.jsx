import { Plus } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { formatInr } from '../utils/currency';

const FoodCard = ({ food }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={food.image} 
          alt={food.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-sm font-bold text-orange-600 shadow-sm">
          {formatInr(food.price)}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{food.name}</h3>
          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
            {food.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>
        <button 
          onClick={() => addToCart(food)}
          className="w-full flex items-center justify-center space-x-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
        >
          <Plus className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
