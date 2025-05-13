import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cartService = {
  // Add item to cart
  addToCart: async (userId, productId, variantId, quantity) => {
    try {
      //   console.log('Cart Service - Making API call to add item:', { productId, variantId, quantity });
      const response = await api.post("/add", {
        userId: parseInt(userId),
        productId: parseInt(productId),
        variantId: parseInt(variantId),
        quantity: parseInt(quantity),
      });
      //   console.log('Cart Service - API response:', response.data);
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
