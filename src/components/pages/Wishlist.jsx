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
                        to="/pgrs"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div
                            key={item.wishlist_id}
                            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Discount Badge */}
                            {item.discount_percent > 0 && (
                                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                    {item.discount_percent}% OFF
                                </div>
                            )}

                            {/* Product Image Section */}
                            <div className="relative mb-6">
                                <Link to={`/products/${item.product_id}`} className="block">
                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 group">
                                        <img
                                            src={item.image_url || '/placeholder-image.jpg'}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.wishlist_id)}
                                    className="absolute top-2 right-2 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110 z-10"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>

                            {/* Product Info Section */}
                            <div className="space-y-3">
                                <Link to={`/products/${item.product_id}`} className="block group">
                                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {item.product_name}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-gray-400" />
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {item.variant_name}
                                    </p>
                                </div>

                                <div className="flex items-baseline gap-2 pt-2">
                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{item.price.toLocaleString()}
                                    </span>
                                    {item.discount_percent > 0 && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{Math.round(item.price * (1 + item.discount_percent / 100)).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 group"
                                    >
                                        <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.wishlist_id)}
                                        className="p-3 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all duration-300"
                                    >
                                        <Trash2 size={18} className="text-gray-500 hover:text-red-500 transition-colors" />
                                    </button>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-100 rounded-2xl transition-colors duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
