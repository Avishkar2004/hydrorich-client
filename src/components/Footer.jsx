import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-green-100 text-gray-800 pt-10 pb-6 mt-12 border-t border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Logo & Tagline */}
                <div>
                    <h2 className="text-2xl font-bold text-green-700">Hydrorich 🌱</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Empowering agriculture through innovation.
                        Organic, sustainable, and effective farming products for a greener tomorrow.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-green-800 transition">Home</Link></li>
                        <li><Link to="/faq" className="hover:text-green-800 transition">FAQ</Link></li>
                        <li><Link to="/products" className="hover:text-green-800 transition">Products</Link></li>
                        <li><Link to="/aboutus" className="hover:text-green-800 transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-green-800 transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-3">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-700" />
                            +91 9322810348
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-green-700" />
                            avishkarkakde2004@gmail.com
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-700" />
                            Pune, Maharashtra, India
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-8 border-t border-green-300 pt-4 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} Hydrorich. All rights reserved.
            </div>
        </footer>
    );
}
