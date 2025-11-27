import React, { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaUpload, FaLeaf, FaVirus, FaCloudSun, FaMedkit, FaSeedling } from 'react-icons/fa';
import DiseasesOverlay from './DiseasesOverlay';
import axios from 'axios';
import paddyBg from '../assets/paddy.jpg';

function DiseaseUser() {
  const [searchData, setSearchData] = useState({
    affectedParts: '',
    symptoms: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('DiseaseUser component mounted');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Searching with data:', searchData);
      const response = await axios.post('http://localhost:5000/api/diseases/search', searchData);
      console.log('Search response:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching diseases:', error);
      alert('Error searching for diseases. Please try again.');
    }
    setLoading(false);
  };

  const handleImageUpload = () => {
    console.log('Opening overlay');
    setShowOverlay(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 relative">
      {/* Background Image with increased opacity (20%) */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center opacity-20"
        style={{ 
          backgroundImage: `url(${paddyBg})`,
          backgroundSize: 'cover',
        }}
      ></div>

      {/* Knowledge Hub Button */}
      <button title="Knowledge Hub" 
        className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 flex items-center justify-center"
        onClick={() => window.location.href = '/knowledge-hub'}
      >
        <FaBook size={24} />
      </button>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Plant Disease Detection</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Identify plant diseases by searching symptoms or uploading photos of affected plants</p>
        </div>

        {/* Search Form with improved styling */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white backdrop-blur-md bg-opacity-95 rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaSearch className="mr-2 text-green-600" /> Search Disease by Symptoms
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affected Parts
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLeaf className="text-green-500" />
                    </div>
                    <input
                      type="text"
                      name="affectedParts"
                      value={searchData.affectedParts}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Leaves, stems, roots..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVirus className="text-green-500" />
                    </div>
                    <input
                      type="text"
                      name="symptoms"
                      value={searchData.symptoms}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Wilting, spots, discoloration..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaSearch /> Search Diseases
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaUpload /> Upload Plant Image
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State with better animation */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <p className="mt-4 text-gray-600">Analyzing plant diseases...</p>
          </div>
        )}

        {/* Search Results with improved card design */}
        {searchResults.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-green-800 border-b border-green-100 pb-2">Disease Analysis Results</h2>
            <div className="grid gap-8">
              {searchResults.map((disease, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    {disease.imageUrl && (
                      <div className="md:w-2/5 h-[300px]">
                        <img 
                          src={`http://localhost:5000${disease.imageUrl}`} 
                          alt={disease.diseaseName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className={`p-6 ${disease.imageUrl ? 'md:w-3/5' : 'w-full'}`}>
                      <h3 className="text-2xl font-bold text-green-800 mb-4">{disease.diseaseName}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <FaLeaf className="text-green-500 mt-1 mr-3" size={18} />
                          <div>
                            <h4 className="font-semibold text-gray-700">Affected Parts:</h4>
                            <p className="text-gray-600">{disease.affectedParts.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaVirus className="text-red-500 mt-1 mr-3" size={18} />
                          <div>
                            <h4 className="font-semibold text-gray-700">Symptoms:</h4>
                            <p className="text-gray-600">{disease.symptoms.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaCloudSun className="text-amber-500 mt-1 mr-3" size={18} />
                          <div>
                            <h4 className="font-semibold text-gray-700">Favorable Conditions:</h4>
                            <p className="text-gray-600">{disease.favorableConditions.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaMedkit className="text-blue-500 mt-1 mr-3" size={18} />
                          <div>
                            <h4 className="font-semibold text-gray-700">Treatments:</h4>
                            <p className="text-gray-600">{disease.treatments.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FaSeedling className="text-emerald-500 mt-1 mr-3" size={18} />
                          <div>
                            <h4 className="font-semibold text-gray-700">Next Season Management:</h4>
                            <p className="text-gray-600">{disease.nextSeasonManagement.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state when no results but search performed */}
        {!loading && searchResults.length === 0 && (searchData.affectedParts || searchData.symptoms) && (
          <div className="text-center py-8 max-w-lg mx-auto">
            <div className="bg-white rounded-lg p-8 shadow">
              <FaSearch className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No diseases found</h3>
              <p className="text-gray-500">Try adjusting your search terms or upload an image for more accurate detection.</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showOverlay && (
        <DiseasesOverlay onClose={() => setShowOverlay(false)} />
      )}
    </div>
  );
}

export default DiseaseUser;
