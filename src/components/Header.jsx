import { useState } from "react";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import Logo from "../assets/Logo.jpg";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router-dom";
import useCartStores from "../store/cartStore.js";
import {
  LogOut,
  Settings,
  MessageSquare,
  FileText,
  ChevronDown

} from "lucide-react";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuth()
  const navLinks = ["Products", "About Us", "Contact"];
  const { cart } = useCartStores()
  const cartCount = cart.reduce((total, item) => total + item.qunatity, 0)
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
        <div className="hidden md:flex flex-1 mx-6 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border border-gray-400 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <Search className="absolute top-2.5 left-3 text-gray-500" size={20} />
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
            <Link to="/wishlist" className="text-gray-600 hover:text-green-600 transition">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600 transition">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                {/* Trigger */}
                <div className="flex items-center gap-2 text-gray-800 hover:text-green-600 transition cursor-pointer">
                  <User size={22} />
                  <span className="text-sm font-medium">{user.displayName?.split(" ")[0]}</span>
                  <ChevronDown size={18} />
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
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
                  <Link
                    to="http://localhost:8080/api/auth/logout"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition">
                    <LogOut size={16} /> Logout
                  </Link>
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
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
            <Link to="/wishlist" className="text-gray-600 hover:text-green-600">
              <Heart />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600 transition">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          {user ? (
            <div className="w-full border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center gap-3 text-gray-800">
                <User size={22} />
                <span className="text-base font-medium">{user.displayName?.split(" ")[0]}</span>
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
                <Link
                  to="http://localhost:8080/api/auth/logout"
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition">
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full border-t border-gray-200 mt-4 pt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition">
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
