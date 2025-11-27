import React from 'react';
import { useNavigate } from 'react-router-dom';
import sharedBg from '../assets/shared_bg.png';

const CostTrackingDetail = () => {
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
          <h1 className="text-3xl font-bold text-green-700 mb-4">Cost & Financial Management</h1>
          <p className="text-gray-700 mb-4">
          The Cost & Financial Management function streamlines the entire process of selling and transporting harvested crops. It enables farmers to set the prices for their produce, manage sales records, and connect directly with potential buyers. Through this system, farmers can easily list available crops for sale, and buyers can browse and place orders, ensuring smoother transactions. It also allows farmers to track each order, from confirmation to delivery, helping ensure timely and efficient distribution. Additionally, the system includes a financial management component that records expenses and calculates profits automatically by comparing total income with total costs. Farmers can generate detailed sales reports and view profit breakdowns based on crop type or specific time periods. The system also provides valuable financial insights, suggesting cost-saving opportunities and highlighting areas with high expenses. Overall, this function empowers farmers to optimize their revenue, make data-driven decisions, and improve the overall efficiency of their distribution process.
          </p>
          <p className="text-gray-600 italic">Run your farm like a business </p>

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

export default CostTrackingDetail;
