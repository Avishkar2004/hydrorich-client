import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

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
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const cartService = {
  // Add item to cart
  addToCart: async (productId, variantId, quantity) => {
    try {
      if (!productId || !variantId || !quantity) {
        throw new Error("Missing required parameters");
      }

      const response = await api.post("/add", {
        productId: parseInt(productId),
        variantId: parseInt(variantId),
        quantity: parseInt(quantity),
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add item to cart");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Cart Service - API error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get("/");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch cart");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Cart Service - Get cart error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Update item quantity
  updateQuantity: async (cartId, quantity) => {
    try {
      const response = await api.put(`/item/${cartId}`, {
        quantity: parseInt(quantity),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Cart Service - Update quantity error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Remove item from cart
  removeItem: async (cartId) => {
    try {
      const response = await api.delete(`/item/${cartId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Cart Service - Remove item error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete("/clear");
      return response.data;
    } catch (error) {
      console.error(
        "Cart Service - Clear cart error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },
};
