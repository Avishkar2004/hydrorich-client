import React from 'react';
import { useParams } from 'react-router-dom';

const cropDetails = {
  soybean: {
    name: 'Soybean',
    description: 'Soybean is a major source of protein and oil...',
    growingSeason: 'June to October',
    image: 'https://cdn.britannica.com/28/154828-050-05C6239A/Soybeans.jpg',
  },
  wheat: {
    name: 'Wheat',
    description: 'Wheat is a staple crop grown in rabi season...',
    growingSeason: 'November to April',
    image: 'https://www.peptechbio.com/wp-content/uploads/2023/03/Wheat_photo-cred-Adobe-stock_E-2.jpg',
  },
  cotton: {
    name: 'Cotton',
    description: 'Cotton is a fiber crop suited to black soil...',
    growingSeason: 'April to October',
    image: 'https://ankurseeds.com/media/wp-content/uploads/2020/02/cotton-cultivation.jpg',
  },
  sugarcane: {
    name: 'Sugarcane',
    description: 'Sugarcane requires abundant water and long growing periods...',
    growingSeason: 'October to March',
    image: 'https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1624337170981-FP5EI0NVZLGQHUQ0S6OO/shutterstock_390975046.jpg?format=2500w',
  },
  maize: {
    name: 'Maize',
    description: 'Maize is used for food, fodder, and biofuel...',
    growingSeason: 'June to September',
    image: 'https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg',
  },
};

function CropOptions() {
  const { name } = useParams();
  const crop = cropDetails[name];

  if (!crop) {
    return <div className="p-10 text-center text-red-500 text-xl">Crop not found</div>;
  }

  return (
    <div className="px-6 md:px-12 py-10 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-green-50 p-6 rounded-xl shadow-md">
        <img
          src={crop.image}
          alt={crop.name}
          className="w-full h-96 rounded-xl object-cover mb-6"
        />
        <h2 className="text-3xl font-bold text-green-700 mb-4">{crop.name}</h2>
        <p className="text-gray-700 mb-4">{crop.description}</p>
        <p className="text-gray-600">
          <strong className="text-green-700">Growing Season:</strong> {crop.growingSeason}
        </p>
      </div>
    </div>
  );
}
export default CropOptions;
