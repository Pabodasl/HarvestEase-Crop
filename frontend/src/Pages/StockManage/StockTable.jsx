import React, { useState } from 'react';
import StockModal from './StockModal';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion'; // Install using: npm install framer-motion
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilePdf, FaFilter, FaSortAmountDown } from 'react-icons/fa'; // Install using: npm install react-icons

const addHeader = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(26, 81, 46); // Dark green color
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo placeholder (you could replace this with an actual image)
  doc.setFillColor(245, 197, 66); // Yellow color for logo
  doc.circle(20, 17, 8, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.circle(20, 17, 8, 'S');
  
  // Logo text (could be replaced with image.addImage() to add actual logo)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("HE", 20, 20, { align: 'center' });
  
  // Company & document name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("HarvestEase", 35, 17);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Stock Inventory Report", 35, 25);
  
  // Document date - right aligned
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 220);
  doc.text(`Generated: ${today}`, pageWidth - 15, 20, { align: 'right' });
};

const addFooter = (doc, pageNumber, totalPages) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
  
  // Footer text
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("HarvestEase Farm Management System", 15, pageHeight - 15);
  doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, pageHeight - 15, { align: 'right' });
};

const StockTable = ({ stocks, setStocks }) => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('farmerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [cropTypeFilter, setCropTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const initiateDelete = (id) => {
    setDeleteConfirmation({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/delete-stock/${deleteConfirmation.id}`);

      if (response.status === 200) {
        const updatedStocks = await axios.get('http://localhost:5000/api/get-stocks');
        setStocks(updatedStocks.data);
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
    } finally {
      setIsLoading(false);
      setDeleteConfirmation({ show: false, id: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, id: null });
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (stock) => {
    setSelectedStock(stock);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleStockUpdate = async (updatedStock) => {
    try {
      // Start loading state
      setIsLoading(true);
      
      console.log("Sending update request with data:", updatedStock);
      
      // Make API call to update the stock
      const response = await axios.put(
        `http://localhost:5000/api/update-stock/${updatedStock._id}`, 
        updatedStock
      );
      
      if (response.status === 200) {
        // Refresh stocks after successful update
        const refreshResponse = await axios.get('http://localhost:5000/api/get-stocks');
        setStocks(refreshResponse.data);
        
        // Show success notification if you have one
        // setNotification({ type: 'success', message: 'Stock updated successfully' });
        
        // Close the modal
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      // Show error notification if you have one
      // setNotification({ type: 'error', message: 'Failed to update stock' });
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedStocks = () => {
    let result = stocks.filter((stock) => {
      const matchesSearch = 
        stock.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.quantity.toString().includes(searchQuery) ||
        stock.price.toString().includes(searchQuery);
      
      const matchesCropType = cropTypeFilter === 'all' || stock.cropType === cropTypeFilter;
      
      return matchesSearch && matchesCropType;
    });

    result.sort((a, b) => {
      if (['quantity', 'price'].includes(sortField)) {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      }
      
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });

    return result;
  };

  const filteredStocks = getFilteredAndSortedStocks();

  // Enhanced generatePDF function with professional header, footer and modern design

  const generatePDF = () => {
    setIsLoading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Use the extracted functions
      addHeader(doc);
      
      // Function to create table header
      const addTableHeader = (doc, yPosition) => {
        // Table header background
        doc.setFillColor(240, 246, 240);
        doc.rect(15, yPosition - 5, pageWidth - 30, 10, 'F');
        
        // Table header border
        doc.setDrawColor(26, 81, 46);
        doc.setLineWidth(0.1);
        doc.rect(15, yPosition - 5, pageWidth - 30, 10, 'S');
        
        // Table headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(26, 81, 46);
        
        doc.text("Farmer Name", 20, yPosition);
        doc.text("Crop Type", 75, yPosition);
        doc.text("Variety", 115, yPosition);
        doc.text("Quantity", 155, yPosition);
        doc.text("Price (Rs)", 182, yPosition);
      };
      
      // Add summary section
      const addSummary = (doc, filteredStocks) => {
        const yPos = 60;
        
        // Calculate summary statistics
        const totalItems = filteredStocks.length;
        const totalQuantity = filteredStocks.reduce((sum, stock) => sum + stock.quantity, 0);
        const totalValue = filteredStocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
        const uniqueFarmers = new Set(filteredStocks.map(stock => stock.farmerName)).size;
        const uniqueVarieties = new Set(filteredStocks.map(stock => stock.variety)).size;
        
        // Summary box
        doc.setFillColor(247, 250, 247);
        doc.setDrawColor(26, 81, 46);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, yPos - 10, pageWidth - 30, 30, 3, 3, 'FD');
        
        // Summary title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(26, 81, 46);
        doc.text("Inventory Summary", 20, yPos);
        
        // Summary items
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        
        doc.text(`Total Items: ${totalItems}`, 20, yPos + 10);
        doc.text(`Total Quantity: ${totalQuantity} units`, 80, yPos + 10);
        doc.text(`Total Value: Rs. ${totalValue.toLocaleString()}`, 150, yPos + 10);
        doc.text(`Unique Farmers: ${uniqueFarmers}`, 20, yPos + 18);
        doc.text(`Unique Varieties: ${uniqueVarieties}`, 80, yPos + 18);
      };
      
      // First page setup
      addSummary(doc, filteredStocks);
      
      // Table starting position
      let yPosition = 100;
      let currentPage = 1;
      
      // Add initial table header
      addTableHeader(doc, yPosition);
      yPosition += 10;
      
      // Set table content style
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      // Process each stock entry
      filteredStocks.forEach((stock, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 35) {
          // Add footer to current page
          addFooter(doc, currentPage, Math.ceil(filteredStocks.length / 25) + 1); // +1 for first page with summary
          
          // Add new page
          doc.addPage();
          currentPage++;
          
          // Add header and table header to new page
          addHeader(doc);
          yPosition = 50; // Reset position
          addTableHeader(doc, yPosition);
          yPosition += 10;
        }
        
        // Alternating row colors
        if (index % 2 === 1) {
          doc.setFillColor(247, 250, 247);
          doc.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
        }
        
        // Add table row data
        doc.text(stock.farmerName.substring(0, 22), 20, yPosition);
        doc.text(stock.cropType, 75, yPosition);
        doc.text(stock.variety.substring(0, 15), 115, yPosition);
        doc.text(`${stock.quantity} ${stock.quantityUnit}`, 155, yPosition);
        doc.text(`${stock.price.toLocaleString()}`, 182, yPosition);
        
        // Draw bottom border for the row
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.1);
        doc.line(15, yPosition + 3, pageWidth - 15, yPosition + 3);
        
        yPosition += 8;
      });
      
      // Add footer to the last page
      addFooter(doc, currentPage, Math.ceil(filteredStocks.length / 25) + 1);
      
      // Save the PDF
      doc.save(`HarvestEase-Stock-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsLoading(false);
      // You could add a notification here about the error
    }
  };

  // Add a function to generate PDF for a single stock item

  // Add this new function for single stock PDF generation
  const generateSingleStockPDF = (stock) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add header (reuse the function from full PDF)
      addHeader(doc);
      
      // Create a single stock detail card
      const yPos = 50;
      
      // Detail card title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(26, 81, 46);
      doc.text("Stock Item Details", pageWidth / 2, yPos, { align: "center" });
      
      // Create stock details card with gradient background
      doc.setFillColor(247, 250, 247); // Light green background
      doc.setDrawColor(26, 81, 46); // Dark green border
      doc.setLineWidth(0.5);
      doc.roundedRect(20, yPos + 10, pageWidth - 40, 120, 3, 3, 'FD');
      
      // Stock information - main details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(26, 81, 46);
      doc.text(stock.variety, pageWidth / 2, yPos + 30, { align: "center" });
      
      // Stock type
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Crop Type: ${stock.cropType}`, pageWidth / 2, yPos + 40, { align: "center" });
      
      // Create a divider line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(40, yPos + 50, pageWidth - 40, yPos + 50);
      
      // Stock Details - key value pairs
      const startY = yPos + 60;
      const leftX = 40;
      const rightX = pageWidth / 2 + 10;
      const lineHeight = 10;
      
      // Set style for detail labels
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      
      // Left column labels
      doc.text("Farmer Name:", leftX, startY);
      doc.text("Quantity:", leftX, startY + lineHeight * 1);
      doc.text("Price per Unit:", leftX, startY + lineHeight * 2);
      doc.text("Total Value:", leftX, startY + lineHeight * 3);
      
      // Right column labels
      doc.text("Added Date:", rightX, startY);
      doc.text("Location:", rightX, startY + lineHeight * 1);
      doc.text("Contact:", rightX, startY + lineHeight * 2);
      
      // Set style for detail values
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      // Left column values
      doc.text(stock.farmerName, leftX + 30, startY);
      doc.text(`${stock.quantity} ${stock.quantityUnit}`, leftX + 30, startY + lineHeight * 1);
      doc.text(`Rs. ${stock.price.toLocaleString()}`, leftX + 30, startY + lineHeight * 2);
      doc.text(`Rs. ${(stock.price * stock.quantity).toLocaleString()}`, leftX + 30, startY + lineHeight * 3);
      
      // Right column values
      doc.text(new Date(stock.createdAt || new Date()).toLocaleDateString(), rightX + 30, startY);
      doc.text(stock.location || "Not specified", rightX + 30, startY + lineHeight * 1);
      doc.text(stock.contactInfo || "Not available", rightX + 30, startY + lineHeight * 2);
      
      // Add description if available
      if (stock.description) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(40, startY + lineHeight * 4, pageWidth - 40, startY + lineHeight * 4);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text("Description:", 40, startY + lineHeight * 5);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        
        // Handle multiline description
        const splitDescription = doc.splitTextToSize(stock.description, pageWidth - 80);
        doc.text(splitDescription, 40, startY + lineHeight * 6);
      }
      
      // Add a QR code placeholder for tracking (you could replace with an actual QR code)
      doc.setFillColor(80, 80, 80);
      doc.roundedRect(pageWidth - 70, yPos + 80, 30, 30, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text("QR", pageWidth - 55, yPos + 95, { align: "center" });
      
      // Add note at the bottom
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("This document serves as an official record of the inventory item.", pageWidth / 2, yPos + 140, { align: "center" });
      
      // Add footer
      addFooter(doc, 1, 1);
      
      // Save the PDF
      doc.save(`HarvestEase-Stock-${stock.variety}-${stock._id.substr(-5)}.pdf`);
      
    } catch (error) {
      console.error("Error generating single stock PDF:", error);
    }
  };

  const cropTypes = ['all', ...new Set(stocks.map(stock => stock.cropType))];

  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <motion.div 
      className="p-6 max-w-[1200px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Stock Inventory</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-md">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition duration-200"
            >
              <FaFilter className="text-green-600" />
              <span>Filter by Crop Type</span>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                {cropTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setCropTypeFilter(type);
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      cropTypeFilter === type ? 'bg-green-100 font-medium' : ''
                    }`}
                  >
                    {type === 'all' ? 'All Crops' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={generatePDF}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
          >
            <FaFilePdf />
            <span>{isLoading ? 'Generating...' : 'Export to PDF'}</span>
          </button>
        </div>
      </div>
      
      <div className="mb-4 text-sm">
        <span className="font-medium">{filteredStocks.length}</span> 
        <span className="text-gray-600"> stocks found</span>
        {cropTypeFilter !== 'all' && (
          <span className="text-gray-600"> filtered by <span className="font-medium">{cropTypeFilter}</span></span>
        )}
        {searchQuery && (
          <span className="text-gray-600"> matching "<span className="font-medium">{searchQuery}</span>"</span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th 
                    onClick={() => handleSort('farmerName')}
                    className="px-6 py-4 text-left text-sm font-medium cursor-pointer hover:bg-green-600 transition duration-200"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Farmer Name</span>
                      <span>{renderSortArrow('farmerName')}</span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('cropType')}
                    className="px-6 py-4 text-left text-sm font-medium cursor-pointer hover:bg-green-600 transition duration-200"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Crop Type</span>
                      <span>{renderSortArrow('cropType')}</span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('variety')}
                    className="px-6 py-4 text-left text-sm font-medium cursor-pointer hover:bg-green-600 transition duration-200"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Variety</span>
                      <span>{renderSortArrow('variety')}</span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('quantity')}
                    className="px-6 py-4 text-left text-sm font-medium cursor-pointer hover:bg-green-600 transition duration-200"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Quantity</span>
                      <span>{renderSortArrow('quantity')}</span>
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')}
                    className="px-6 py-4 text-left text-sm font-medium cursor-pointer hover:bg-green-600 transition duration-200"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Price (Rs)</span>
                      <span>{renderSortArrow('price')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks.map((stock, index) => (
                  <motion.tr
                    key={stock._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.farmerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{stock.cropType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stock.variety}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="font-medium">{stock.quantity}</span> {stock.quantityUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="font-medium">Rs. {stock.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 space-x-1">
                      <button
                        onClick={() => handleView(stock)}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-200 inline-flex items-center"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(stock)}
                        className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 transition duration-200 inline-flex items-center"
                        title="Edit stock"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => generateSingleStockPDF(stock)}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200 inline-flex items-center"
                        title="Download PDF"
                      >
                        <FaFilePdf />
                      </button>
                      <button
                        onClick={() => initiateDelete(stock._id)}
                        className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-200 inline-flex items-center"
                        title="Delete stock"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">No stocks found</div>
            <div className="text-sm text-gray-500">
              {searchQuery || cropTypeFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add some stocks to get started'}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <StockModal
            stock={selectedStock}
            isEditing={isEditing}
            setStocks={setStocks}
            closeModal={() => setShowModal(false)}
            onSave={handleStockUpdate}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmation.show && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this stock item? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 flex items-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash size={14} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StockTable;