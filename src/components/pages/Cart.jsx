import useCartStore from "../../store/cartStore.js";
import { Loader2, Trash2, Minus, Plus, Package, ArrowRight, ShoppingBag, CreditCard, Shield, Tag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { Link } from "react-router-dom";

const Cart = () => {
    const { user, loading } = useAuth()
    const { cart, removeFromCart, clearCart, updateQuantity } = useCartStore();
    const totalPrice = cart.reduce((acc, item) => acc + item.variantPrice * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
                <Loader2 className="animate-spin mb-4" size={32} />
                <span className="text-lg">Loading your cart...</span>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <Package size={48} className="mx-auto mb-4 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart Awaits</h2>
                    <p className="text-gray-600 mb-8">
                        Sign in to view your cart and start shopping. Your items will be saved for you.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Sign In to Continue
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="text-green-600" size={28} />
                    <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                </div>
                <span className="text-gray-600 bg-gray-50 px-4 py-2 rounded-full">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </div>

            {cart.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <Package size={48} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/pgr"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex gap-6">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden border bg-gray-50">
                                        <img
                                            src={item.productImage}
                                            alt={item.productTitle}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="group">
                                                    <h2 className="font-semibold text-lg text-gray-800  ">
                                                        Name: {item.productTitle}
                                                    </h2>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Tag size={14} className="text-gray-400" />
                                                    <p className="text-sm text-gray-500">
                                                        {item.variantName}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">
                                                        ₹{(item.variantPrice ?? 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-gray-400">per item</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId, item.variantName)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                title="Remove from cart"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <div className="flex items-center border rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.variantName, Math.max(1, item.quantity - 1))}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-4 py-1 text-gray-800 bg-gray-50">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.variantName, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div className="flex-1 text-right">
                                                <span className="text-gray-600 font-medium">
                                                    Total: ₹{((item.variantPrice ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <CreditCard size={20} className="text-green-600" />
                                Order Summary
                            </h2>

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

                            <div className="space-y-4">
                                <Link to="/checkout"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={20} />
                                    Proceed to Checkout
                                </Link>
                                <button
                                    onClick={clearCart}
                                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} />
                                    Clear Cart
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Shield size={16} className="text-green-600" />
                                    <span>100% Secure Payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;