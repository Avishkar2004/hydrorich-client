import React from 'react';
import { CheckCircle, Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CropList() {
    const navigate = useNavigate();

    const crops = [
        {
            id: 1,
            name: "Soybean",
            image: "https://cdn.britannica.com/28/154828-050-05C6239A/Soybeans.jpg",

        },
        {
            id: 2,
            name: "Wheat",
            image: "https://www.peptechbio.com/wp-content/uploads/2023/03/Wheat_photo-cred-Adobe-stock_E-2.jpg"
        },
        {
            id: 3,
            name: "Cotton",
            image: "https://ankurseeds.com/media/wp-content/uploads/2020/02/cotton-cultivation.jpg"
        },
        {
            id: 4,
            name: "Sugarcane",
            image: "https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1624337170981-FP5EI0NVZLGQHUQ0S6OO/shutterstock_390975046.jpg?format=2500w"
        },
        {
            id: 5,
            name: "Maize",
            image: "https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg"
        }
    ]

    const handleClick = (crop) => {
        navigate(`/crops/${crop.name.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">Our Crops</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Supported Crops
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive selection of crops, each with detailed growing guides and recommended practices
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((crop, index) => (
                        <div
                            key={crop.id}
                            onClick={() => handleClick(crop)}
                            className="group bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-green-200 cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {crop.name}
                                    </h3>
                                </div>
                                <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="h-48 bg-green-50 rounded-lg mb-4 overflow-hidden">
                                <img
                                    src={crop.image}
                                    alt={crop}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Click to view details</span>
                                <span className="text-green-600 font-medium">Learn more →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CropList;
