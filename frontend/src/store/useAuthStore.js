import { create } from 'zustand';
import axios from 'axios';

// Fix #14: Removed localStorage as source of truth for user object.
// The httpOnly cookie is the real auth token. On app load, checkAuth() hits /api/auth/me
// to validate the cookie and populate user. localStorage is only used as a UI cache
// to avoid showing a blank screen before checkAuth resolves.
const useAuthStore = create((set) => ({
  user: null, // Do not read from localStorage on init — checkAuth() will populate this
  loading: true,
  _extractErrorMessage: (error) => {
    const data = error?.response?.data;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0]?.msg || 'Validation failed';
    return error?.message || 'Request failed';
  },
  login: async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      set({ user: data });
    } catch (error) {
      throw useAuthStore.getState()._extractErrorMessage(error);
    }
  },
  register: async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      set({ user: data });
    } catch (error) {
      throw useAuthStore.getState()._extractErrorMessage(error);
    }
  },
  registerVendor: async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register-vendor', { name, email, password });
      set({ user: data });
    } catch (error) {
      throw useAuthStore.getState()._extractErrorMessage(error);
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get('/api/auth/me');
      set({ user: data, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null });
    } catch (error) {
      console.error(error);
      set({ user: null }); // Clear user even on error
    }
  },
}));

export default useAuthStore;
