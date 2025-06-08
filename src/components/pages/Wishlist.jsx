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
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-600">
                <div className="relative">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                </div>
                <span className="text-lg font-medium mt-4">Loading your wishlist...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center transform hover:scale-[1.02] transition-all duration-300">
                    <div className="relative">
                        <Heart size={56} className="mx-auto mb-6 text-red-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist Awaits</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Sign in to view your wishlist and save your favorite items.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        Sign In to Continue
                        <ArrowRight size={20} className="animate-bounce" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Heart className="text-red-500" size={32} />
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">My Wishlist</h1>
                </div>
                <span className="text-gray-600 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 font-medium">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center animate-fade-in">
                    <AlertCircle className="mr-3" size={24} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-12 text-center transform hover:scale-[1.02] transition-all duration-300">
                    <div className="relative mb-8">
                        <Heart size={64} className="mx-auto text-gray-400" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-full blur-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-8 text-lg">You haven't added any products to your wishlist yet.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                        Start Shopping
                        <ArrowRight size={20} className="animate-bounce" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlist.map((item) => (
                        <div
                            key={item.wishlist_id}
                            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-1"
                        >
                            {/* Discount Badge */}
                            {item.discount_percent > 0 && (
                                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-105 transition-transform">
                                    {item.discount_percent}% OFF
                                </div>
                            )}

                            {/* Product Image Section */}
                            <div className="relative mb-8">
                                <Link to={`/products/${item.product_id}`} className="block">
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
                                        <img
                                            src={item.image_url || '/placeholder-image.jpg'}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item.wishlist_id)}
                                    className="absolute top-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110 z-10"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={20} className="text-red-500" />
                                </button>
                            </div>

                            {/* Product Info Section */}
                            <div className="space-y-4">
                                <Link to={`/products/${item.product_id}`} className="block group">
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {item.product_name}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <Tag size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-500 line-clamp-1">
                                        {item.variant_name}
                                    </p>
                                </div>

                                <div className="flex items-baseline gap-3 pt-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{item.price.toLocaleString()}
                                    </span>
                                    {item.discount_percent > 0 && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{Math.round(item.price * (1 + item.discount_percent / 100)).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-red-200 flex items-center justify-center gap-3 group"
                                    >
                                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.wishlist_id)}
                                        className="p-4 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Trash2 size={20} className="text-gray-500 hover:text-red-500 transition-colors" />
                                    </button>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-100 rounded-3xl transition-colors duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
