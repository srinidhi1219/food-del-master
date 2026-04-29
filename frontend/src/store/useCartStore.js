import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (food) => set((state) => {
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
  }))
}));

export default useCartStore;
