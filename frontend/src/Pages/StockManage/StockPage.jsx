import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StockForm from './StockForm';
import StockTable from './StockTable';
import StockAnalysisChart from './StockAnalysisChart';
import QuantityPriceChart from './QuantityPriceChart';
import axios from 'axios';
import { FaChartLine, FaPlus, FaTable, FaSync, FaSeedling } from 'react-icons/fa';

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState('overview'); // Default to Stock Overview
  const [refreshing, setRefreshing] = useState(false);

  // Fetching stock data
  const fetchStocks = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('http://localhost:5000/api/get-stocks');
      setStocks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Function to switch sections
  const handleNavigation = (section) => {
    setCurrentSection(section);
  };

  // Content variants for animations
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 pt-12 pb-16 px-6 relative">
              <div className="absolute right-4 top-4 flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchStocks}
                  disabled={refreshing}
                  className="flex items-center justify-center bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-300 focus:outline-none"
                  title="Refresh Data"
                >
                  <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-4xl font-bold text-white flex items-center">
                    <FaSeedling className="mr-3" />
                    Stock Management
                  </h1>
                  <p className="mt-2 text-green-100">
                    Easily manage your inventory, track stock levels, and analyze trends
                  </p>
                </div>
                <div className="stats bg-white bg-opacity-20 p-4 rounded-lg text-white text-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat">
                      <div className="text-3xl font-bold">{stocks.length}</div>
                      <div className="text-xs opacity-75">Total Items</div>
                    </div>
                    <div className="stat">
                      <div className="text-3xl font-bold">
                        {stocks.filter(stock => stock.status === 'available').length}
                      </div>
                      <div className="text-xs opacity-75">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-white">
              <div className="absolute -top-6 left-0 right-0 flex justify-center">
                <div className="inline-flex shadow-lg rounded-full bg-white p-1">
                  <motion.button
                    whileHover={{ 
                      backgroundColor: currentSection === 'overview' ? '#15803d' : '#f0fdf4',
                      color: currentSection === 'overview' ? '#ffffff' : '#15803d'
                    }}
                    onClick={() => handleNavigation('overview')}
                    className={`flex items-center px-5 py-3 rounded-full transition-colors ${
                      currentSection === 'overview' 
                        ? 'bg-green-700 text-white' 
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <FaTable className="mr-2" />
                    Stock Overview
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      backgroundColor: currentSection === 'addStock' ? '#15803d' : '#f0fdf4',
                      color: currentSection === 'addStock' ? '#ffffff' : '#15803d'
                    }}
                    onClick={() => handleNavigation('addStock')}
                    className={`flex items-center px-5 py-3 rounded-full transition-colors ${
                      currentSection === 'addStock' 
                        ? 'bg-green-700 text-white' 
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <FaPlus className="mr-2" />
                    Add Stock
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      backgroundColor: currentSection === 'charts' ? '#15803d' : '#f0fdf4',
                      color: currentSection === 'charts' ? '#ffffff' : '#15803d' 
                    }}
                    onClick={() => handleNavigation('charts')}
                    className={`flex items-center px-5 py-3 rounded-full transition-colors ${
                      currentSection === 'charts' 
                        ? 'bg-green-700 text-white' 
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <FaChartLine className="mr-2" />
                    Analysis
                  </motion.button>
                </div>
              </div>
              <div className="h-12"></div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading stock data...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchStocks}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center"
                >
                  <FaSync className="mr-2" /> Try Again
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {currentSection === 'overview' && (
                <motion.div
                  key="overview"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <StockTable stocks={stocks} setStocks={setStocks} />
                </motion.div>
              )}
              
              {currentSection === 'addStock' && (
                <motion.div
                  key="addStock"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <StockForm setStocks={setStocks} />
                </motion.div>
              )}

              {currentSection === 'charts' && (
                <motion.div
                  key="charts"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-6">
                      Stock Analysis & Insights
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Visual representation of your stock data helps identify trends, compare varieties, and make informed decisions.
                      The charts below show quantity distributions and price comparisons.
                    </p>
                  </div>
                  
                  <StockAnalysisChart stocks={stocks} />
                  <QuantityPriceChart stocks={stocks} />
                  
                  {stocks.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                      <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No Stock Data Available</h3>
                      <p className="text-gray-500 mb-6">Add some stock items to see charts and analysis</p>
                      <button
                        onClick={() => handleNavigation('addStock')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        Add New Stock Item
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StockPage;
