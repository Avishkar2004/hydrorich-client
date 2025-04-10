import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams(); // get dynamic product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <span className="text-xl font-semibold animate-pulse">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center text-red-500 mt-10">Product not found.</div>;
  }

  const inINR = (price) => `₹${(price * 83).toFixed(0)}`;
  const discount = (product.price * 83 + 200).toFixed(0);

  return (
    <div className="bg-green-50 min-h-screen px-4 sm:px-10 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2 gap-10 p-6 md:p-10">
        {/* IMAGE SECTION */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center items-center"
          >
            <img
              src={selectedImage}
              alt={product.title}
              className="w-auto h-[400px] object-cover rounded-xl shadow-md"
            />
            <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {product.brand}
            </div>
          </motion.div>

          {/* Gallery Preview */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`gallery-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`h-20 object-cover rounded-lg border hover:cursor-pointer transition ${setSelectedImage === img ? "border-green-600 scale-105" : "border-gray-200 hover:scale-105"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-800">{product.title}</h1>
            <p className="text-sm mt-2 text-gray-600">{product.description}</p>

            <div className="mt-6 text-3xl font-semibold text-green-700">
              {inINR(product.price)}
              <span className="text-base font-normal line-through text-gray-400 ml-2">
                {discount}
              </span>
              <span className="ml-3 bg-yellow-200 text-yellow-900 px-2 py-1 text-xs font-medium rounded-md">
                {product.discountPercentage}% OFF
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <Star size={18} className="text-yellow-500" />
              <span>{product.rating} / 5</span>
              <span className="ml-2 text-green-600 font-semibold">Verified Rating</span>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              Available:{" "}
              <span className="font-medium text-gray-800">{product.stock} units</span>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold text-lg text-green-900">Product Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  High-quality {product.category}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  Brand: {product.brand}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  Ships in 2-3 days
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  7-day easy return policy
                </li>
              </ul>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-lg shadow-lg">
              🛒 Add to Cart
            </button>
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-14 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-green-900 mb-4">Customer Reviews</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600 italic mb-2">
              "One of the best products I’ve purchased online! Great quality and fast delivery."
            </p>
            <span className="text-sm text-gray-800 font-semibold">— Aman S.</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600 italic mb-2">
              "Highly recommend this to anyone looking for reliable products. 5 stars!"
            </p>
            <span className="text-sm text-gray-800 font-semibold">— Priya R.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
