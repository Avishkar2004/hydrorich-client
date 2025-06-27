import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. We'll send you an email with your order details and tracking information.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-full"
                    >
                        View Order Status
                        <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/pgrs"
                        className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3 rounded-xl transition-all duration-300 w-full"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess; 