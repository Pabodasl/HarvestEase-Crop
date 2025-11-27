import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  FaEdit, 
  FaTrashAlt, 
  FaFilePdf, 
  FaSearch, 
  FaPlusCircle,
  FaChartBar,
  FaDownload
} from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';

const CropTable = () => {
  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/crops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCrops(response.data.crops);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to fetch crops');
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(
    (crop) =>
      crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.paddyType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this crop record?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/crops/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Crop deleted successfully!');
      fetchCrops();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete crop');
    }
  };

  const generateSinglePDF = (crop) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(34, 102, 34);
    doc.setFont('helvetica', 'bold');
    doc.text('CROP TRACKING REPORT', 105, 20, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(34, 102, 34);
    doc.line(20, 25, 190, 25);
    
    // Report details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Tracking ID: ${crop._id}`, 20, 42);
    
    // Farmer Information
    doc.setFontSize(14);
    doc.setTextColor(34, 102, 34);
    doc.text('Farmer Information', 20, 55);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${crop.farmerName}`, 20, 65);
    doc.text(`Contact: ${crop.phoneNumber}`, 20, 72);
    
    // Crop Details
    doc.setFontSize(14);
    doc.setTextColor(34, 102, 34);
    doc.text('Crop Details', 20, 85);
    
    const cropData = [
      ['Paddy Type', crop.paddyType],
      ['Land Area', `${crop.landArea} hectares`],
      ['Planted Date', crop.plantedDate],
      ['Fertilization Date', crop.fertilizationDate],
      ['Harvest Date', crop.harvestDate]
    ];
    
    doc.autoTable({
      startY: 90,
      head: [['Field', 'Value']],
      body: cropData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 102, 34],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 90 }
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('© 2023 HarvestEase - All Rights Reserved', 105, 285, { align: 'center' });
    
    const fileName = `Crop_Report_${crop.farmerName?.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const generateBulkPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(34, 102, 34);
    doc.setFont('helvetica', 'bold');
    doc.text('CROP TRACKING SUMMARY REPORT', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
    
    // Table data
    const tableData = filteredCrops.map(crop => [
      crop.farmerName,
      crop.paddyType,
      crop.plantedDate,
      `${crop.landArea} ha`,
      crop.fertilizationDate,
      crop.harvestDate
    ]);
    
    doc.autoTable({
      startY: 40,
      head: [['Farmer', 'Paddy Type', 'Planted', 'Area', 'Fertilize', 'Harvest']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 102, 34],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40 }
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Records: ${filteredCrops.length}`, 20, doc.lastAutoTable.finalY + 10);
    doc.text('© 2023 HarvestEase - All Rights Reserved', 105, 285, { align: 'center' });
    
    doc.save('Crop_Tracking_Summary.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <motion.div
        className="min-h-screen p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">HarvestEase Crop Tracking</h1>
              <p className="text-gray-600">Manage and track all your agricultural operations</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/crop-form')}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
              >
                <FaPlusCircle /> Add New Crop
              </button>
              
              <Link to="/crop-chart">
                <button className="flex items-center gap-2 bg-white border border-green-700 text-green-700 hover:bg-green-50 font-medium px-4 py-2 rounded-lg shadow-sm transition">
                  <FaChartBar /> View Analytics
                </button>
              </Link>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search farmer or paddy type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={fetchCrops}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg shadow-sm transition"
                >
                  <MdRefresh className={`${loading ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={generateBulkPDF}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg shadow-sm transition"
                  disabled={filteredCrops.length === 0}
                >
                  <FaDownload /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {loading ? (
              <div className="p-8 flex justify-center items-center">
                <div className="animate-pulse text-gray-500">Loading crop data...</div>
              </div>
            ) : filteredCrops.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No crop records found. {searchTerm && 'Try a different search term.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paddy Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Planted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area (ha)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fertilize
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harvest
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCrops.map((crop) => (
                      <tr key={crop._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{crop.farmerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {crop.paddyType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {crop.plantedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {crop.landArea}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {crop.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {crop.fertilizationDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {crop.harvestDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link to={`/crop-update/${crop._id}`}>
                              <button
                                title="Edit"
                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition"
                              >
                                <FaEdit />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(crop._id)}
                              title="Delete"
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                            >
                              <FaTrashAlt />
                            </button>
                            <button
                              onClick={() => generateSinglePDF(crop)}
                              title="Download PDF"
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition"
                            >
                              <FaFilePdf />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status Bar */}
          {!loading && filteredCrops.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing {filteredCrops.length} of {crops.length} records
            </div>
          )}
        </div>

        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </motion.div>
    </div>
  );
};

export default CropTable;