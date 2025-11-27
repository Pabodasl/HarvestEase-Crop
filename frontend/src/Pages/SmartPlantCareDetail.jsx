import React from 'react';
import { useNavigate } from 'react-router-dom';
import sharedBg from '../assets/shared_bg.png';

const SmartPlantCareDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-green-50 flex justify-center items-center">
      <div className="relative bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full overflow-hidden">
        <img
          src={sharedBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-contain opacity-10 z-0"
        />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-green-700 mb-4"> Smart Plant Care</h1>
          <p className="text-gray-700 mb-4">
          The Smart Plant Care feature is a smart support system that helps farmers quickly identify and treat diseases affecting their crops. By allowing farmers to input symptoms such as leaf color, plant age, and other visible signs, the system uses a rule-based diagnosis engine to detect potential diseases. If a match is found, it retrieves accurate disease details from its database or external APIs, including causes, symptoms, and how the disease spreads. Once a disease is identified, the system provides clear and categorized treatment solutions — organic, chemical, or preventive — along with application guidelines and safety precautions. Farmers can also use search and filter options to explore treatment plans based on their preferences. Additionally, the Knowledge Hub acts as a community platform where farmers can share real-life cases with images and descriptions, helping others recognize and manage similar issues. This feature not only improves crop health and minimizes losses but also promotes knowledge sharing and awareness among farming communities.

          </p>
          <p className="text-gray-600 italic">Healthy plants = higher harvests </p>

          <button
            onClick={() => navigate('/services')}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            ← Back to Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartPlantCareDetail;
