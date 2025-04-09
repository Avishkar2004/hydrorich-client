import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="relative bg-green-50 py-24 sm:py-28 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50 to-green-100" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">Let’s Talk 🌿</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you're a passionate farmer or a curious customer, we'd love to hear from you.
                    </p>
                </div>

                {/* Form & Info */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Contact Form */}
                    <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-green-100">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-green-700">Your Name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-700">Your Email</label>
                                <input
                                    type="email"
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-700">Message</label>
                                <textarea
                                    rows="5"
                                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="What's on your mind?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition shadow-lg"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center md:text-left space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-green-700 mb-2">Visit Us</h3>
                            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                <MapPin className="text-green-600" /> Pune, Maharashtra, India - 411001
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-700 mb-2">Call Us</h3>
                            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                <Phone className="text-green-600" /> +91 9322810348
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-700 mb-2">Email Us</h3>
                            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="text-green-600" /> support@hydrorich.in
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
