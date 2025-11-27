import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend,
  Cell, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const COLORS = ['#1A512E', '#2E8B57', '#3CB371', '#4CAF50', '#66BB6A', '#81C784'];

const CropChart = () => {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [farmerName, setFarmerName] = useState('');

  useEffect(() => {
    fetchCrops();
    loadFarmerName();
  }, [timeRange]);

  const loadFarmerName = () => {
    try {
      // Get farmer name from stored user data
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData) {
        const user = JSON.parse(userData);
        setFarmerName(user.fullName || user.name || '');
      } else if (token) {
        // Fallback: decode from JWT token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setFarmerName(payload.fullName || payload.name || '');
        } catch (decodeError) {
          console.warn('Could not decode token:', decodeError);
        }
      }
    } catch (error) {
      console.error('Error loading farmer name:', error);
    }
  };

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Changed from scope=all to scope=my (or remove scope parameter if backend defaults to user's crops)
      const response = await axios.get(`http://localhost:5000/crops?range=${timeRange}&scope=my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCropData(response.data.crops || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching crops:', err);
      // If the backend doesn't support scope parameter, try without it
      if (err.response?.status === 400 || err.response?.status === 404) {
        try {
          const token = localStorage.getItem('token');
          const fallbackResponse = await axios.get(`http://localhost:5000/crops?range=${timeRange}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCropData(fallbackResponse.data.crops || []);
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
          setCropData([]);
        }
      } else {
        setCropData([]);
      }
      setLoading(false);
    }
  };

  const processChartData = () => {
    if (!cropData || cropData.length === 0) {
      return { landAreaData: [], cropCountData: [] };
    }

    const landAreaData = cropData.reduce((acc, crop) => {
      const existing = acc.find(item => item.paddyType === crop.paddyType);
      if (existing) {
        existing.landArea += parseFloat(crop.landArea || 0);
        existing.count += 1;
      } else {
        acc.push({ 
          paddyType: crop.paddyType, 
          landArea: parseFloat(crop.landArea || 0),
          count: 1
        });
      }
      return acc;
    }, []);

    const cropCountData = cropData.reduce((acc, crop) => {
      const existing = acc.find(item => item.paddyType === crop.paddyType);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ paddyType: crop.paddyType, count: 1 });
      }
      return acc;
    }, []);

    return { landAreaData, cropCountData };
  };

  const { landAreaData, cropCountData } = processChartData();

  const handleExport = (format) => {
    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'excel') {
      exportToExcel();
    }
  };

  const exportToCSV = () => {
    if (landAreaData.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Paddy Type,Land Area (acres),Count\n";
    
    // Add data rows
    landAreaData.forEach(item => {
      csvContent += `${item.paddyType},${item.landArea},${item.count}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `my_crop_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (landAreaData.length === 0) {
      alert('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(landAreaData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Crop Analytics");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `my_crop_analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Filter data based on time range (client-side fallback)
  const filterDataByTimeRange = (data) => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      default:
        return data;
    }
    
    return data.filter(crop => {
      const plantedDate = new Date(crop.plantedDate);
      return plantedDate >= startDate;
    });
  };

  const filteredCropData = filterDataByTimeRange(cropData);
  const { landAreaData: filteredLandAreaData, cropCountData: filteredCropCountData } = processChartData();

  return (
    <motion.div
      className="min-h-screen p-6 flex flex-col items-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dashboard Header */}
      <div className="w-full max-w-7xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Crop Analytics Dashboard</h1>
            <p className="text-gray-600">
              {farmerName ? `Viewing analytics for ${farmerName}` : 'Your personal crop analytics'}
            </p>
            <p className="text-sm text-green-600 mt-1">
              ✓ Showing only your crop records
            </p>
          </div>
          
          <div className="flex gap-3">
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
            
            <button 
              onClick={fetchCrops}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm hover:bg-gray-50 transition"
              disabled={loading}
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="relative group">
              <button 
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm hover:bg-gray-50 transition"
                disabled={landAreaData.length === 0}
              >
                <FiDownload size={16} />
                Export
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <button 
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400"
                  disabled={landAreaData.length === 0}
                >
                  Export as CSV
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:text-gray-400"
                  disabled={landAreaData.length === 0}
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">My Crop Types</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {filteredLandAreaData.length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">My Total Land Area</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {filteredLandAreaData.reduce((sum, item) => sum + item.landArea, 0).toFixed(2)} acres
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">My Crops Tracked</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {filteredCropData.length}
          </p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full max-w-7xl space-y-8">
        {/* Bar Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Land Area Distribution</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('csv')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                disabled={landAreaData.length === 0}
              >
                <FiDownload size={14} />
                CSV
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                disabled={landAreaData.length === 0}
              >
                <FiDownload size={14} />
                Excel
              </button>
            </div>
          </div>
          
          <div className="h-96">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading your data...</div>
              </div>
            ) : filteredLandAreaData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400">No crop data found for your account</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredLandAreaData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="paddyType"
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Area (acres)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fontSize: 12 
                    }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${value} acres`, 'Land Area']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="landArea" 
                    name="My Land Area (acres)"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList 
                      dataKey="landArea" 
                      position="top" 
                      formatter={(value) => `${value} ac`}
                    />
                    {filteredLandAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Crop Type Distribution</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExport('csv')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                disabled={landAreaData.length === 0}
              >
                <FiDownload size={14} />
                CSV
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                disabled={landAreaData.length === 0}
              >
                <FiDownload size={14} />
                Excel
              </button>
            </div>
          </div>
          
          <div className="h-96">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading your data...</div>
              </div>
            ) : filteredCropCountData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-gray-400">No crop data found for your account</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredCropCountData}
                    dataKey="count"
                    nameKey="paddyType"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {filteredCropCountData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} crops (${(props.payload.percent * 100).toFixed(1)}%)`,
                      props.payload.payload.paddyType
                    ]}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CropChart;