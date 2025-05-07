import { create } from "zustand";

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  addToWishlist: (item) => {
    const exists = get().wishlist.some(
      (i) =>
        i.productId === item.productId && i.variantName === item.variantName
    );
    if (!exists) {
      set({ wishlist: [...get().wishlist, item] });
    }
  },
  removeFromWishlist: (productId, variantName) => {
    set({
      wishlist: get().wishlist.filter(
        (item) =>
          !(item.productId === productId && item.variantName === variantName)
      ),
    });
  },
  clearWishlist: () => set({ wishlist: [] }),
}));

export default useWishlistStore;
