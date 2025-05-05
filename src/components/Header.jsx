import { useState } from "react";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import Logo from "../assets/Logo.jpg";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuth()
  console.log(user)
  const navLinks = ["Products", "About Us", "Contact"];

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
            <Link to="/cart" className="text-gray-600 hover:text-green-600 transition">
              <ShoppingCart size={22} />
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                  <User size={22} />
                  <span className="text-sm font-semibold">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-100 hidden group-hover:block z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    👤 Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🧾 My Orders
                  </Link>
                  <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    💬 Messages
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    ⚙️ Settings
                  </Link>

                  <Link to="http://localhost:8080/api/auth/logout" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100">
                    🚪 Logout
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-600 transition">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-full hover:bg-gray-700 transition">
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
            <Link to="/cart" className="text-gray-600 hover:text-green-600">
              <ShoppingCart />
            </Link>
            <Link to="/account" className="text-gray-600 hover:text-green-600">
              <User />
            </Link>
          </div>
          {user ? (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 font-medium text-center">
                Hello, {user.displayName?.split(" ")[0]}
              </p>
              <Link to="/profile" className="block text-center text-sm text-blue-600 hover:text-blue-800">
                👤 Profile
              </Link>
              <Link to="/orders" className="block text-center text-sm text-blue-600 hover:text-blue-800">
                🧾 My Orders
              </Link>
              <Link to="/messages" className="block text-center text-sm text-blue-600 hover:text-blue-800">
                💬 Messages
              </Link>
              <Link to="/settings" className="block text-center text-sm text-blue-600 hover:text-blue-800">
                ⚙️ Settings
              </Link>
              <Link to="http://localhost:8080/api/auth/logout" className="block text-center text-sm text-red-500 hover:text-red-700">
                🚪 Logout
              </Link>
            </div>
          ) : (
            <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200">
              Shop Now
            </button>
          )}

        </div>
      )}
    </header>
  );
}
