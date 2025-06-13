import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import {
  User, Mail, Calendar, MapPin, Phone, Loader2, Shield,
  Package, Heart, ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore.js';
import useWishlistStore from '../../store/wishlistStore.js';
import { API_ENDPOINTS, getAuthHeader } from "../../config/api.js";

function Profile() {
  const { user, loading } = useAuth();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [latestOrder, setLatestOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!user) return;

      try {
        const response = await fetch(API_ENDPOINTS.orders, {
          headers: getAuthHeader(),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const sortedOrders = data.data.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
          );
          setLatestOrder(sortedOrders[0]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchLatestOrder();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mr-3" size={24} />
        <span className="text-lg font-medium">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <User size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 via-green-50 to-white rounded-3xl shadow-lg p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-28 h-28 rounded-full bg-green-200 flex items-center justify-center shadow-inner">
            <User size={40} className="text-green-700" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800">{user.name}</h1>
            <p className="text-gray-600 text-sm mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-3">
              <span className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <Shield size={16} /> Verified User
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <Link to="/orders" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Orders</p>
              <h4 className="text-2xl font-bold text-gray-900">{latestOrder ? "1+" : "0"}</h4>
            </div>
          </div>
        </Link>

        <Link to="/wishlist" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200">
              <Heart size={24} className="text-pink-600" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Wishlist</p>
              <h4 className="text-2xl font-bold text-gray-900">{wishlist.length}</h4>
            </div>
          </div>
        </Link>

        <Link to="/cart" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Cart Items</p>
              <h4 className="text-2xl font-bold text-gray-900">{cart.length}</h4>
            </div>
          </div>
        </Link>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
        <div className="space-y-6">
          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail size={20} className="text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Email Address</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <Phone size={20} className="text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Phone Number</h3>
              <p className="text-gray-600">
                {latestOrder?.shipping_address?.phone
                  ? `+91 ${latestOrder.shipping_address.phone}`
                  : "No phone found"}
              </p>
            </div>
          </div>

          {/* Delivery Name */}
          <div className="flex items-start gap-4">
            <MapPin size={20} className="text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Latest Delivery Name</h3>
              <p className="text-gray-600">
                {latestOrder?.shipping_address?.fullName || "No delivery name found"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <MapPin size={20} className="text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Latest Delivery Address</h3>
              {latestOrder?.shipping_address ? (
                <div className="text-gray-600">
                  <p>{latestOrder.shipping_address.street}</p>
                  <p>
                    {latestOrder.shipping_address.city},{" "}
                    {latestOrder.shipping_address.state} -{" "}
                    {latestOrder.shipping_address.pincode}
                  </p>
                  {latestOrder.shipping_address.landmark && (
                    <p>Landmark: {latestOrder.shipping_address.landmark}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No delivery address found</p>
              )}
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-start gap-4">
            <Calendar size={20} className="text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Member Since</h3>
              <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
