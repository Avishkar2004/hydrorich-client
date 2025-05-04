import { useState } from "react";
import { Menu, X, ShoppingCart, Heart, User, Search } from "lucide-react";
import Logo from "../assets/Logo.jpg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Products", "About Us", "Contact"];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="Hydrorich Logo"
            className="h-12 w-auto sm:h-14 md:h-16 object-contain transition-all duration-300"
          />
        </a>

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
            <a
              key={link}
              href={`/${link.toLowerCase().replace(" ", "")}`}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              {link}
            </a>
          ))}

          {/* Icons */}
          <div className="flex items-center space-x-4 ml-4">
            <a href="/wishlist" className="text-gray-600 hover:text-green-600 transition">
              <Heart size={22} />
            </a>
            <a href="/cart" className="text-gray-600 hover:text-green-600 transition">
              <ShoppingCart size={22} />
            </a>
            <a href="/signup" className="text-gray-600 hover:text-green-600 transition">
              <User size={22} />
            </a>
            <button className="px-5 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200">
              Shop Now
            </button>
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
            <a
              key={link}
              href={`/${link.toLowerCase().replace(" ", "")}`}
              className="block text-gray-700 hover:text-green-600 font-medium transition"
            >
              {link}
            </a>
          ))}

          {/* Icons */}
          <div className="flex justify-between px-2">
            <a href="/wishlist" className="text-gray-600 hover:text-green-600">
              <Heart />
            </a>
            <a href="/cart" className="text-gray-600 hover:text-green-600">
              <ShoppingCart />
            </a>
            <a href="/account" className="text-gray-600 hover:text-green-600">
              <User />
            </a>
          </div>

          <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200">
            Shop Now
          </button>
        </div>
      )}
    </header>
  );
}
