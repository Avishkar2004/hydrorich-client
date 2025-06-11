import { Link } from "react-router-dom";
import Crops from "../../assets/Options/crops.png";

export default function Home() {
  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 leading-tight mb-6">
            Hydrorich: AI-Powered Smart Farming for a Greener Future 🌿          </h1>
          <p className="text-gray-700 text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            Revolutionizing agriculture with AI-powered solutions. Experience the future of smart farming with Hydrorich — where artificial intelligence meets organic excellence.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-green-600 text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">AI-driven insights for optimal crop growth and resource management</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-green-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Predictive Analysis</h3>
            <p className="text-gray-600">Forecast crop yields and optimize harvest timing with precision</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-green-600 text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Irrigation</h3>
            <p className="text-gray-600">AI-powered water management for sustainable farming</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-16">
          <div className="flex justify-center gap-6 flex-wrap items-center">
            <Link to="/products">
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-full hover:from-green-700 hover:to-green-800 transition duration-300 text-sm shadow-md hover:shadow-lg">
                Explore Products
              </button>
            </Link>
            <Link to="/crops">
              <div className="shadow-md rounded-xl p-3 w-32 hover:shadow-lg transition duration-300 bg-white">
                <img
                  src={Crops}
                  alt="Crops"
                  className="w-full h-20 object-contain rounded-md mb-1"
                />
                <div className="text-green-700 font-semibold text-sm mt-1">Crop's</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Farmers</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Acres Monitored</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">What Our Farmers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"Hydrorich AI has transformed our farming practices. The predictive analytics are spot on!"</p>
              <div className="font-semibold text-gray-800">- Rajesh Kumar</div>
              <div className="text-sm text-gray-500">Organic Farmer</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"The smart irrigation system has helped us save water and improve crop yield significantly."</p>
              <div className="font-semibold text-gray-800">- Priya Sharma</div>
              <div className="text-sm text-gray-500">Commercial Farmer</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"The AI-powered insights have made farming more efficient and sustainable for us."</p>
              <div className="font-semibold text-gray-800">- Amit Patel</div>
              <div className="text-sm text-gray-500">Tech-Savvy Farmer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
