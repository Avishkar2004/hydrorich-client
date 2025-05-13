import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "../services/cartService.js";
import { useAuth } from "../hooks/useAuth.js";
// const { user, loading } = useAuth();

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      loading: false,
      error: null,

      addToCart: async (userId, product, variant, quantity) => {
        try {
          // console.log("Cart Store - Starting addToCart");
          set({ loading: true, error: null });
          const item = {
            userId,
            productId: product.id,
            productTitle: product.name,
            productImage: product.images[0], // or whatever field you use
            variantId: variant.id,
            variantName: variant.name,
            quantity,
            variantPrice: variant.price,
          };

          // console.log("Cart Store - Created item:", item);
          console.log("Sending to backend", item.productTitle);

          // Check if item is already in cart
          const existing = get().cart.find(
            (i) =>
              i.productId === item.productId &&
              i.variantName === item.variantName
          );
          // console.log("Cart Store - Existing item:", existing);

          if (existing) {
            // Increment quantity
            set({
              cart: get().cart.map((i) =>
                i.productId === item.productId &&
                i.variantName === item.variantName
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            });
            // console.log("Cart Store - Updated existing item quantity");
          } else {
            // Add new item
            set({ cart: [...get().cart, item] });
            // console.log("Cart Store - Added new item");
          }

          // If user is authenticated, sync with backend
          const token = localStorage.getItem("token");
          // console.log("Cart Store - Token exists:", !!token);
          if (token) {
            // console.log("Cart Store - Syncing with backend");
            const response = await cartService.addToCart(
              product.productId,
              variant.id,
              1
            );
            // console.log("Cart Store - Backend sync response:", response);
            if (response.success) {
              // Update local cart with backend data
              const cartResponse = await cartService.getCart();
              if (cartResponse.success) {
                set({ cart: cartResponse.cart });
              }
            }
          }
        } catch (error) {
          console.error("Cart Store - Error:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      removeFromCart: async (productId, variantName) => {
        try {
          set({ loading: true, error: null });
          const item = get().cart.find(
            (i) => i.productId === productId && i.variantName === variantName
          );

          set({
            cart: get().cart.filter(
              (i) =>
                !(i.productId === productId && i.variantName === variantName)
            ),
          });

          // If user is authenticated, sync with backend
          const token = localStorage.getItem("token");
          if (token && item?.cartId) {
            await cartService.removeItem(item.cartId);
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      updateQuantity: async (productId, variantName, quantity) => {
        try {
          set({ loading: true, error: null });
          const item = get().cart.find(
            (i) => i.productId === productId && i.variantName === variantName
          );

          if (item) {
            set({
              cart: get().cart.map((i) =>
                i.productId === productId && i.variantName === variantName
                  ? { ...i, quantity }
                  : i
              ),
            });

            // If user is authenticated, sync with backend
            const token = localStorage.getItem("token");
            if (token && item.cartId) {
              await cartService.updateQuantity(item.cartId, quantity);
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
          set({ cart: [] });

          // If user is authenticated, sync with backend
          const token = localStorage.getItem("token");
          if (token) {
            await cartService.clearCart();
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
          const token = localStorage.getItem("token");

          if (token) {
            const localCart = get().cart;
            // Push each local item to backend
            for (const item of localCart) {
              await cartService.addToCart(
                item.userId,
                item.productId,
                item.variantId,
                item.quantity
              );
            }

            // Get updated cart from backend
            const response = await cartService.getCart();
            if (response.success) {
              set({ cart: response.cart });
            }
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
