import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api.js';
import { Star, MessageCircle, Package, Calendar, ArrowRight } from 'lucide-react';
import ReviewModal from '../ui/ReviewModal.jsx';

const ReviewableOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReviewableOrders();
    }
  }, [user]);

  const fetchReviewableOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.reviews.reviewableOrders, {
        headers: getAuthHeader(),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (product, orderId) => {
    setSelectedProduct(product);
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh the orders to update review status
    fetchReviewableOrders();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReviewableOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Reviewable Orders</h2>
          <p className="text-gray-600 mb-4">
            You don't have any delivered orders to review yet.
          </p>
          <p className="text-sm text-gray-500">
            Once your orders are delivered, you'll be able to review the products here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Review Your Orders</h1>
          <p className="text-gray-600">
            Share your experience with products from your delivered orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Order #{order.order_number}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="p-6">
                <h4 className="font-medium text-gray-800 mb-4">Products in this order:</h4>
                <div className="space-y-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border bg-white">
                          <img
                            src={product.image_url || '/placeholder-image.jpg'}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800">{product.product_name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            {product.has_review ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <Star size={14} className="fill-current" />
                                Review submitted
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Not reviewed yet</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!product.has_review && (
                        <button
                          onClick={() => handleReviewClick(product, order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MessageCircle size={16} />
                          Write Review
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {selectedProduct && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            product={selectedProduct}
            orderId={selectedOrderId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewableOrders; 