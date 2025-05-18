import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { API_ENDPOINTS, getAuthHeader } from "../../config/api.js";
import { Package, Loader2, Calendar, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.orders, {
                    headers: getAuthHeader(),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                if (data && data.success && Array.isArray(data.data)) {
                    setOrders(data.data);
                } else {
                    setOrders([]);
                    console.error('Invalid orders data structure:', data);
                }
            } catch (err) {
                setError(err.message);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <Package size={48} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to view your orders.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Sign In to Continue
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <Package size={48} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
                    <p className="text-gray-600 mb-8">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Start Shopping
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Order #{order.order_number}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Package size={16} />
                                            <span className="capitalize">{order.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{order.total_amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                        <MapPin size={18} />
                                        Delivery Address
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{order.shipping_address.fullName}</p>
                                        <p className="text-gray-600">{order.shipping_address.street}</p>
                                        <p className="text-gray-600">
                                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                        </p>
                                        <p className="text-gray-600">Phone: {order.shipping_address.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                        <CreditCard size={18} />
                                        Payment Details
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium capitalize">{order.payment_method}</p>
                                        <p className="text-gray-600 capitalize">Status: {order.payment_status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-800 mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden border bg-white">
                                                <img
                                                    src={item.image_url || '/placeholder-image.jpg'}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800">{item.product_name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Price: ₹{item.price_per_unit.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-green-600">
                                                    ₹{(item.price_per_unit * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders; 