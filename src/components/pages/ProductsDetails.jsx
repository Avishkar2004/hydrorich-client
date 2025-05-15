import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Star, Heart } from "lucide-react";
import useCartStore from "../../store/cartStore.js";
import useWishlistStore from "../../store/wishlistStore.js";
import AddToCart from "../AddToCart.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, wishlist, isInWishlist } = useWishlistStore();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/pgr/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedImage(product.images[0]);
      setSelectedVariant(product.variants?.[0]);
    }
  }, [product]);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleWishlistToggle = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      alert("Please login to add items to your wishlist");
      return;
    }

    if (!product || !selectedVariant) return;

    setAddingToWishlist(true);
    try {
      const productId = product.id || Number(id);
      const variantId = selectedVariant.id;

      if (isInWishlist(productId, variantId)) {
        // Find wishlist item id
        const wishlistItem = wishlist.find(
          item => item.product_id === productId && item.variant_id === variantId
        );
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.wishlist_id);
        }
      } else {
        await addToWishlist({ id: productId }, { id: variantId });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center text-red-600 mt-10">Product not found.</div>;

  const price = Number(selectedVariant?.price || 0);
  const discount = Number(selectedVariant?.discount_percent || 0);
  const originalPrice = (price / (1 - discount / 100)).toFixed(0);
  const finalPrice = price.toFixed(0);

  const productId = product.id || Number(id);
  const variantId = selectedVariant?.id;
  const itemInWishlist = user && productId && variantId ? isInWishlist(productId, variantId) : false;

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-10 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-lg p-8">
        {/* LEFT: Images */}
        <div>
          {/* Main Image with Zoom Effect */}
          <div className="relative overflow-hidden group w-full max-w-md mx-auto border rounded-xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-125"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`h-20 object-cover rounded-lg cursor-pointer border ${selectedImage === img
                  ? "border-green-600 scale-105"
                  : "border-gray-200 hover:scale-105"
                  } transition-all duration-300`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {product.in_stock < 10 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Limited Stock</span>
              )}
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Best Seller</span>
            </div>
            <h1 className="text-3xl font-bold text-green-900">{product.name}</h1>
            <p className="text-sm mt-1 text-gray-600">{product.description}</p>

            {/* Pricing */}
            <div className="mt-6 text-3xl font-bold text-green-700">
              ₹{finalPrice}
              <span className="text-base font-normal line-through text-gray-400 ml-2">
                ₹{originalPrice}
              </span>
              <span className="ml-3 bg-yellow-200 text-yellow-900 px-2 py-1 text-xs font-medium rounded-md">
                {selectedVariant?.discount_percent}% OFF
              </span>
            </div>

            {/* Variant Selection */}
            <div className="mt-4">
              <h2 className="font-semibold text-gray-900 text-base">Select Variant</h2>
              <div className="flex flex-wrap gap-3 mt-3">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariant?.name === v.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-14 py-5 rounded-lg border text-sm font-medium transition-all ${isSelected
                        ? "bg-green-50 text-green-700 border-green-500 shadow-sm"
                        : "bg-white text-gray-500 border-gray-300 hover:border-green-500 hover:text-green-700"
                        }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dosage Info */}
            {selectedVariant?.dosage && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  🌱 Dosage & Usage Instructions
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-green-700 text-xl">💊</div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Dosage per unit</p>
                      <p className="text-base font-semibold text-gray-800">{selectedVariant.dosage.dosage_per_unit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-green-700 text-xl">📋</div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Usage Instructions</p>
                      <p className="text-base font-semibold text-gray-800 whitespace-pre-line">
                        {selectedVariant.dosage.usage_instructions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Highlights */}
            <div className="mt-6">
              <h2 className="font-semibold text-lg text-green-900">Product Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={16} /> Fast Shipping</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={16} /> 7-day return policy</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-500" size={16} /> Genuine product guarantee</li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h2 className="font-semibold text-lg text-green-900">Customer Reviews</h2>
              <div className="flex items-center gap-1 mt-1">
                <Star className="text-yellow-500" size={18} />
                <Star className="text-yellow-500" size={18} />
                <Star className="text-yellow-500" size={18} />
                <Star className="text-yellow-500" size={18} />
                <Star className="text-gray-300" size={18} />
                <span className="ml-2 text-sm text-gray-600">4.2/5 based on 87 reviews</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <AddToCart product={product} variant={selectedVariant} />
            </div>
            <button
              onClick={handleWishlistToggle}
              disabled={addingToWishlist}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg shadow-md transition duration-300 flex items-center justify-center gap-2 ${itemInWishlist
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {addingToWishlist ? (
                <span className="flex items-center"><span className="animate-spin mr-2">⭕</span> Processing...</span>
              ) : (
                <>
                  <Heart className={itemInWishlist ? "fill-white" : ""} size={20} />
                  {itemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
