import { create } from "zustand";
import { authService } from "../services/authService.js";
import useCartStore from "../store/cartStore.js";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        set({ user: response.user, loading: false });
        // Sync cart after login
        const cartStore = useCartStore.getState();
        cartStore.syncCart();
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        credentials: "include",
      });
      set({ user: null });
      // Clear cart and localStorage after logout
      const cartStore = useCartStore.getState();
      cartStore.clearLocalCart();
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear cart even if logout request fails
      const cartStore = useCartStore.getState();
      cartStore.clearLocalCart();
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const user = await authService.checkAuth();
      set({ user, loading: false });
      // Sync cart after auth check
      if (user) {
        const cartStore = useCartStore.getState();
        cartStore.syncCart();
      } else {
        // Clear cart if not authenticated
        const cartStore = useCartStore.getState();
        cartStore.clearLocalCart();
      }
    } catch (error) {
      set({ user: null, loading: false });
      // Clear cart on auth error
      const cartStore = useCartStore.getState();
      cartStore.clearLocalCart();
    }
  },
}));

export const useAuth = () => {
  const { user, loading, error, login, logout, checkAuth } = useAuthStore();
  return { user, loading, error, login, logout, checkAuth };
};