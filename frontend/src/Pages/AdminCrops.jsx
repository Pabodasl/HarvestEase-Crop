import React from 'react';
import CropTable from './CropTable';
import CropChart from './CropChart';

const AdminCrops = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Crops</h1>
        <p className="text-gray-600">View all crop records and analytics</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <CropTable />
      </div>

      <div className="max-w-7xl mx-auto">
        <CropChart />
      </div>
    </div>
  );
};

export default AdminCrops;


