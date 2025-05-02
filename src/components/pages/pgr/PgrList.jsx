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
                const res = await fetch('http://localhost:8000/api/pgr');
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

    if (loading) return <div className="text-center py-10 text-xl">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="px-6 md:px-12 py-10 bg-white min-h-screen">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                Best Growth Promoters/Plant Growth Regulators
            </h2>

            {/* Sort Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                <button
                    onClick={() => setSortOption('most-purchased')}
                    className={`flex items-center gap-2 border px-5 py-2 rounded-full hover:bg-green-50 transition ${sortOption === 'most-purchased' ? 'border-green-600 text-green-700' : 'border-gray-300'
                        }`}
                >
                    <ThumbsUp className="w-4 h-4" />
                    Most Purchased
                </button>
                <button
                    onClick={() => setSortOption('lowest-price')}
                    className={`flex items-center gap-2 border px-5 py-2 rounded-full hover:bg-green-50 transition ${sortOption === 'lowest-price' ? 'border-green-600 text-green-700' : 'border-gray-300'
                        }`}
                >
                    <ArrowDownWideNarrow className="w-4 h-4" />
                    Lowest Price
                </button>
                <button
                    onClick={() => setSortOption('highest-price')}
                    className={`flex items-center gap-2 border px-5 py-2 rounded-full hover:bg-green-50 transition ${sortOption === 'highest-price' ? 'border-green-600 text-green-700' : 'border-gray-300'
                        }`}
                >
                    <ArrowUpWideNarrow className="w-4 h-4" />
                    Highest Price
                </button>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => {
                    const firstVariant = product.variants[0]; // Use first variant as default
                    const image = product.images[0]; // Use first image as thumbnail

                    const discount = Math.floor((firstVariant?.discount_percent || 10) / 100 * firstVariant?.price);
                    const originalPrice = firstVariant?.price + discount;

                    return (
                        <Link to={`/pgr/${product.id}`} key={product.id}>
                            <div className="border rounded-xl shadow-sm hover:shadow-md p-4 bg-white flex flex-col h-full transition-all">
                                <img
                                    src={image}
                                    alt={product.name}
                                    className="h-44 object-contain mx-auto mb-4"
                                />
                                <div className="flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="mt-1 font-semibold text-gray-800 text-sm line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-green-600 font-bold text-sm">
                                            {firstVariant?.discount_percent || 0}% Off
                                        </span>
                                        <span className='text-red-500 font-semibold text-sm'>
                                            Stock's available:- {product.in_stock}
                                        </span>
                                        <div className="flex gap-2 text-sm mt-1">
                                            <span className="line-through text-gray-400">₹{originalPrice}</span>
                                            <span className="font-semibold text-black">₹{firstVariant?.price}</span>
                                        </div>
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
