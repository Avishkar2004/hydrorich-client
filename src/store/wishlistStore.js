import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistService } from "../services/wishlistService.js";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      loading: false,
      error: null,

      addToWishlist: async (product, variant) => {
        try {
          set({ loading: true, error: null });

          // Add to backend first
          const response = await wishlistService.addToWishlist(
            product.id,
            variant.id
          );

          if (!response.success) {
            throw new Error(
              response.message || "Failed to add item to wishlist"
            );
          }

          // Get updated wishlist from backend
          const wishlistResponse = await wishlistService.getWishlist();
          if (wishlistResponse.success) {
            set({ wishlist: wishlistResponse.wishlist });
          }
        } catch (error) {
          console.error("Error adding to wishlist:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      removeFromWishlist: async (wishlistId) => {
        try {
          set({ loading: true, error: null });
          const response = await wishlistService.removeItem(wishlistId);

          if (response.success) {
            // Get updated wishlist from backend
            const wishlistResponse = await wishlistService.getWishlist();
            if (wishlistResponse.success) {
              set({ wishlist: wishlistResponse.wishlist });
            }
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      clearWishlist: async () => {
        try {
          set({ loading: true, error: null });
          const response = await wishlistService.clearWishlist();

          if (response.success) {
            set({ wishlist: [] });
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      syncWishlist: async () => {
        try {
          set({ loading: true, error: null });
          const response = await wishlistService.getWishlist();

          if (response.success) {
            set({ wishlist: response.wishlist });
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // Check if an item is in the wishlist
      isInWishlist: (productId, variantId) => {
        return get().wishlist.some(
          (item) =>
            item.product_id === productId && item.variant_id === variantId
        );
      },

      // Add method to clear wishlist locally
      clearLocalWishlist: () => {
        set({ wishlist: [] });
        // Clear from localstorage
        localStorage.removeItem("wishlist-storage");
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;
