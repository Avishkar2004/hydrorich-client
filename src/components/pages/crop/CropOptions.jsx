import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Leaf, Droplet, Calendar, Shield, ChevronRight, AlertCircle, BarChart2, Clock, Thermometer, Cloud } from 'lucide-react';

const cropDetails = {
  soybean: {
    name: 'Soybean',
    description: 'Soybean is a major source of protein and oil...',
    growingSeason: 'June to October',
    image: 'https://cdn.britannica.com/28/154828-050-05C6239A/Soybeans.jpg',
    pesticides: [
      {
        name: 'Glyphosate',
        purpose: 'Weed Control',
        application: 'Pre-emergence and post-emergence',
        dosage: '1-2 L/ha'
      },
      {
        name: 'Imidacloprid',
        purpose: 'Insect Control',
        application: 'Seed treatment',
        dosage: '5-7.5 g/kg seed'
      }
    ]
  },
  wheat: {
    name: 'Wheat',
    description: 'Wheat is a staple crop grown in rabi season...',
    growingSeason: 'November to April',
    image: 'https://www.peptechbio.com/wp-content/uploads/2023/03/Wheat_photo-cred-Adobe-stock_E-2.jpg',
    pesticides: [
      {
        name: 'Carbendazim',
        purpose: 'Fungicide',
        application: 'Foliar spray',
        dosage: '500g/ha'
      },
      {
        name: 'Malathion',
        purpose: 'Insect Control',
        application: 'Foliar spray',
        dosage: '1-1.5 L/ha'
      }
    ]
  },
  cotton: {
    name: 'Cotton',
    description: 'Cotton is a fiber crop suited to black soil...',
    growingSeason: 'April to October',
    image: 'https://ankurseeds.com/media/wp-content/uploads/2020/02/cotton-cultivation.jpg',
    pesticides: [
      {
        name: 'Bifenthrin',
        purpose: 'Insect Control',
        application: 'Foliar spray',
        dosage: '200-300 ml/ha'
      },
      {
        name: 'Pyraclostrobin',
        purpose: 'Fungicide',
        application: 'Foliar spray',
        dosage: '250-300 ml/ha'
      }
    ]
  },
  sugarcane: {
    name: 'Sugarcane',
    description: 'Sugarcane requires abundant water and long growing periods...',
    growingSeason: 'October to March',
    image: 'https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1624337170981-FP5EI0NVZLGQHUQ0S6OO/shutterstock_390975046.jpg?format=2500w',
    pesticides: [
      {
        name: 'Atrazine',
        purpose: 'Weed Control',
        application: 'Pre-emergence',
        dosage: '1-1.5 kg/ha'
      },
      {
        name: 'Chlorpyrifos',
        purpose: 'Insect Control',
        application: 'Soil application',
        dosage: '2-3 L/ha'
      }
    ]
  },
  maize: {
    name: 'Maize',
    description: 'Maize is used for food, fodder, and biofuel...',
    growingSeason: 'June to September',
    image: 'https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg',
    pesticides: [
      {
        name: 'Metolachlor',
        purpose: 'Weed Control',
        application: 'Pre-emergence',
        dosage: '1-1.5 L/ha'
      },
      {
        name: 'Lambda-cyhalothrin',
        purpose: 'Insect Control',
        application: 'Foliar spray',
        dosage: '200-250 ml/ha'
      }
    ]
  },
};


