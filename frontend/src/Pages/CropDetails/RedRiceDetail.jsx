import React from 'react';
import { useNavigate } from 'react-router-dom';
import redRiceImg from '../../assets/redrice.jpg';

const RedRiceDetail = () => {
  const navigate = useNavigate();

  const handleTrackCrop = () => {
    // Navigate to crop-form with state containing the paddy type
    navigate('/crop-form', { state: { paddyType: 'Red Rice' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-800 mr-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Red Rice Paddy</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img src={redRiceImg} alt="Red Rice" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Traditional Nutritious Variety</h2>
              <p className="text-gray-600 mb-6">
                Red Rice is a traditional and nutritious paddy variety, popular for its health benefits. It grows well in moderate water conditions 
                and is often cultivated using organic farming methods.
              </p>
              <p className="text-gray-600 mb-6">
                The grains have a distinct reddish-brown color and a nutty flavor, making them ideal for health-conscious meals.
                It is a resilient crop that can thrive in less fertile soils, making it valuable for sustainable agriculture.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Rich in antioxidants, fiber, and iron</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Supports digestion and heart health</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Thrives in less fertile soils</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-600">Ideal for organic farming methods</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleTrackCrop}
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Track This Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedRiceDetail;