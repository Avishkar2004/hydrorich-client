import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section id="home" className="bg-green-50 py-20 px-4 sm:px-8 md:px-16 lg:px-32 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 leading-tight mb-6">
          Welcome to Hydrorich 🌿
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8">
          Discover the power of organic agriculture with Hydrorich — boosting growth, sustainability, and freshness for every crop and everywhere.
        </p>
        <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300">
          <Link to="/products">Explore Products</Link>
        </button>
      </div>
    </section>
  );
}
