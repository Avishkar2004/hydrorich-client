import React from "react";

const tips = [
  {
    icon: "🌾",
    title: "Crop Rotation",
    description: "Rotate crops each season to maintain soil fertility and reduce pests naturally."
  },
  {
    icon: "💧",
    title: "Water Conservation",
    description: "Use drip irrigation and schedule watering to minimize waste and maximize efficiency."
  },
  {
    icon: "🌱",
    title: "Organic Fertilizers",
    description: "Choose organic fertilizers to enrich soil health and reduce chemical runoff."
  },
  {
    icon: "🪱",
    title: "Composting",
    description: "Compost farm waste to create nutrient-rich soil amendments and reduce landfill use."
  }
];

export default function SustainabilityTips() {
  return (
    <section className="my-16 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8">
        Sustainability Tips for Smart Farming
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition duration-300">
            <div className="text-4xl mb-3">{tip.icon}</div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">{tip.title}</h3>
            <p className="text-gray-600 text-sm">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 