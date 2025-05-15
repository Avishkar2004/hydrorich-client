import axios from "axios";

const API_URL = "http://localhost:8080/api/wishlist";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add response interceptor for better error handling

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const wishlistService = {
  // Add item to wishlist
  addToWishlist: async (productId, variantId) => {
    try {
      if (!productId || !variantId) {
        throw new Error("Missing required parameters");
      }

      const response = await api.post("/add", {
        productId: parseInt(productId),
        variantId: parseInt(variantId),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to wishlist");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Wishlist Service - API error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get("/");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch wishlist");
      }
      return response.data;
    } catch (error) {
      console.error(
        "Wishlist Service - Get wishlist error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Check if an item is in the wishlist
  checkWishlistItem: async (productId, variantId) => {
    try {
      const response = await api.get(`/check/${productId}/${variantId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Wishlist Service - Check item error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },
  // Remove item from wishlist
  removeItem: async (wishlistId) => {
    try {
      const response = await api.delete(`/item/${wishlistId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Wishlist Service - Remove item error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const response = await api.delete("/clear");
      return response.data;
    } catch (error) {
      console.error(
        "Wishlist Service - Clear wishlist error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },
};
