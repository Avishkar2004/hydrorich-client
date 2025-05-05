import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

function PgrList() {
    const [pgrProducts, setPgrProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/pgr');
                const data = await res.json();
                setPgrProducts(data.products);
                setFilteredProducts(data.products);
            } catch (err) {
                setError('Failed to load PGR products.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = [...pgrProducts];
        if (sortOption === 'most-purchased') {
            filtered.sort((a, b) => b.total_sales - a.total_sales);
        } else if (sortOption === 'lowest-price') {
            filtered.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price);
        } else if (sortOption === "highest-price") {
            filtered.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price);
        }
        setFilteredProducts(filtered);
    }, [sortOption, pgrProducts]);

    if (loading) return <div className="text-center py-10 text-xl text-gray-600">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="px-4 sm:px-8 md:px-12 py-10 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
                🌿 Best Growth Promoters / Plant Growth Regulators
            </h2>

            {/* Sort Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                    { label: 'Most Purchased', icon: <ThumbsUp />, value: 'most-purchased' },
                    { label: 'Lowest Price', icon: <ArrowDownWideNarrow />, value: 'lowest-price' },
                    { label: 'Highest Price', icon: <ArrowUpWideNarrow />, value: 'highest-price' },
                ].map(({ label, icon, value }) => (
                    <button
                        key={value}
                        onClick={() => setSortOption(value)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-200 ${sortOption === value
                            ? 'border-green-600 bg-green-100 text-green-800 font-medium'
                            : 'border-gray-300 hover:bg-green-50 text-gray-700'
                            }`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                    const firstVariant = product.variants[0];
                    const image = product.images[0];
                    const discount = Math.floor((firstVariant?.discount_percent || 10) / 100 * firstVariant?.price);
                    const originalPrice = firstVariant?.price + discount;

                    return (
                        <Link to={`/pgr/${product.id}`} key={product.id}>
                            <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group">
                                <div className="relative p-4">
                                    <img
                                        src={image}
                                        alt={product.name}
                                        className="h-44 mx-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {firstVariant?.discount_percent > 0 && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                            {firstVariant.discount_percent}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="px-4 pb-4 flex flex-col justify-between">
                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 h-12 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-black font-bold text-lg">₹{firstVariant?.price}</span>
                                            <span className="line-through text-sm text-gray-400 ml-2">
                                                ₹{originalPrice}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${product.in_stock > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-600'
                                                }`}
                                        >
                                            {product.in_stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default PgrList;
