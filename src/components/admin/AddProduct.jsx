import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api.js';

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Product Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="in_stock"
                                checked={formData.in_stock}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                In Stock
                            </label>
                        </div>

                        {/* Product Variants */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add Variant
                                </button>
                            </div>

                            {formData.variants.map((variant, variantIndex) => (
                                <div key={variantIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Add Dosage
                                            </button>
                                        </div>

                                        {variant.dosages.map((dosage, dosageIndex) => (
                                            <div key={dosageIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Product Photos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Photos
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                You can select multiple photos
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Adding Product...' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct; 