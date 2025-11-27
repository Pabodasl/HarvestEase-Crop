import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { motion } from 'framer-motion';
import { FaChartBar, FaRupeeSign } from 'react-icons/fa';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const QuantityPriceChart = ({ stocks }) => {
  // Filter stocks by crop type
  const riceStocks = useMemo(() => stocks.filter(stock => stock.cropType === 'rice'), [stocks]);
  const paddyStocks = useMemo(() => stocks.filter(stock => stock.cropType === 'paddy'), [stocks]);

  // Create chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          font: {
            size: 13,
          },
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: (context) => `Price: Rs. ${context.parsed.y} per kg`,
          afterLabel: (context) => {
            const stockIndex = context.dataIndex;
            const cropType = context.dataset.label.includes('Rice') ? 'rice' : 'paddy';
            const stockData = cropType === 'rice' ? riceStocks[stockIndex] : paddyStocks[stockIndex];
            return `Quantity: ${stockData?.quantity} ${stockData?.quantityUnit || ''}`;
          },
        },
        displayColors: true,
        titleAlign: 'center',
        bodyAlign: 'center',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#555',
          callback: function(value) {
            return 'Rs. ' + value;
          }
        },
        title: {
          display: true,
          text: 'Price (Rs. per kg)',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#555',
        },
      },
    },
  };

  // Create chart data with pattern fills and styling
  const createChartData = (data, colors, title) => {
    // Define gradient background colors for each bar
    const backgroundColors = data.map((_, index) => {
      const colorIndex = index % colors.length;
      return colors[colorIndex];
    });

    // Define border colors for each bar (slightly darker than backgrounds)
    const borderColors = backgroundColors.map(color => 
      color.replace('0.7', '1')
    );

    return {
      labels: data.map(stock => stock.variety),
      datasets: [
        {
          label: title,
          data: data.map(stock => stock.price),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 6,
          hoverBorderWidth: 3,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    };
  };

  // Rich colored palettes
  const riceColors = [
    'rgba(66, 133, 244, 0.7)',   // Blue
    'rgba(219, 68, 55, 0.7)',    // Red
    'rgba(244, 180, 0, 0.7)',    // Yellow
    'rgba(15, 157, 88, 0.7)',    // Green
    'rgba(171, 71, 188, 0.7)',   // Purple
    'rgba(255, 112, 67, 0.7)',   // Orange
  ];

  const paddyColors = [
    'rgba(76, 175, 80, 0.7)',    // Green
    'rgba(255, 193, 7, 0.7)',    // Amber
    'rgba(0, 150, 136, 0.7)',    // Teal
    'rgba(139, 195, 74, 0.7)',   // Light Green
    'rgba(205, 220, 57, 0.7)',   // Lime
    'rgba(121, 85, 72, 0.7)',    // Brown
  ];

  // Empty state component
  const EmptyState = ({ cropType }) => (
    <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-gray-200">
      <FaChartBar className="text-4xl text-gray-400 mb-3" />
      <p className="text-gray-500 text-center">No {cropType} price data available</p>
      <p className="text-gray-400 text-sm mt-1">Add some {cropType} stocks to view analysis</p>
    </div>
  );

  return (
    <motion.div 
      className="mb-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <FaRupeeSign className="mr-2 text-amber-600" /> Price Analysis
        </h2>
        
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Rice chart */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 flex items-center">
                <FaChartBar className="mr-2" /> Rice Price Analysis
              </h3>
              {riceStocks.length > 0 ? (
                <p className="text-indigo-600 text-sm">
                  Average price: Rs. {(riceStocks.reduce((sum, stock) => sum + parseFloat(stock.price), 0) / riceStocks.length).toFixed(2)} per kg | 
                  Highest: Rs. {Math.max(...riceStocks.map(s => parseFloat(s.price))).toFixed(2)} per kg
                </p>
              ) : (
                <p className="text-indigo-600 text-sm">No rice stocks</p>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '320px' }}>
              {riceStocks.length > 0 ? (
                <Bar 
                  data={createChartData(riceStocks, riceColors, 'Rice Price (Rs)')} 
                  options={options} 
                />
              ) : (
                <EmptyState cropType="rice" />
              )}
            </div>
          </motion.div>

          {/* Paddy chart */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2 text-green-700 flex items-center">
                <FaChartBar className="mr-2" /> Paddy Price Analysis
              </h3>
              {paddyStocks.length > 0 ? (
                <p className="text-green-600 text-sm">
                  Average price: Rs. {(paddyStocks.reduce((sum, stock) => sum + parseFloat(stock.price), 0) / paddyStocks.length).toFixed(2)} per kg | 
                  Highest: Rs. {Math.max(...paddyStocks.map(s => parseFloat(s.price))).toFixed(2)} per kg
                </p>
              ) : (
                <p className="text-green-600 text-sm">No paddy stocks</p>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '320px' }}>
              {paddyStocks.length > 0 ? (
                <Bar 
                  data={createChartData(paddyStocks, paddyColors, 'Paddy Price (Rs)')} 
                  options={options}
                />
              ) : (
                <EmptyState cropType="paddy" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantityPriceChart;
