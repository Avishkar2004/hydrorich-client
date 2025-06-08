import React, { useState } from "react";
import { Link } from "react-router-dom";
import Funcgicide from "../../assets/Collections/fungicide1.avif";
import insectiicide1 from "../../assets/Collections/insectiicide1.avif";
import micronutrients1 from "../../assets/Collections/micronutrients1.avif";
import Organic from "../../assets/Collections/organic.avif";
import Pgr from "../../assets/Collections/pgr.avif";
import { ArrowRight } from "lucide-react";

const Collection = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const categories = [
    { name: "Plant Growth Regulator", to: "/pgrs", img: Pgr },
    { name: "Buy Organic Product", to: "/organicproducts", img: Organic },
    { name: "Buy Micro Nutrients", to: "/micronutrients", img: micronutrients1 },
    { name: "Insecticide of Leading", to: "/insecticides", img: insectiicide1 },
    { name: "Fungicide Online", to: "/fungicides", img: Funcgicide },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[#00badb] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00badb] via-[#1e2d7d] to-[#00badb]"></div>
      
      <div className="max-w-[1436px] mx-auto px-4 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1e2d7d] font-primary relative z-10">
              Our Collection&apos;s
            </h1>
            <div className="absolute -bottom-2 left-0 w-20 h-1 bg-[#00badb] rounded-full"></div>
          </div>
          <div
            className="text-[#00badb] hover:text-[#008fa3] transition-all duration-500 flex items-center mt-4 sm:mt-0 cursor-pointer group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-base sm:text-lg font-medium group-hover:underline">View All</span>
            <ArrowRight
              className={`ml-2 transition-transform duration-300 ${
                isHovered ? "translate-x-2" : ""
              }`}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {categories.map(({ name, to, img }) => (
            <Link
              key={name}
              to={to}
              className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-2 border-gray-100 group-hover:shadow-xl group-hover:border-[#00badb] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00badb]/10 to-[#1e2d7d]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="mt-4 text-sm md:text-base text-gray-800 font-medium group-hover:text-[#00badb] transition-colors duration-300 text-center">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
