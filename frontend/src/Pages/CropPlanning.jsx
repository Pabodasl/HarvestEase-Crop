import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa'; // Icon for View More

// ✅ Image Imports
import naduImg from '../assets/nadu.jpg';
import sambaImg from '../assets/samba.jpg';
import redRiceImg from '../assets/redrice.jpg';
import bg352Img from '../assets/bg352.jpg';
import suwandelImg from '../assets/suwandel.jpg';
import pachchaImg from '../assets/pachcha.jpg';

const CropPlanning = () => {
  const navigate = useNavigate();

  const crops = [
    { name: 'Nadu', description: 'Popular for dry zones, moderate growth, high yield.', image: naduImg },
    { name: 'Samba', description: 'Fragrant, fine grain, needs longer growth period.', image: sambaImg },
    { name: 'Red Rice', description: 'Nutritious, traditional variety, low water needs.', image: redRiceImg },
    { name: 'Bg 352', description: 'High yield hybrid, short-term cultivation.', image: bg352Img },
    { name: 'Suwandel', description: 'Aromatic, organic-friendly, premium quality.', image: suwandelImg },
    { name: 'Pachchaperumal', description: 'Traditional red rice, rich in fiber and nutrients.', image: pachchaImg },
  ];

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const cropsPerPage = 3;

  // ✅ Pagination Logic
  const totalPages = Math.ceil(crops.length / cropsPerPage);
  const indexOfLastCrop = currentPage * cropsPerPage;
  const indexOfFirstCrop = indexOfLastCrop - cropsPerPage;
  const currentCrops = crops.slice(indexOfFirstCrop, indexOfLastCrop);

  const getCropRoute = (name) => {
    switch (name.toLowerCase()) {
      case 'nadu': return '/crop-detail/nadu';
      case 'samba': return '/crop-detail/samba';
      case 'red rice': return '/crop-detail/redrice';
      case 'bg 352': return '/crop-detail/bg352';
      case 'suwandel': return '/crop-detail/suwandel';
      case 'pachchaperumal': return '/crop-detail/pachchaperumal';
      default: return '/crop-planning';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-2 text-[#1A512E]">
        Crop Tracking
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Select a paddy type to track growth and plan your harvest.
      </p>

      {/* 📦 Crop Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {currentCrops.map((crop, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow rounded-lg overflow-hidden transition duration-200"
          >
            <div className="w-full h-56 overflow-hidden">
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-[#1A512E]">{crop.name}</h2>
              <p className="text-gray-600 mt-2">{crop.description}</p>

              {/* ✅ View More Button */}
              <button
                onClick={() => navigate(getCropRoute(crop.name))}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition flex items-center mx-auto"
              >
                <FaLeaf className="mr-2" /> View More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-700 text-white' : 'bg-white border border-green-700 text-green-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropPlanning;
