import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getRestaurantId = (restaurant) => {
  if (!restaurant) return null;
  if (typeof restaurant === 'string') return restaurant;
  if (typeof restaurant === 'object') return restaurant._id || restaurant.id || null;
  return null;
};

// Fix #15: Cart persisted to localStorage — survives page refresh
const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (food) => set((state) => {
        const incomingRestaurantId = getRestaurantId(food.restaurant);
        const currentRestaurantId = state.cart.length > 0 ? getRestaurantId(state.cart[0].restaurant) : incomingRestaurantId;

        if (state.cart.length > 0 && incomingRestaurantId && currentRestaurantId && incomingRestaurantId !== currentRestaurantId) {
          alert('You can only add items from one restaurant per order. Please clear the cart first.');
          return state;
        }

        const existing = state.cart.find(item => item._id === food._id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...food, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item._id !== id)
      })),
      clearCart: () => set({ cart: [] }),
      increaseQuantity: (id) => set((state) => ({
        cart: state.cart.map(item =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      })),
      decreaseQuantity: (id) => set((state) => ({
        cart: state.cart.map(item =>
          item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        )
      })),
    }),
    {
      name: 'foodie-cart', // key in localStorage
    }
  )
);

export default useCartStore;
