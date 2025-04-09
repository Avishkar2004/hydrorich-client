import React from "react";
import HydroRich from "../../assets/products/Hydrorich.jpg"
import Hydrorich2 from "../../assets/products/Hydrorich2.jpg"

export default function AboutUs() {
    return (
        <section id="aboutus" className="bg-white text-gray-800 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">About Hydrorich 🌿</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Revolutionizing agriculture through innovation and sustainability.
                    </p>
                </div>

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-semibold text-green-600 mb-4">Our Journey</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Hydrorich was born out of a passion for sustainable agriculture and a deep commitment to support farmers with eco-friendly, high-yield solutions. From humble beginnings, we’ve grown into a trusted brand focused on empowering communities and ensuring soil health for generations to come.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Today, we proudly serve thousands of farmers across India with products that are tested, trusted, and tailored to local needs. Whether it's organic fertilizers, innovative irrigation tools, or crop boosters — we're here to make farming smarter and greener.
                        </p>
                    </div>

                    {/* Image */}
                    {/* Image Gallery */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <img
                            src={HydroRich}
                            alt="Hydrorich Product"
                            className="w-full h-80 py-2 px-2 object-cover rounded-2xl shadow-lg border border-green-300 hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                        <img
                            src={Hydrorich2}
                            alt="Hydrorich Product 2"
                            className="w-full py-2 px-2 h-80 object-cover rounded-2xl shadow-lg border border-green-300 hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                    </div>


                </div>

                {/* Vision & Mission */}
                <div className="mt-20 grid md:grid-cols-2 gap-10">
                    <div className="bg-green-50 p-6 rounded-xl shadow-sm">
                        <h4 className="text-xl font-semibold text-green-700 mb-3">🌱 Our Vision</h4>
                        <p className="text-gray-700">
                            To lead the agricultural revolution by providing innovative, sustainable, and affordable solutions to every farmer in India.
                        </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl shadow-sm">
                        <h4 className="text-xl font-semibold text-green-700 mb-3">🚜 Our Mission</h4>
                        <p className="text-gray-700">
                            To empower farmers through education, innovation, and premium organic products — building a greener and healthier nation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
