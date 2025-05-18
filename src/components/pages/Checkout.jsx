import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore.js";
import { useAuth } from "../../hooks/useAuth.js";
import { API_ENDPOINTS, getAuthHeader } from "../../config/api.js";
import {
    CreditCard,
    MapPin,
    Package,
    CheckCircle2,
    ArrowRight,
    Loader2,
    ChevronRight,
    ChevronLeft
} from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, clearCart } = useCartStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalPrice = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0)
    // Form states
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    });

    const steps = [
        { id: 1, title: "Delivery Address", icon: MapPin },
        { id: 2, title: "Payment Method", icon: CreditCard },
        { id: 3, title: "Review Order", icon: Package }
    ];

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(2);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(3);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                totalAmount: totalPrice,
                paymentMethod,
                shippingAddress: address,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await fetch(API_ENDPOINTS.orders, {
                method: 'POST',
                headers: getAuthHeader(),
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            clearCart();
            navigate("/order-success");
        } catch (error) {
            console.error("Error placing order:", error);
            // You might want to show an error message to the user here
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <Package size={48} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to proceed with checkout.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Sign In to Continue
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.id
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-400"
                                }`}>
                                <step.icon size={20} />
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                                    }`}>
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-24 h-0.5 mx-4 bg-gray-200">
                                    <div className={`h-full bg-green-600 transition-all duration-300 ${currentStep > step.id ? "w-full" : "w-0"
                                        }`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {currentStep === 1 && (
                        <form onSubmit={handleAddressSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.fullName}
                                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.pincode}
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        value={address.landmark}
                                        onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                                >
                                    Continue to Payment
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </form>
                    )}

                    {currentStep === 2 && (
                        <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-green-600 transition-colors"
                                    onClick={() => setPaymentMethod("card")}>
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "card"}
                                        onChange={() => setPaymentMethod("card")}
                                        className="text-green-600 focus:ring-green-600"
                                    />
                                    <CreditCard size={24} className="text-gray-600" />
                                    <span className="font-medium">Credit/Debit Card</span>
                                </div>

                                {paymentMethod === "card" && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={cardDetails.name}
                                                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                    placeholder="123"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                                >
                                    <ChevronLeft size={20} />
                                    Back to Address
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                                >
                                    Review Order
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </form>
                    )}

                    {currentStep === 3 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Order</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Delivery Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">{address.fullName}</p>
                                        <p className="text-gray-600">{address.street}</p>
                                        <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                                        <p className="text-gray-600">Phone: {address.phone}</p>
                                        {address.landmark && (
                                            <p className="text-gray-600">Landmark: {address.landmark}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={20} className="text-gray-600" />
                                            <span className="font-medium">Credit/Debit Card</span>
                                        </div>
                                        <p className="text-gray-600 mt-2">Card ending in {cardDetails.number.slice(-4)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Order Items</h3>
                                    <div className="space-y-4">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex flex-col bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-white">
                                                        <img
                                                            src={item.image_url || '/placeholder-image.jpg'}
                                                            alt={item.product_name || 'Product'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 text-lg">{item.product_name || 'Unknown Product'}</h4>
                                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                                            {item.category && (
                                                                <p className="text-sm text-gray-500">
                                                                    <span className="font-medium">Category:</span> {item.category}
                                                                </p>
                                                            )}
                                                            <p className="text-sm text-gray-500">
                                                                <span className="font-medium">Variant:</span> {item.variant_name || 'Default Variant'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Price Per Item</p>
                                                        <p className="font-medium">₹{(item.price || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Quantity</p>
                                                        <p className="font-medium">{item.quantity || 0}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">Subtotal</p>
                                                        <p className="font-medium text-green-600">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                {item.description && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500 mb-1">Product Description</p>
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    </div>
                                                )}

                                                {item.specifications && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-500">Specifications</p>
                                                        <p className="text-sm text-gray-600">{item.specifications}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>


                            </div>
                            <div className="mt-6 flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                                >
                                    <ChevronLeft size={20} />
                                    Back to Payment
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <CheckCircle2 size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span className="text-green-600">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 