// src/store/cartStore.js
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product, variant) => {
    const item = {
      productId: product._id,
      name: product.name,
      image: product.images[0],
      variantName: variant.name,
      price: variant.price,
      quantity: 1,
    };

    // Check if item is already in cart
    const existing = get().cart.find(
      (i) =>
        i.productId === item.productId && i.variantName === item.variantName
    );

    if (existing) {
      // Increment quantity
      set({
        cart: get().cart.map((i) =>
          i.productId === item.productId && i.variantName === item.variantName
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      // Add new item
      set({ cart: [...get().cart, item] });
    }
  },

  removeFromCart: (productId, variantName) =>
    set({
      cart: get().cart.filter(
        (i) => !(i.productId === productId && i.variantName === variantName)
      ),
    }),

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
