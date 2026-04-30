import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [restaurants, setRestaurants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [foodLoading, setFoodLoading] = useState(false);

  // Forms limits
  const [resName, setResName] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resTime, setResTime] = useState('');
  const [resImage, setResImage] = useState(null);
  const [resOwner, setResOwner] = useState('');

  const [foodName, setFoodName] = useState('');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodCategory, setFoodCategory] = useState('');
  const [foodRes, setFoodRes] = useState('');
  const [foodImage, setFoodImage] = useState(null);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'RESTAURANT_ADMIN') {
      fetchRestaurants();
    }
    if (user?.role === 'SUPER_ADMIN') {
      fetchVendors();
    }
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get('/api/restaurants/mine');
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get('/api/auth/vendors');
      setVendors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.imageUrl;
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!resImage) return alert('Please select an image');
    setRestaurantLoading(true);
    try {
      const imageUrl = await uploadImage(resImage);
      const payload = {
        name: resName,
        description: resDesc,
        deliveryTime: resTime,
        image: imageUrl,
      };

      if (user?.role === 'SUPER_ADMIN' && resOwner) {
        payload.ownerId = resOwner;
      }

      await axios.post('/api/restaurants', payload);
      alert('Restaurant added successfully!');
      fetchRestaurants();
      setResName(''); setResDesc(''); setResTime(''); setResImage(null); setResOwner('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding restaurant');
    } finally {
      setRestaurantLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodImage || !foodRes) return alert('Please select an image and a restaurant!');
    setFoodLoading(true);
    try {
      const imageUrl = await uploadImage(foodImage);
      await axios.post('/api/food', {
        name: foodName,
        description: foodDesc,
        price: Number(foodPrice),
        category: foodCategory,
        restaurant: foodRes,
        image: imageUrl
      });
      alert('Food added successfully!');
      setFoodName(''); setFoodDesc(''); setFoodPrice(''); setFoodCategory(''); setFoodRes(''); setFoodImage(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding food');
    } finally {
      setFoodLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {(!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'RESTAURANT_ADMIN')) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-700 font-medium">Admin access required.</p>
        </div>
      )}

      {(user?.role === 'SUPER_ADMIN' || user?.role === 'RESTAURANT_ADMIN') && (
        <>

      {(user?.role === 'SUPER_ADMIN' || user?.role === 'RESTAURANT_ADMIN') && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Add a New Restaurant</h2>
        <form onSubmit={handleAddRestaurant} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={resName} onChange={e => setResName(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          {user?.role === 'SUPER_ADMIN' && (
            <div>
              <label className="block text-sm font-medium mb-1">Assign to Vendor</label>
              <select value={resOwner} onChange={e => setResOwner(e.target.value)} required className="w-full p-2 border rounded">
                  <option value="" disabled>Select a vendor (RESTAURANT_ADMIN)</option>
                  {vendors.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={resDesc} onChange={e => setResDesc(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Time (e.g., 20-30 min)</label>
            <input type="text" value={resTime} onChange={e => setResTime(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image Upload</label>
            <input type="file" onChange={e => setResImage(e.target.files[0])} required className="w-full p-2 border rounded" />
          </div>
          <button disabled={restaurantLoading} type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700">
            {restaurantLoading ? 'Uploading...' : 'Add Restaurant'}
          </button>
        </form>
      </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Add a New Dish</h2>
        <form onSubmit={handleAddFood} className="space-y-4">
            <div>
            <label className="block text-sm font-medium mb-1">Restaurant</label>
            <select value={foodRes} onChange={e => setFoodRes(e.target.value)} required className="w-full p-2 border rounded">
                <option value="" disabled>Select a restaurant</option>
                {restaurants.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dish Name</label>
            <input type="text" value={foodName} onChange={e => setFoodName(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={foodDesc} onChange={e => setFoodDesc(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input type="number" value={foodPrice} onChange={e => setFoodPrice(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category (e.g., South Indian)</label>
            <input type="text" value={foodCategory} onChange={e => setFoodCategory(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image Upload</label>
            <input type="file" onChange={e => setFoodImage(e.target.files[0])} required className="w-full p-2 border rounded" />
          </div>
          <button disabled={foodLoading} type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700">
            {foodLoading ? 'Uploading...' : 'Add Dish'}
          </button>
        </form>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
