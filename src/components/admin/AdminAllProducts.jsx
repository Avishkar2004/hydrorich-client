import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api.js';
import { Edit, Trash2, Search, Plus, ArrowUpDown, Package, Tag, AlertCircle } from 'lucide-react';

const AdminAllProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.admin.products);
            setProducts(response.data.products);
            setFilteredProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOption === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'name-desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'price-asc') {
            filtered.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price);
        } else if (sortOption === 'price-desc') {
            filtered.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, sortOption, products]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`${API_ENDPOINTS.admin.products}/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
            } catch (error) {
                setError('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-red-50 p-6 rounded-lg flex items-center space-x-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div>
                        <h3 className="text-lg font-medium text-red-800">Error</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Product Management an an Admin</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your product inventory and details</p>
                        </div>
                        <Link
                            to="/admin/add-product"
                            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Search and Sort Controls */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Sort by</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                        </select>
                    </div>
                </div>

                {/* Products List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                            <div className="col-span-4">Product</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-all duration-200">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                <img
                                                    src={product.images?.[0] || 'https://via.placeholder.com/64'}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                                    <Package className="w-3 h-3 mr-1" />
                                                    <span>{product.variants.length} variants</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            ₹{product.variants[0]?.price?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${product.in_stock
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                            }`}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-end space-x-2">
                                        <Link
                                            to={`/admin/edit-product/${product.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                            title="Edit Product"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No products found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllProducts; 