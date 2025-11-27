import React from 'react';
import { useNavigate } from 'react-router-dom';
import naduImg from '../../assets/nadu.jpg';

const NaduDetail = () => {
  const navigate = useNavigate();

  const handleTrackCrop = () => {
    // Navigate to crop-form with state containing the paddy type
    navigate('/crop-form', { state: { paddyType: 'Nadu' } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-800 mr-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Nadu Paddy</h1>
        </div>

        {/* Image and content grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={naduImg}
              alt="Nadu Paddy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Traditional Paddy Variety
              </h2>
              <p className="text-gray-600 mb-6">
                Nadu is a widely cultivated paddy type in Sri Lanka, especially in dry zones. It is known for its moderate growth period and high yield potential. This paddy variety is drought-tolerant, making it suitable for large-scale farming even with limited water availability.
              </p>
              <p className="text-gray-600 mb-6">
                The grains are medium in size, and the rice has a slightly firm texture when cooked, making it ideal for daily consumption. Due to its popularity, Nadu is often grown during both Yala and Maha seasons.
              </p>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Key Characteristics
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-600">
                    Medium-sized grains with slightly firm texture when cooked
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-600">
                    Excellent drought tolerance for dry zone cultivation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-600">
                    Grown in both Yala and Maha seasons
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-600">
                    Adaptable to various soil types
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleTrackCrop}
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Track This Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaduDetail;