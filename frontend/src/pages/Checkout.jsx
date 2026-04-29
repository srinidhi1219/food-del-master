import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import { formatInr } from '../utils/currency';

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderItems = cart.map(item => ({
        food: item._id,
        quantity: item.quantity
      }));
      
      const deliveryAddress = `${formData.address}, ${formData.city}, ${formData.zip}`;
      
      await axios.post('/api/orders', {
        items: orderItems,
        totalAmount,
        deliveryAddress
      });
      
      setLoading(false);
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error('Checkout failed', error);
      setLoading(false);
      alert('Checkout failed. Please try again.');
    }
  };

  if (!user || cart.length === 0) return null;

  return (
    <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
          {/* Order Summary */}
          <div className="md:w-1/3 bg-gray-100 p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-medium">{formatInr(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-600">{formatInr(totalAmount)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:w-2/3 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">Delivery Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House No, Street, Locality"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Vijayawada / Area"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    <input
                      type="text"
                      name="zip"
                      required
                      placeholder="PIN Code"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-3 text-gray-900">Payment Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    maxLength="16"
                    placeholder="Card Number (16 digits)"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="expiry"
                      required
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    <input
                      type="text"
                      name="cvv"
                      required
                      maxLength="4"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing Payment...' : `Pay ${formatInr(totalAmount)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
