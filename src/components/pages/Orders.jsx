import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { API_ENDPOINTS, getAuthHeader } from "../../config/api.js";
import { Package, Loader2, Calendar, MapPin, CreditCard, ChevronRight, ShoppingBag, Truck, CheckCircle2, ArrowRight, ArrowLeft, Download, FileDown, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingInvoices, setDownloadingInvoices] = useState({});

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
                    // Sort orders by created_at in descending order (newest first)
                    const sortedOrders = data.data.sort((a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                    );
                    setOrders(sortedOrders);
                } else {
                    setOrders([]);
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

    const downloadInvoice = async (orderId) => {
        try {
            setDownloadingInvoices(prev => ({ ...prev, [orderId]: true }));

            // Create a new AbortController with a longer timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60 seconds

            const response = await fetch(API_ENDPOINTS.invoices.replace(":orderId", orderId), {
                credentials: "include",
                headers: getAuthHeader(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Failed to download invoice: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Invalid response format: Expected PDF');
            }

            const blob = await response.blob();
            if (blob.size < 1000) {
                throw new Error('Invalid PDF file received: File too small');
            }

            // Create and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error("Error downloading invoice:", error);
            if (error.name === 'AbortError') {
                alert("Download timed out. Please try again.");
            } else {
                alert(error.message || "Failed to download invoice. Please try again.");
            }
        } finally {
            setDownloadingInvoices(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <Package className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">Please sign in to view your orders.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                    >
                        Sign In to Continue
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                    >
                        Start Shopping
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                    <button
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                        Continue Shopping
                        <ArrowRight size={18} />
                    </button>
                </div>
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Order #{order.order_number}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                                <Calendar size={14} className="text-green-600" />
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize">{order.status}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getPaymentStatusColor(order.payment_status)}`}>
                                                <CreditCard size={14} className="text-green-600" />
                                                <span className="capitalize">{order.payment_status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 md:mt-0 text-right">
                                        <span className="text-xl font-bold text-green-600">
                                            ₹{order.total_amount.toLocaleString()}
                                        </span>
                                        <div className="mt-3 flex gap-2">
                                            <Link
                                                to={`/order-tracking/${order.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 text-sm"
                                            >
                                                <Truck className="w-3.5 h-3.5" />
                                                Track
                                            </Link>
                                            <button
                                                onClick={() => downloadInvoice(order.id)}
                                                className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-all duration-300 text-sm"
                                            >
                                                <FileDown className="w-3.5 h-3.5" />
                                                {downloadingInvoices[order.id] ? 'Downloading...' : 'Invoice'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-1.5 text-sm">
                                            <MapPin size={16} className="text-green-600" />
                                            Delivery Address
                                        </h3>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                            <p className="font-medium">{order.shipping_address.fullName}</p>
                                            <p className="text-gray-600">{order.shipping_address.street}</p>
                                            <p className="text-gray-600">
                                                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-1.5 text-sm">
                                            <CreditCard size={16} className="text-green-600" />
                                            Payment Details
                                        </h3>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                                            <p className="font-medium capitalize">{order.payment_method}</p>
                                            <p className="text-gray-600 capitalize">Status: {order.payment_status}</p>
                                            <p className="text-gray-600">Last Updated: {new Date(order.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-1.5 text-sm">
                                        <ShoppingBag size={16} className="text-green-600" />
                                        Order Items
                                    </h3>
                                    <div className="space-y-3">
                                        {Array.isArray(order.items) && order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border bg-white">
                                                        <img
                                                            src={item.image_url || '/placeholder-image.jpg'}
                                                            alt={item.product_name || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 text-sm">{item.product_name || 'Product'}</h4>
                                                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-green-600">
                                                            ₹{(item.price_per_unit * item.quantity)?.toLocaleString() || '0'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                                No items found in this order
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders; 