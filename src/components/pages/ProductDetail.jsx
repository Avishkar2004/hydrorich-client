import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ArrowLeft, Tag, Package, AlertCircle } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore.js";
import useCartStore from "../../store/cartStore.js";
import { useAuth } from "../../hooks/useAuth.js";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
    const { addToCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);


    const isInWishlist = wishlist.some(item => item.product_id === product.id);

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            alert("Please select a variant");
            return;
        }

        try {
            await addToCart(
                { id: product.id, name: product.name },
                { id: selectedVariant.id, name: selectedVariant.name, price: selectedVariant.price },
                quantity
            );
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const toggleWishlist = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (isInWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {product.images.slice(1).map((image, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-50">
                                <img
                                    src={image}
                                    alt={`${product.name} - View ${index + 2}`}
                                    className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-semibold text-green-600">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.discount_percent > 0 && (
                                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {product.discount_percent}% off
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600">{product.description}</p>

                    {/* Variants */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Select Variant</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${selectedVariant?.id === variant.id
                                            ? "border-green-600 bg-green-50 text-green-700"
                                            : "border-gray-200 hover:border-green-600"
                                        }`}
                                >
                                    {variant.name} - ₹{variant.price.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Quantity</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-green-600"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-green-600"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>
                        <button
                            onClick={toggleWishlist}
                            className={`p-3 rounded-xl border transition-all ${isInWishlist
                                    ? "border-red-200 bg-red-50 text-red-600"
                                    : "border-gray-200 hover:border-red-200"
                                }`}
                        >
                            <Heart size={24} className={isInWishlist ? "fill-current" : ""} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 