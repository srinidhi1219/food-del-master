import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { formatInr } from '../utils/currency';

const Profile = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        // Sort by newest first
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.food ? item.food.name : 'Unknown Item'}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-orange-600">{formatInr(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;