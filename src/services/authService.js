import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
