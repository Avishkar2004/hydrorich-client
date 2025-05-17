import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { User, Mail, Calendar, MapPin, Phone, Edit2, Loader2, Shield, Package, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore.js';
import useWishlistStore from '../../store/wishlistStore.js';

function Profile() {
  const { user, loading } = useAuth();
  const { cart } = useCartStore()
  const { wishlist } = useWishlistStore()
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="text-lg">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <User size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <User size={48} className="text-green-600" />
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors"
            >
              <Edit2 size={18} className="text-green-600" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-gray-600">
                <Shield size={16} className="text-green-600" />
                <span>Verified User</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} className="text-green-600" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/orders" className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Orders</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Link>

        <Link to="/wishlist" className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
              <Heart size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Wishlist</h3>
              <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            </div>
          </div>
        </Link>

        <Link to="/cart" className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Cart Items</h3>
              <p className="text-2xl font-bold text-gray-900">{cart.length}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail size={20} className="text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Email Address</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone size={20} className="text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Phone Number</h3>
              <p className="text-gray-600">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin size={20} className="text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium text-gray-700">Address</h3>
              <p className="text-gray-600">{user.address || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Calendar size={20} className="text-gray-400 mt-1" />
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