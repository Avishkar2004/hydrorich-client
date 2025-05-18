const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  orders: `${API_BASE_URL}/api/orders`,
  // Add other endpoints as needed
};

export const getAuthHeader = () => {
  return {
    "Content-Type": "application/json",
  };
};
