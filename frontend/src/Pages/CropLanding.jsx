import React from 'react';
import { Link } from 'react-router-dom';
import paddyField from '../assets/paddy_field.jpg';
import { FaCalendarAlt, FaFileAlt, FaChartLine, FaSeedling } from 'react-icons/fa';

const CropLanding = () => {
  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <div 
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${paddyField})`,
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="text-center px-4 z-10 max-w-3xl">
          <div className="bg-green-600 bg-opacity-80 text-white px-4 py-2 rounded-full text-sm inline-block mb-4">
            Precision Agriculture Solution
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Optimize Your Paddy Harvests
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8">
            Intelligent crop tracking that calculates harvest dates, fertilization schedules, 
            and provides actionable insights
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/crop-planning">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 duration-200">
                Start Tracking Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How HarvestEase Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get accurate harvest predictions and crop management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <span className="text-green-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Input Crop Details</h3>
              <p className="text-gray-600 text-center">
                Enter your paddy variety, planting date, and field conditions
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Automated Calculations</h3>
              <p className="text-gray-600 text-center">
                Our system calculates optimal harvest date and fertilization schedule
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Track & Analyze</h3>
              <p className="text-gray-600 text-center">
                Monitor progress and generate reports for better decision making
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-20 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful paddy cultivation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-start">
                <div className="bg-green-100 p-4 rounded-full mr-6">
                  <FaCalendarAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Precision Scheduling</h3>
                  <p className="text-gray-600">
                    Get accurate harvest dates and fertilization schedules tailored to your specific paddy variety and local conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-start">
                <div className="bg-blue-100 p-4 rounded-full mr-6">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Crop Analytics</h3>
                  <p className="text-gray-600">
                    Visual dashboards showing growth patterns, yield predictions, and historical performance comparisons.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-start">
                <div className="bg-purple-100 p-4 rounded-full mr-6">
                  <FaFileAlt className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">PDF Reports</h3>
                  <p className="text-gray-600">
                    Generate comprehensive reports for record keeping, loan applications, or sharing with agronomists.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-4 rounded-full mr-6">
                  <FaSeedling className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Variety-Specific Advice</h3>
                  <p className="text-gray-600">
                    Custom recommendations based on your chosen paddy variety and growth stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Benefits Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Farmer Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How HarvestEase helps you achieve better results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Maximize Yields</h3>
              <p className="text-gray-600">
                Time your harvest perfectly to get the highest quality grains with maximum yield potential.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Reduce Costs</h3>
              <p className="text-gray-600">
                Optimize fertilizer application to reduce waste while maintaining crop health.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data-Driven Decisions</h3>
              <p className="text-gray-600">
                Make informed choices based on historical data and predictive analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Paddy Farming?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who are getting better harvests with precise tracking
          </p>
          <Link to="/crop-planning">
            <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all text-lg shadow-lg transform hover:scale-105 duration-200">
              Get Started - It's Free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CropLanding;