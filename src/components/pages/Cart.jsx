import useCartStore from "../../store/cartStore.js";
import { Trash2 } from "lucide-react";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCartStore();

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-green-700">🛒 Your Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center text-gray-600 text-lg">Your cart is currently empty.</div>
            ) : (
                <div className="space-y-6">
                    {cart.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white shadow-sm rounded-xl flex items-center justify-between p-4 border border-gray-200"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-md border"
                                />
                                <div>
                                    <h2 className="font-semibold text-lg text-gray-800">
                                        {item.name} <span className="text-sm text-gray-500">({item.variantName})</span>
                                    </h2>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.productId, item.variantName)}
                                className="text-red-600 hover:text-red-800 transition"
                                title="Remove from cart"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    <div className="text-right space-y-4 mt-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Total: ₹{totalPrice.toFixed(2)}
                        </h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={clearCart}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                            >
                                Clear Cart
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
