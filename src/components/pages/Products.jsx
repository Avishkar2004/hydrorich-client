import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await axios.get("https://dummyjson.com/products");
            setProducts(res.data.products); // ✅ access the array
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const inINR = (price) => `₹${(price * 83).toFixed(0)}`;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-green-50">
                <span className="text-xl font-semibold animate-pulse">Loading products...</span>
            </div>
        );
    }

    return (
        <div className="bg-green-50 min-h-screen px-4 sm:px-10 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Our Featured Products</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl"
                            onClick={() => navigate(`/products/${product.id}`)} // 👈 dynamic route
                        >
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h2 className="text-lg font-semibold text-green-800 truncate">{product.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-green-700 font-bold">{inINR(product.price)}</span>
                                <span className="text-sm flex items-center gap-1 text-yellow-500">
                                    <Star size={16} />
                                    {product.rating}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
