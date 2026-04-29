import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: true,
  login: async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
  register: async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/auth/me');
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, loading: false });
    } catch (error) {
      localStorage.removeItem('user');
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('user');
      set({ user: null });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useAuthStore;
