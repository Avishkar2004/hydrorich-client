import { Link } from "react-router-dom";
import Crops from "../../assets/Options/crops.png";

export default function Home() {
  return (
    <section
      id="home"
      className="bg-green-50 py-20 px-4 sm:px-8 md:px-16 lg:px-32 text-center"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 leading-tight mb-6">
          Welcome to Hydrorich 🌿
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-12">
          Discover the power of organic agriculture with Hydrorich — boosting growth, sustainability, and freshness for every crop and everywhere.
        </p>

        {/* Button Group */}
        <div className="flex justify-center gap-6 flex-wrap items-center">
          {/* Explore Products Button */}
          <Link to="/products">
            <button className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition duration-300 text-sm">
              Explore Products
            </button>
          </Link>

          {/* Compact Crop Card */}
          <Link to="/crops">
            <div className="shadow-md rounded-xl p-2 w-28 hover:shadow-lg transition duration-300">
              <img
                src={Crops}
                alt="Crops"
                className="w-full h-20 object-contain rounded-md mb-1 transition-transform duration-300 hover:scale-105"
              />
              <div className="text-green-700 font-semibold text-sm mt-1">Crop's</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
