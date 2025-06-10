import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
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

const API_ENDPOINTS = {
  auth: {
    user: `${API_BASE_URL}/api/auth/user`,
    login: `${API_BASE_URL}/api/auth/login`,
    signup: `${API_BASE_URL}/api/auth/signup`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    google: `${API_BASE_URL}/api/auth/google`,
  },
  admin: {
    users: "/api/admin/users",
    stats: "/api/admin/stats",
    addProduct: "/api/products/add",
    products: "/api/products",
  },
  products: {
    pgr: `${API_BASE_URL}/api/pgrs`,
    organic: `${API_BASE_URL}/api/organics`,
    micronutrient: `${API_BASE_URL}/api/micronutrients`,
    insecticides: `${API_BASE_URL}/api/insecticides`,
    fungicides: `${API_BASE_URL}/api/fungicides`,
  },
  allProducts: `${API_BASE_URL}/api/products`,
  orders: `${API_BASE_URL}/api/orders`,
  invoices: `${API_BASE_URL}/api/invoices/:orderId`,
  contact: `${API_BASE_URL}/api/contact`,
  messages: {
    list: `${API_BASE_URL}/api/messages`,
    send: `${API_BASE_URL}/api/messages/send`,
    create: `${API_BASE_URL}/api/messages/send`,
    admin: {
      list: `${API_BASE_URL}/api/messages/admin`,
      send: `${API_BASE_URL}/api/messages/admin/send`,
    },
    unread: `${API_BASE_URL}/api/messages/unread`,
  },
  users: {
    list: `${API_BASE_URL}/api/users`,
  },
  socket: API_BASE_URL,
  // Add other endpoints as needed
};

export { API_ENDPOINTS };

export const getAuthHeader = () => {
  return {
    "Content-Type": "application/json",
  };
};

export default api;
