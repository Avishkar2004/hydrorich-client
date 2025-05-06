// src/pages/Wishlist.jsx
import useWishlistStore from "../../store/wishlistStore.js";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">❤️ Your Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Browse products and add them to your wishlist to see them here!
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {wishlist.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-6 p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="flex items-center gap-4">
                                {/* <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                        src={item?.variantName?.photo}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div> */}
                                <div>
                                    <p className="text-lg font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.variantName?.name} – {item.variantName?.quantity}
                                        {item.variantName?.unit}
                                    </p>
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        ₹{item.variantName?.price}{" "}
                                        {item.variantName?.discount_percent > 0 && (
                                            <span className="text-gray-400 line-through ml-2 text-xs">
                                                ₹
                                                {(
                                                    item.variantName.price /
                                                    (1 - item.variantName.discount_percent / 100)
                                                ).toFixed(0)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    removeFromWishlist(item.productId, item.variantName)
                                }
                                className="text-red-600 hover:text-red-800 font-medium transition"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-center">
                        <button
                            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg shadow-md transition"
                            onClick={clearWishlist}
                        >
                            Clear Wishlist
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
