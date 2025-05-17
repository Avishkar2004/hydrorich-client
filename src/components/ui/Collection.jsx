import React, { useState } from "react";
import { Link } from "react-router-dom";
import Funcgicide from "../../assets/Collections/fungicide1.avif";
import insectiicide1 from "../../assets/Collections/insectiicide1.avif";
import micronutrients1 from "../../assets/Collections/micronutrients1.avif";
import Organic from "../../assets/Collections/organic.avif";
import Pgr from "../../assets/Collections/pgr.avif";
import { ArrowRight, ArrowRightToLine } from "lucide-react";

const Collection = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="flex flex-col items-center mb-5 mt-5">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[1436px] px-4 mb-5 font-bold">
        <h1 className="text-[#1e2d7d] text-lg sm:text-xl font-primary cursor-pointer">
          Our Collection's
        </h1>
        <h1
          className="text-[#00badb] transition hover:-translate-x-5 text-base sm:text-lg duration-500 cursor-pointer flex items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          View All
          {isHovered && <ArrowRight className="ml-2" />}
        </h1>
      </div>
      {/* Collection */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-14 xl:gap-24">
        <Link
          to="/pgrs"
          className="flex flex-col items-center space-y-2 rounded-full hover:scale-105 transition duration-300"
        >
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full hover:scale-105 transition duration-300"
            src={Pgr}
            alt="Plant Growth Regulator"
          />
          <span className="text-sm md:text-base">Plant Growth Regulator</span>
        </Link>

        <Link
          to="/organicproducts"
          className="flex flex-col items-center space-y-2 rounded-full hover:scale-105 transition duration-300"
        >
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full hover:scale-105 transition duration-300"
            src={Organic}
            alt="Buy Organic Product"
          />
          <span className="text-sm md:text-base">Buy Organic Product</span>
        </Link>

        <Link
          to="/micronutrients"
          className="flex flex-col items-center space-y-2 rounded-full hover:scale-105 transition duration-300"
        >
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full hover:scale-105 transition duration-300"
            src={micronutrients1}
            alt="Buy Micro Nutrients"
          />
          <span className="text-sm md:text-base">Buy Micro Nutrients</span>
        </Link>

        <Link
          to="/insecticides"
          className="flex flex-col items-center space-y-2 rounded-full hover:scale-105 transition duration-300"
        >
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full hover:scale-105 transition duration-300"
            src={insectiicide1}
            alt="Buy Insecticide of Leading"
          />
          <span className="text-sm md:text-base">Insecticide of Leading</span>
        </Link>

        <Link
          to="/fungicides"
          className="flex flex-col items-center space-y-2 rounded-full hover:scale-105 transition duration-300"
        >
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full hover:scale-105 transition duration-300"
            src={Funcgicide}
            alt="Buy Fungicide Online"
          />
          <span className="text-sm md:text-base">Fungicide Online</span>
        </Link>
      </div>
    </section>
  );
};

export default Collection;
