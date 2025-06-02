import { create } from "zustand";

const API_URL = "http://localhost:8080/api/get-products";

const useSearchStore = create((set) => ({
  searchQuery: "",
  searchResults: [],
  isLoading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchProducts: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${API_URL}/search-products?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      set({
        searchResults: data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        searchResults: [],
      });
    }
  },

  clearSearch: () =>
    set({
      searchQuery: "",
      searchResults: [],
      isLoading: false,
      error: null,
    }),
}));

export default useSearchStore;
