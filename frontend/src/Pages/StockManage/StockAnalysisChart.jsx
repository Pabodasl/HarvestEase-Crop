import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';
import { FaSeedling, FaLeaf } from 'react-icons/fa';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const StockAnalysisChart = ({ stocks }) => {
  // Filter stocks by crop type (Rice and Paddy)
  const riceStocks = useMemo(() => stocks.filter(stock => stock.cropType === 'rice'), [stocks]);
  const paddyStocks = useMemo(() => stocks.filter(stock => stock.cropType === 'paddy'), [stocks]);

  // Create chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.7,
        to: 0.2,
        loop: false
      }
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
        },
        title: {
          display: true,
          text: 'Quantity',
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
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          font: {
            size: 13,
          },
          usePointStyle: true,
          pointStyle: 'circle',
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
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context) => `Quantity: ${context.parsed.y} ${context.dataset.unit || ''}`,
        },
      },
    },
  };

  // Create chart data with gradient and styling
  const createChartData = (data, color, title) => ({
    labels: data.map(stock => stock.variety),
    datasets: [
      {
        label: title,
        data: data.map(stock => stock.quantity),
        borderColor: color,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }
          
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, color.replace('rgb', 'rgba').replace(')', ', 0.15)'));
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.2,
        fill: true,
        unit: data.length > 0 ? data[0].quantityUnit : '',
      },
    ],
  });

  // Empty state component
  const EmptyState = ({ cropType }) => (
    <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-gray-200">
      {cropType === 'rice' ? <FaSeedling className="text-4xl text-gray-400 mb-3" /> : <FaLeaf className="text-4xl text-gray-400 mb-3" />}
      <p className="text-gray-500 text-center">No {cropType} stock data available</p>
      <p className="text-gray-400 text-sm mt-1">Add some {cropType} stocks to view analysis</p>
    </div>
  );

  return (
    <motion.div 
      className="mb-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Stock Quantity Analysis</h2>
        
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Rice chart */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                <FaSeedling className="mr-2" /> Rice Stock
              </h3>
              {riceStocks.length > 0 ? (
                <p className="text-blue-600 text-sm">
                  Total varieties: {riceStocks.length} | 
                  Total quantity: {riceStocks.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0).toLocaleString()} {riceStocks[0]?.quantityUnit || 'units'}
                </p>
              ) : (
                <p className="text-blue-600 text-sm">No rice stocks</p>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '320px' }}>
              {riceStocks.length > 0 ? (
                <Line 
                  data={createChartData(riceStocks, 'rgb(59, 130, 246)', 'Rice Quantity')} 
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2 text-green-700 flex items-center">
                <FaLeaf className="mr-2" /> Paddy Stock
              </h3>
              {paddyStocks.length > 0 ? (
                <p className="text-green-600 text-sm">
                  Total varieties: {paddyStocks.length} | 
                  Total quantity: {paddyStocks.reduce((sum, stock) => sum + parseFloat(stock.quantity), 0).toLocaleString()} {paddyStocks[0]?.quantityUnit || 'units'}
                </p>
              ) : (
                <p className="text-green-600 text-sm">No paddy stocks</p>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '320px' }}>
              {paddyStocks.length > 0 ? (
                <Line 
                  data={createChartData(paddyStocks, 'rgb(16, 185, 129)', 'Paddy Quantity')} 
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

export default StockAnalysisChart;
