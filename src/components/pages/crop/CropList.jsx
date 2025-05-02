import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CropList() {
    const crops = ['Soybean', 'Wheat', 'Cotton', 'Sugarcane', 'Maize'];
    const navigate = useNavigate();

    const handleClick = (crop) => {
        navigate(`/crops/${crop.toLowerCase()}`);
    };

    return (
        <div className="px-6 md:px-12 py-10 bg-white min-h-screen">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-green-700">
                Supported Crops
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {crops.map((crop, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(crop)}
                        className="flex items-center gap-4 border border-green-200 p-6 cursor-pointer rounded-xl shadow hover:shadow-md transition bg-green-50"
                    >
                        <CheckCircle className="text-green-600" />
                        <span className="text-lg font-medium text-gray-800">{crop}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CropList;