const AIPredictions = ({ cropName }) => {
  const [predictions, setPredictions] = useState({
    yield: null,
    diseases: [],
    schedule: null,
    weather: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - Replace with actual API endpoint
    const fetchPredictions = async () => {
      try {
        // This would be your actual API call
        const response = await fetch(`http://localhost:8080/api/crops/${cropName}/predictions`);
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        // Fallback data for demonstration
        setPredictions({
          yield: {
            predicted: '4.5 tons/acre',
            confidence: 85,
            factors: ['Optimal rainfall', 'Good soil quality', 'Favorable temperature']
          },
          diseases: [
            {
              name: 'Leaf Blight',
              probability: 15,
              prevention: 'Apply preventive fungicide spray'
            },
            {
              name: 'Root Rot',
              probability: 5,
              prevention: 'Ensure proper drainage'
            }
          ],
          schedule: {
            planting: '2024-06-15',
            irrigation: ['2024-06-20', '2024-07-05', '2024-07-20'],
            fertilization: ['2024-06-25', '2024-07-15'],
            harvest: '2024-09-15'
          },
          weather: {
            temperature: '28°C',
            rainfall: '75mm',
            humidity: '65%'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [cropName]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Yield Prediction */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <BarChart2 className="text-green-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">AI Yield Prediction</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Predicted Yield</span>
            <span className="text-2xl font-bold text-gray-800">{predictions.yield.predicted}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Confidence</span>
            <span className="text-2xl font-bold text-gray-800">{predictions.yield.confidence}%</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Key Factors</span>
            <ul className="text-sm text-gray-600">
              {predictions.yield.factors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disease Prediction */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <AlertCircle className="text-green-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Disease Risk Assessment</h3>
        </div>
        <div className="grid gap-4">
          {predictions.diseases.map((disease, index) => (
            <div key={index} className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">{disease.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${disease.probability > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                  {disease.probability}% Risk
                </span>
              </div>
              <p className="text-sm text-gray-600">{disease.prevention}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growing Schedule */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock className="text-green-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">AI-Generated Growing Schedule</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Planting Date</span>
            <span className="text-gray-800">{predictions.schedule.planting}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Harvest Date</span>
            <span className="text-gray-800">{predictions.schedule.harvest}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Irrigation Schedule</span>
            <ul className="text-sm text-gray-600">
              {predictions.schedule.irrigation.map((date, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {date}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="font-medium text-green-700 block mb-2">Fertilization Schedule</span>
            <ul className="text-sm text-gray-600">
              {predictions.schedule.fertilization.map((date, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Weather Conditions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Cloud className="text-green-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Current Weather Conditions</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Thermometer className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="font-medium text-green-700 block">Temperature</span>
            <span className="text-gray-800">{predictions.weather.temperature}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Droplet className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="font-medium text-green-700 block">Rainfall</span>
            <span className="text-gray-800">{predictions.weather.rainfall}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Cloud className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="font-medium text-green-700 block">Humidity</span>
            <span className="text-gray-800">{predictions.weather.humidity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const PesticideList = ({ pesticides }) => {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 rounded-lg">
          <Shield className="text-green-600 w-6 h-6" />
        </div>
        <h3 className="text-2xl font-semibold text-green-700">Recommended Pesticides</h3>
      </div>
      <div className="grid gap-6">
        {pesticides.map((pesticide, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {pesticide.name}
              </h4>
              <ChevronRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                <span className="font-medium text-green-700 block mb-2">Purpose</span>
                <span className="text-gray-600">{pesticide.purpose}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                <span className="font-medium text-green-700 block mb-2">Application</span>
                <span className="text-gray-600">{pesticide.application}</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                <span className="font-medium text-green-700 block mb-2">Dosage</span>
                <span className="text-gray-600">{pesticide.dosage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


function CropOptions() {
  const { name } = useParams();
  const crop = cropDetails[name];

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-500 text-xl font-medium">Crop not found</div>
          <p className="text-gray-500 mt-2">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow">
          <div className="relative">
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-4xl font-bold text-white mb-2">{crop.name}</h2>
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <span>Growing Season: {crop.growingSeason}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="text-green-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">About the Crop</h3>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">{crop.description}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Droplet className="text-green-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Growing Season</h3>
            </div>
            <div className="bg-green-50 p-6 rounded-xl mb-8 hover:bg-green-100 transition-colors">
              <p className="text-gray-700">
                <span className="font-medium text-green-700">Best Time to Grow:</span> {crop.growingSeason}
              </p>
            </div>

            {/* AI Predictions Section */}
            <AIPredictions cropName={name} />

            <PesticideList pesticides={crop.pesticides} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropOptions;