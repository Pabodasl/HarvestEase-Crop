import React from 'react';
import { useNavigate } from 'react-router-dom';
import sharedBg from '../assets/shared_bg.png';

const HarvestStockDetail = () => {
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
          <h1 className="text-3xl font-bold text-green-700 mb-4"> Harvest Stock Management</h1>
          <p className="text-gray-700 mb-4">
          The Harvest Stock Management function is designed to help farmers keep accurate records of their harvested crops and ensure proper post-harvest handling. Once the crops are harvested, farmers can log details such as crop type, quantity, and storage conditions (like temperature and humidity). This data helps monitor the environment in which the crops are stored, minimizing the risk of spoilage. The system also sends automated alerts when stock levels are low or if environmental conditions could lead to potential crop damage. These alerts enable farmers to take preventive actions early and avoid significant losses. Additionally, this module supports full inventory control with features to add, update, and delete stock entries. Farmers can generate inventory reports and analyze trends over time using charts and visual data. This leads to more informed decisions regarding storage and sales. By maintaining a well-organized digital inventory, farmers can ensure better storage efficiency, reduce wastage, and maintain the overall quality of their produce.

          </p>
          <p className="text-gray-600 italic">Protect your harvest with digital eyes </p>

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

export default HarvestStockDetail;