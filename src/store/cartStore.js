import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "../services/cartService.js";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      error: null,

      addToCart: async (product, variant, quantity) => {
        try {
          set({ loading: true, error: null });

          // Add to backend first
          const response = await cartService.addToCart(
            product.id,
            variant.id,
            quantity
          );

          if (!response.success) {
            throw new Error(response.message || "Failed to add item to cart");
          }

          // Get updated cart from backend
          const cartResponse = await cartService.getCart();
          if (cartResponse.success) {
            set({ cart: cartResponse.cart });
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      removeFromCart: async (cartId) => {
        try {
          set({ loading: true, error: null });
          const response = await cartService.removeItem(cartId);

          if (response.success) {
            // Get updated cart from backend
            const cartResponse = await cartService.getCart();
            if (cartResponse.success) {
              set({ cart: cartResponse.cart });
            }
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      updateQuantity: async (cartId, quantity) => {
        try {
          set({ loading: true, error: null });
          const response = await cartService.updateQuantity(cartId, quantity);

          if (response.success) {
            // Get updated cart from backend
            const cartResponse = await cartService.getCart();
            if (cartResponse.success) {
              set({ cart: cartResponse.cart });
            }
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ loading: true, error: null });
          const response = await cartService.clearCart();

          if (response.success) {
            set({ cart: [] });
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      syncCart: async () => {
        try {
          set({ loading: true, error: null });
          const response = await cartService.getCart();

          if (response.success) {
            set({ cart: response.cart });
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // Add method to clear cart locally and from localStorage
      clearLocalCart: () => {
        set({ cart: [] });
        // Clear from localStorage
        localStorage.removeItem("cart-storage");
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
