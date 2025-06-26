import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api.js';
import { useAuth } from '../../hooks/useAuth.js';

const ReviewSection = ({ productId, averageRating = 0, reviewCount = 0 }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.reviews.product}/${productId}?page=${currentPage}&limit=5`,
        {
          headers: getAuthHeader(),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setPagination(data.data.pagination);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.reviews.delete}/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reviews
        fetchReviews();
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="text-green-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-green-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
        </div>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.user_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {maskEmail(review.user_email)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                  {user && review.user_id === user.id && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection; 