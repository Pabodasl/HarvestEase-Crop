import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaSeedling, FaLeaf, 
  FaWeightHanging, FaMoneyBillWave, FaCalendarAlt, 
  FaTint, FaCalendarCheck, FaTemperatureHigh, FaWater,
  FaCogs, FaBox, FaWarehouse, FaStar, FaInfoCircle, 
  FaCheck, FaTrashAlt, FaTimes
} from 'react-icons/fa';

const StockModal = ({ stock, isEditing, setStocks, closeModal }) => {
  const [formData, setFormData] = useState({ ...stock });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (stock) {
      setFormData({ ...stock });
    }
  }, [stock]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.farmerName) newErrors.farmerName = "Farmer Name is required";
    if (!formData.farmerId) newErrors.farmerId = "Farmer ID is required";
    if (!formData.farmerEmail) newErrors.farmerEmail = "Farmer Email is required";
    if (!formData.variety) newErrors.variety = "Variety Name is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.price) newErrors.price = "Price per Unit is required";
    if (!formData.stockDate) newErrors.stockDate = "Stock Date is required";
    if (!formData.storageLocation) newErrors.storageLocation = "Storage Location is required";
    if (!formData.qualityGrade) newErrors.qualityGrade = "Quality Grade is required";

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.farmerEmail && !emailRegex.test(formData.farmerEmail)) {
      newErrors.farmerEmail = "Please enter a valid email address";
    }

    // Numeric validation
    if (formData.quantity && isNaN(formData.quantity)) {
      newErrors.quantity = "Quantity must be a number";
    }
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = "Price must be a number";
    }
    if (formData.storageTemperature && isNaN(formData.storageTemperature)) {
      newErrors.storageTemperature = "Storage Temperature must be a number";
    }
    if (formData.storageHumidity && isNaN(formData.storageHumidity)) {
      newErrors.storageHumidity = "Storage Humidity must be a number";
    }

    // Date validation
    const currentDate = new Date().toISOString().slice(0, 10);
    if (formData.stockDate && formData.stockDate > currentDate) {
      newErrors.stockDate = "Stock date cannot be in the future";
    }
    if (formData.harvestedDate && formData.harvestedDate > currentDate) {
      newErrors.harvestedDate = "Harvested date cannot be in the future";
    }
    if (formData.bestBeforeDate && formData.bestBeforeDate > currentDate) {
      newErrors.bestBeforeDate = "Best before date cannot be in the future";
    }

    // Validate rice-specific fields
    if (formData.cropType === 'rice') {
      if (!formData.processingType) newErrors.processingType = "Processing Type is required for rice";
      if (!formData.packagingType) newErrors.packagingType = "Packaging Type is required for rice";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission
    const dataToSubmit = { ...formData };

    // Conditionally omit processingType and packagingType if cropType is 'paddy'
    if (formData.cropType === 'paddy') {
      delete dataToSubmit.processingType;
      delete dataToSubmit.packagingType;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/update-stock/${formData._id}`, dataToSubmit);
      if (response.status === 200) {
        const updatedStocks = await axios.get('http://localhost:5000/api/get-stocks');
        setStocks(updatedStocks.data);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/delete-stock/${formData._id}`);
      const updatedStocks = await axios.get('http://localhost:5000/api/get-stocks');
      setStocks(updatedStocks.data);
      closeModal();
    } catch (error) {
      console.error('Error deleting stock:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  // Form field component to maintain consistent styling
  const FormField = ({ label, name, value, type = 'text', icon, error, disabled = !isEditing }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          {icon && <span className="mr-2 text-green-600">{icon}</span>}
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            className="w-full p-3 border bg-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
            rows="3"
          />
        ) : (
          <div className="relative">
            <input
              type={type}
              name={name}
              value={value || ''}
              onChange={handleChange}
              disabled={disabled}
              min={type === 'number' ? 0 : undefined}
              className={`w-full p-3 pr-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };

  // Create sections for better organization
  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-green-700 border-b border-gray-200 pb-2 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Stock Details' : 'View Stock Details'}
          </h2>
          <button 
            onClick={closeModal}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Farmer Information */}
            <Section title="Farmer Information">
              <FormField 
                label="Farmer Name" 
                name="farmerName" 
                value={formData.farmerName} 
                error={errors.farmerName}
                icon={<FaUser />}
              />
              <FormField 
                label="Farmer ID" 
                name="farmerId" 
                value={formData.farmerId} 
                error={errors.farmerId}
                icon={<FaInfoCircle />}
              />
              <FormField 
                label="Farmer Email" 
                name="farmerEmail" 
                type="email"
                value={formData.farmerEmail} 
                error={errors.farmerEmail}
                icon={<FaEnvelope />}
              />
            </Section>

            {/* Crop Information */}
            <Section title="Crop Information">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <span className="mr-2 text-green-600"><FaSeedling /></span>
                  Crop Type
                </label>
                <div className="relative">
                  <select
                    name="cropType"
                    value={formData.cropType || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="paddy">Paddy</option>
                    <option value="rice">Rice</option>
                  </select>
                </div>
              </div>
              
              <FormField 
                label="Variety" 
                name="variety" 
                value={formData.variety} 
                error={errors.variety}
                icon={<FaLeaf />}
              />
            </Section>

            {/* Stock Details */}
            <Section title="Stock Details">
              <FormField 
                label="Quantity" 
                name="quantity" 
                type="number"
                value={formData.quantity} 
                error={errors.quantity}
                icon={<FaWeightHanging />}
              />
              <FormField 
                label="Price (Rs)" 
                name="price" 
                type="number"
                value={formData.price} 
                error={errors.price}
                icon={<FaMoneyBillWave />}
              />
              <FormField 
                label="Stock Date" 
                name="stockDate" 
                type="date"
                value={formatDate(formData.stockDate)}
                error={errors.stockDate}
                icon={<FaCalendarAlt />}
              />
            </Section>

            {/* Crop-Specific Information */}
            {formData.cropType === 'paddy' && (
              <Section title="Paddy-Specific Details">
                <FormField 
                  label="Moisture Level (%)" 
                  name="moistureLevel" 
                  type="number"
                  value={formData.moistureLevel} 
                  icon={<FaTint />}
                />
                <FormField 
                  label="Harvested Date" 
                  name="harvestedDate" 
                  type="date"
                  value={formatDate(formData.harvestedDate)}
                  icon={<FaCalendarCheck />}
                />
                <FormField 
                  label="Storage Temperature (°C)" 
                  name="storageTemperature" 
                  type="number"
                  value={formData.storageTemperature} 
                  icon={<FaTemperatureHigh />}
                />
                <FormField 
                  label="Storage Humidity (%)" 
                  name="storageHumidity" 
                  type="number"
                  value={formData.storageHumidity} 
                  icon={<FaWater />}
                />
              </Section>
            )}

            {formData.cropType === 'rice' && (
              <Section title="Rice-Specific Details">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-2 text-green-600"><FaCogs /></span>
                    Processing Type
                  </label>
                  <select
                    name="processingType"
                    value={formData.processingType || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select processing type</option>
                    <option value="raw">Raw</option>
                    <option value="parboiled">Parboiled</option>
                    <option value="polished">Polished</option>
                  </select>
                  {errors.processingType && <p className="mt-1 text-sm text-red-500">{errors.processingType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <span className="mr-2 text-green-600"><FaBox /></span>
                    Packaging Type
                  </label>
                  <select
                    name="packagingType"
                    value={formData.packagingType || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select packaging type</option>
                    <option value="sack">Sack</option>
                    <option value="box">Box</option>
                    <option value="loose">Loose</option>
                  </select>
                  {errors.packagingType && <p className="mt-1 text-sm text-red-500">{errors.packagingType}</p>}
                </div>
              </Section>
            )}

            {/* Inventory Details */}
            <Section title="Inventory Details">
              <FormField 
                label="Storage Location" 
                name="storageLocation" 
                value={formData.storageLocation} 
                error={errors.storageLocation}
                icon={<FaWarehouse />}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <span className="mr-2 text-green-600"><FaStar /></span>
                  Quality Grade
                </label>
                <select
                  name="qualityGrade"
                  value={formData.qualityGrade || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="A">A - Premium</option>
                  <option value="B">B - Standard</option>
                  <option value="C">C - Basic</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="available">Available</option>
                  <option value="soldOut">Sold Out</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <FormField 
                  label="Description / Notes" 
                  name="description" 
                  value={formData.description}
                  type="textarea"
                  icon={<FaInfoCircle />}
                />
              </div>
            </Section>
          </form>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isSubmitting || isDeleting}
                className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <FaTrashAlt className="mr-2" />
                Delete
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Close'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <FaTrashAlt className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Stock</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this stock item? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StockModal;
