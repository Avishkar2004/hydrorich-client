import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../assets/Logo.jpg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = ["Home", "Products", "About Us", "Contact"];

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

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(" ", "")}`}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              {link}
            </a>
          ))}
          <button className="ml-4 px-5 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200">
            Shop Now
          </button>
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
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-md border-t border-gray-100">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "")}`}
              className="block text-gray-700 hover:text-green-600 font-medium transition"
            >
              {link}
            </a>
          ))}
          <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-200">
            Shop Now
          </button>
        </div>
      )}
    </header>
  );
}
