import React from 'react';
import { useNavigate } from 'react-router-dom';
import sharedBg from '../assets/shared_bg.png'; // ✅ Make sure this image exists

const CropTrackingDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-green-50 flex justify-center items-center">
      <div className="relative bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full overflow-hidden">

        {/* ✅ Background Image inside card */}
        <img
          src={sharedBg}
          alt="Background"
          className="absolute inset-0 w-full h-full object-contain opacity-10 z-0"
        />

        {/* ✅ Foreground Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Crop Tracking</h1>
          <p className="text-gray-700 mb-4">
            The Crop Tracking function plays a crucial role in helping farmers organize and manage their entire cultivation
            process from start to finish. It allows farmers to input key details such as the paddy variety, planting date,
            land size, and contact number. Based on this data, the system automatically calculates important agricultural
            timelines like fertilization dates and harvesting schedules, which are essential for optimizing yield. The system
            also sends timely SMS reminders to the farmer, ensuring that they never miss critical farming activities.
          </p>

          <p className="text-gray-700 mb-4">
            In addition to scheduling, this module provides a complete overview of the crop’s growth stages and progress.
            Farmers can generate detailed PDF or Excel reports on their crop status, which is useful for documentation and
            planning future harvests. With built-in features like CRUD operations (Create, Read, Update, Delete) and powerful
            search functionality, farmers can efficiently manage and retrieve their crop records. This function ultimately
            reduces manual workload, improves decision-making, and helps ensure better productivity and resource use.
          </p>

          <p className="text-gray-600 italic mt-2">Plan smart, grow better. </p>

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

export default CropTrackingDetail;
