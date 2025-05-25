import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api.js';
import { Plus, X, Upload, AlertCircle } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        in_stock: true,
        variants: [{
            variant_name: '',
            unit: '',
            quantity: '',
            price: '',
            discount_percent: 0,
            is_available: true,
            dosages: [{
                dosage_per_unit: '',
                usage_instructions: ''
            }]
        }],
        photos: []
    });

    const categories = [
        'plantgrowthregulator',
        'organicFertilizers',
        'micronutrient',
        'Insecticide',
        'Fungicide'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVariantChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newVariants = [...formData.variants];
        newVariants[index] = {
            ...newVariants[index],
            [name]: type === 'checkbox' ? checked : value
        };
        setFormData(prev => ({
            ...prev,
            variants: newVariants
        }));
    };

    const handleDosageChange = (variantIndex, dosageIndex, e) => {
        const { name, value } = e.target;
        const newVariants = [...formData.variants];
        newVariants[variantIndex].dosages[dosageIndex] = {
            ...newVariants[variantIndex].dosages[dosageIndex],
            [name]: value
        };
        setFormData(prev => ({
            ...prev,
            variants: newVariants
        }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                variant_name: '',
                unit: '',
                quantity: '',
                price: '',
                discount_percent: 0,
                is_available: true,
                dosages: [{
                    dosage_per_unit: '',
                    usage_instructions: ''
                }]
            }]
        }));
    };

    const addDosage = (variantIndex) => {
        const newVariants = [...formData.variants];
        newVariants[variantIndex].dosages.push({
            dosage_per_unit: '',
            usage_instructions: ''
        });
        setFormData(prev => ({
            ...prev,
            variants: newVariants
        }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...files]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create FormData for multipart/form-data
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('description', formData.description);
            productData.append('category', formData.category);
            productData.append('in_stock', formData.in_stock);

            // Append variants data
            productData.append('variants', JSON.stringify(formData.variants));

            // Append photos
            formData.photos.forEach(photo => {
                productData.append('photos', photo);
            });

            const response = await api.post(API_ENDPOINTS.admin.addProduct, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Add New Product As a Admin</h2>
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Product Information */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="mt-6 flex items-center">
                                <input
                                    type="checkbox"
                                    name="in_stock"
                                    checked={formData.in_stock}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                                />
                                <label className="ml-3 block text-sm font-medium text-gray-700">
                                    In Stock
                                </label>
                            </div>
                        </div>

                        {/* Product Variants */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Product Variants</h3>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center space-x-2"
                                >
                                    <Plus size={20} />
                                    <span>Add Variant</span>
                                </button>
                            </div>

                            {formData.variants.map((variant, variantIndex) => (
                                <div key={variantIndex} className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-medium text-gray-900">Variant {variantIndex + 1}</h4>
                                        {variantIndex > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(variantIndex)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Variant Name
                                            </label>
                                            <input
                                                type="text"
                                                name="variant_name"
                                                value={variant.variant_name}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unit
                                            </label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={variant.unit}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                placeholder="ml, litre, set, etc."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={variant.quantity}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Price
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Discount Percentage
                                            </label>
                                            <input
                                                type="number"
                                                name="discount_percent"
                                                value={variant.discount_percent}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                min="0"
                                                max="100"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_available"
                                                checked={variant.is_available}
                                                onChange={(e) => handleVariantChange(variantIndex, e)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700">
                                                Available
                                            </label>
                                        </div>
                                    </div>

                                    {/* Dosages */}
                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-md font-medium text-gray-900">Dosages</h4>
                                            <button
                                                type="button"
                                                onClick={() => addDosage(variantIndex)}
                                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center space-x-2"
                                            >
                                                <Plus size={16} />
                                                <span>Add Dosage</span>
                                            </button>
                                        </div>

                                        {variant.dosages.map((dosage, dosageIndex) => (
                                            <div key={dosageIndex} className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Dosage per Unit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="dosage_per_unit"
                                                            value={dosage.dosage_per_unit}
                                                            onChange={(e) => handleDosageChange(variantIndex, dosageIndex, e)}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Usage Instructions
                                                        </label>
                                                        <textarea
                                                            name="usage_instructions"
                                                            value={dosage.usage_instructions}
                                                            onChange={(e) => handleDosageChange(variantIndex, dosageIndex, e)}
                                                            rows="2"
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Product Photos */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Photos</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="cursor-pointer flex flex-col items-center space-y-3"
                                >
                                    <Upload className="text-gray-400" size={40} />
                                    <div className="text-gray-600">
                                        <span className="font-medium text-blue-600 hover:text-blue-700">
                                            Upload photos
                                        </span>
                                        <p className="text-sm text-gray-500 mt-1">
                                            or drag and drop
                                        </p>
                                    </div>
                                </label>
                            </div>
                            {formData.photos.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Adding Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        <span>Add Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct; 