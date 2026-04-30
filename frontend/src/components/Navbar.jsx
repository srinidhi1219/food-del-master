import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600">FoodieExpress</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {(user.role === 'SUPER_ADMIN' || user.role === 'RESTAURANT_ADMIN') && (
                  <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors hidden sm:flex">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="hidden sm:inline-flex items-center text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                  <UserIcon className="h-4 w-4 mr-1" />
                  Hi, {user.name}
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/vendor-register" className="text-gray-600 hover:text-orange-600 font-medium px-3 py-2 rounded-md transition-colors hidden sm:flex">
                  Become a vendor
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium px-3 py-2 rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-600 text-white hover:bg-orange-700 font-medium px-4 py-2 rounded-md transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
