import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Package, Truck, AlertCircle, ArrowLeft, MapPin, CreditCard, ShoppingBag, Loader2, Calendar, ChevronRight, LoaderPinwheel } from 'lucide-react';
import api from '../../config/api';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
    withCredentials: true,
});

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/api/orders/${orderId}`);
                const orderData = response.data.data;
                setOrder(orderData);
                setOrderStatus(orderData.status);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

        socket.connect();
        socket.emit('join_order_tracking', orderId);

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('order_status_update', (data) => {
            setOrderStatus(data.status);
            // Update the order object with new status
            setOrder(prevOrder => ({
                ...prevOrder,
                status: data.status,
                updated_at: new Date().toISOString()
            }));
        });

        return () => {
            socket.emit('leave_order_tracking', orderId);
            socket.disconnect();
        };
    }, [orderId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'processing': return <LoaderPinwheel className="w-5 h-5 animate-bounce" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle2 className="w-5 h-5" />;
            case 'cancelled': return <Package className="w-5 h-5" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIndex = (status) => {
        const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return statusOrder.indexOf(status);
    };

    const isStatusActive = (status) => {
        const currentStatusIndex = getStatusIndex(orderStatus);
        const statusIndex = getStatusIndex(status);
        return statusIndex <= currentStatusIndex;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/orders')}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Orders
                        </button>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm text-gray-600">
                                {isConnected ? 'Live Tracking' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Order #{order?.order_number}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Placed on {new Date(order?.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full ${getStatusColor(orderStatus)}`}>
                                        <span className="capitalize font-medium">{orderStatus}</span>
                                    </div>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                    <div className="space-y-8">
                                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                            <div key={status} className="relative flex items-start">
                                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center transform transition-all duration-300 ${isStatusActive(status) ? getStatusColor(status) : 'bg-gray-100'
                                                    }`}>
                                                    {getStatusIcon(status)}
                                                </div>
                                                <div className="ml-12">
                                                    <h4 className={`text-base font-medium ${isStatusActive(status) ? 'text-gray-800' : 'text-gray-500'
                                                        }`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </h4>
                                                    {orderStatus === status && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Your order is currently {status} at {new Date(order?.updated_at).toLocaleString()}
                                                        </p>
                                                    )}
                                                    {status === "delivered" && (
                                                        <span className='text-sm text-gray-600 mt-1'>
                                                            Your Order is Delivered at {new Date(order?.updated_at).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {Array.isArray(order?.items) && order.items.length > 0 ? (
                                        order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden border bg-white">
                                                    <img
                                                        src={item.image_url || '/placeholder-image.jpg'}
                                                        alt={item.product_name || 'Product'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{item.product_name || 'Product'}</h4>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-green-600">
                                                        ₹{(item.price_per_unit * item.quantity)?.toLocaleString() || '0'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                                            No items found in this order
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="text-xl font-bold text-green-600">
                                            ₹{order?.total_amount?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium capitalize">{order?.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order?.payment_status)}`}>
                                            {order?.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-green-600" />
                                    Shipping Address
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p className="font-medium text-gray-800">{order?.shipping_address?.fullName}</p>
                                    <p>{order?.shipping_address?.street}</p>
                                    <p>{order?.shipping_address?.city}, {order?.shipping_address?.state}</p>
                                    <p>{order?.shipping_address?.pincode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                                <p className="text-gray-600 mb-4">If you have any questions about your order, our support team is here to help.</p>
                                <button className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300">
                                    Contact Support
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking; 