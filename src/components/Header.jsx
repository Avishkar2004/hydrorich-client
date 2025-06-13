import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import Logo from "../assets/Logo.jpg";
import { useAuth } from "../hooks/useAuth.js";
import { Link, useNavigate } from "react-router-dom";
import useCartStores from "../store/cartStore.js";
import useSearchStore from "../store/searchStore.js";
import SearchResults from "./ui/SearchResults.jsx";
import {
  LogOut,
  Settings,
  MessageSquare,
  FileText,
  ChevronDown
} from "lucide-react";
import useWishlistStore from "../store/wishlistStore.js";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { cart, clearCart, syncCart } = useCartStores()
  const { wishlist, clearWishlist, syncWishlist } = useWishlistStore()
  const { searchQuery, setSearchQuery, searchProducts, clearSearch } = useSearchStore()
  const searchRef = useRef(null)
  const navLinks = ["Products", "About Us", "Contact"];

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        clearSearch();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  // Sync cart and wishlist when user logs in
  useEffect(() => {
    if (user) {
      syncCart()
      syncWishlist()
    }
  }, [user, syncCart, syncWishlist])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  const handleLogout = async () => {
    try {
      await logout()
      clearCart()
      clearWishlist()
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="Hydrorich Logo"
            className="h-12 w-auto sm:h-14 md:h-16 object-contain transition-all duration-300"
          />
        </Link>
        {/* Search Bar (Desktop Only) */}
        <div className="hidden md:flex flex-1 mx-6 max-w-xl" ref={searchRef}>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full border border-gray-400 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <Search className="absolute top-2.5 left-3 text-gray-500" size={20} />
            <SearchResults />
          </div>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase().replace(" ", "")}`}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              {link}
            </Link>
          ))}
          {/* Icons */}
          <div className="flex items-center space-x-4 ml-4">
            <Link to="/wishlist" className="relative text-gray-600 hover:text-green-600 transition">
              {user && wishlist.length > 0 ? (
                <AiFillHeart size={22} className="text-pink-500" />
              ) : (
                <AiOutlineHeart size={22} />
              )}
              {user && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] rounded-full px-2 py-0.5">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                {/* Trigger */}
                <div className="flex items-center gap-2 text-gray-800 hover:text-green-600 transition cursor-pointer">
                  <User size={22} />
                  <span className="text-sm font-medium">{user.name || user.displayName?.split(" ")[0]}</span>
                  <ChevronDown size={18} />
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-700 ease-in-out z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition">
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <ShoppingCart size={16} /> My Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-4 pb-6 space-y-4 shadow-md border-t border-gray-100">
          {/* Mobile Search */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
            <SearchResults />
          </div>
          {/* Mobile Links */}
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase().replace(" ", "")}`}
              className="block text-gray-700 hover:text-green-600 font-medium transition"
            >
              {link}
            </Link>
          ))}
          {/* Icons */}
          <div className="flex justify-between px-2">
            <Link to="/wishlist" className="text-gray-600 hover:text-green-600 relative">
              {user && wishlist.length > 0 ? (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] rounded-full px-2 py-0.5">
                  <Heart />
                  {wishlist.length}
                </span>
              ) : (
                <Heart />
              )}
            </Link>
            <Link to="/cart" className="relative">
              🛒 Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
          {user ? (
            <div className="w-full border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center gap-3 text-gray-800">
                <User size={22} />
                <span className="text-base font-medium">{user.name || user.displayName?.split(" ")[0]}</span>
              </div>
              <div className="mt-4 flex flex-col space-y-3 text-gray-700">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm hover:text-green-600 transition">
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-sm hover:text-green-600 transition">
                  <ShoppingCart size={16} /> My Orders
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-sm hover:text-green-600 transition">
                  <Settings size={16} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full border-t border-gray-200 mt-4 pt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-center transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-center transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
