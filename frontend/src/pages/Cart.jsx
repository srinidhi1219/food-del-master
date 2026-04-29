import { Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { formatInr } from '../utils/currency';

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to checkout");
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="flex-grow bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-md">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-600">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="mt-4 inline-block bg-orange-600 text-white font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition-colors">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6" />
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-center w-full">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="mt-1 text-orange-600 font-bold">{formatInr(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => decreaseQuantity(item._id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item._id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            <div className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
              Total: <span className="text-orange-600">{formatInr(totalAmount)}</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={clearCart}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Clear Cart
              </button>
              <button 
                onClick={handleCheckout}
                className="px-8 py-3 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors shadow-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
