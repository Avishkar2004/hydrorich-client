import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Package, Truck, AlertCircle, ArrowLeft, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import api from '../../config/api';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/api/orders/${orderId}`);
                setOrder(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const getStatusSteps = (status) => {
        const steps = [
            { id: 'pending', label: 'Order Placed', icon: <Package className="w-6 h-6" /> },
            { id: 'processing', label: 'Processing', icon: <Clock className="w-6 h-6" /> },
            { id: 'shipped', label: 'Shipped', icon: <Truck className="w-6 h-6" /> },
            { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="w-6 h-6" /> }
        ];

        const currentIndex = steps.findIndex(step => step.id === status?.toLowerCase());
        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            current: index === currentIndex
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-full"
                    >
                        <ArrowLeft size={20} />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps(order?.status);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Orders
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Order Tracking</h1>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Order Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Order Information</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">Order ID</span>
                                        <span className="font-medium text-gray-800">{order?.order_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">Order Date</span>
                                        <span className="font-medium text-gray-800">{new Date(order?.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="font-medium text-green-600">₹{order?.total_amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order?.payment_status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order?.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <MapPin className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">Shipping Information</h2>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                    <p className="text-gray-800"><span className="font-medium">Address:</span> {order?.shipping_address.shipping_address}</p>
                                    <p className="text-gray-800"><span className="font-medium">City:</span> {order?.shipping_address?.city}</p>
                                    <p className="text-gray-800"><span className="font-medium">State:</span> {order?.shipping_address?.state}</p>
                                    <p className="text-gray-800"><span className="font-medium">Pincode:</span> {order?.shipping_address?.pincode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Timeline */}
                        <div className="relative mt-12">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-12">
                                {statusSteps.map((step, index) => (
                                    <div key={step.id} className="relative flex items-start group">
                                        <div className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center transform transition-all duration-300 ${step.completed ? 'bg-green-100 scale-110' : 'bg-gray-100'
                                            } group-hover:scale-110`}>
                                            {step.icon}
                                        </div>
                                        <div className="ml-24">
                                            <h3 className={`text-lg font-medium transition-colors duration-300 ${step.current ? 'text-green-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                {step.label}
                                            </h3>
                                            {step.current && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Your order is currently {step.label.toLowerCase()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
                        </div>
                        <div className="space-y-4">
                            {order?.items?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl transform transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02]">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                                            <img
                                                src={item.image_url}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800 text-lg">{item.product_name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">₹{item.price_per_unit?.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">Total: ₹{(item.price_per_unit * item.quantity)?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking; 