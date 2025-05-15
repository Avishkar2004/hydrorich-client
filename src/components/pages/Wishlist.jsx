// src/pages/Wishlist.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, ShoppingCart, Trash2, Package, ArrowRight, Tag, AlertCircle } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore.js";
import useCartStore from "../../store/cartStore.js";
import { useAuth } from "../../hooks/useAuth.js";

const Wishlist = () => {
    const { user, loading: authLoading } = useAuth();
    const { wishlist, removeFromWishlist, syncWishlist, loading: wishlistLoading, error } = useWishlistStore();
    const { addToCart } = useCartStore();

    // Sync wishlist when component loads and user is authenticated
    useEffect(() => {
        if (user && !wishlistLoading) {
            syncWishlist();
        }
    }, [user, syncWishlist]);

    const handleAddToCart = async (item) => {
        try {
            // Create a product object and variant object to match the addToCart parameters
            const product = {
                id: item.product_id,
                name: item.product_name
            };

            const variant = {
                id: item.variant_id,
                name: item.variant_name,
                price: item.price
            };

            await addToCart(product, variant, 1);

            // Optionally, you could show a success message or remove from wishlist
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (authLoading || wishlistLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
                <Loader2 className="animate-spin mb-4" size={32} />
                <span className="text-lg">Loading your wishlist...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <Heart size={48} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist Awaits</h2>
                    <p className="text-gray-600 mb-8">
                        Sign in to view your wishlist and save your favorite items.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Sign In to Continue
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Heart className="text-red-500" size={28} />
                    <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
                </div>
                <span className="text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="mr-2" size={20} />
                    <p>{error}</p>
                </div>
            )}

            {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <Heart size={48} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">You haven't added any products to your wishlist yet.</p>
                    <Link
                        to="/pgr"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item.wishlist_id}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative">
                                <Link to={`/product/${item.product_id}`}>
                                    <div className="h-48 rounded-lg overflow-hidden bg-gray-50 mb-4">
                                        <img
                                            src={item.image_url || '/placeholder-image.jpg'}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.wishlist_id)}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>

                            <Link to={`/product/${item.product_id}`} className="block group">
                                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                                    {item.product_name}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-2 mt-1">
                                <Tag size={14} className="text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    {item.variant_name}
                                </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-semibold text-green-600">
                                        ₹{item.price.toLocaleString()}
                                    </span>
                                    {item.discount_percent > 0 && (
                                        <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                            {item.discount_percent}% off
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
