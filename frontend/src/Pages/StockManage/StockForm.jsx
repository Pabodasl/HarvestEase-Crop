import axios from 'axios';
import React, { useState, useEffect } from 'react';
import sharedBg from '../../assets/shared_bg.png';
import { motion } from 'framer-motion';
import { 
  FaUser, FaIdCard, FaEnvelope, FaSeedling, FaLeaf, 
  FaWeightHanging, FaMoneyBillWave, FaCalendarAlt, 
  FaTint, FaCalendarCheck, FaTemperatureHigh, FaWater,
  FaCogs, FaBox, FaWarehouse, FaStar, FaInfoCircle, 
  FaCheck, FaChevronRight, FaPlus
} from 'react-icons/fa';

const StockForm = ({ setStocks }) => {
  const [formData, setFormData] = useState({
    farmerId: '',
    farmerName: '',
    farmerEmail: '',
    cropType: 'paddy',
    variety: '',
    quantity: '',
    quantityUnit: 'kg',
    price: '',
    stockDate: new Date().toISOString().slice(0, 10),
    moistureLevel: '',
    harvestedDate: '',
    storageTemperature: '',
    storageHumidity: '',
    processingType: '',
    packagingType: '',
    bestBeforeDate: '',
    storageLocation: '',
    qualityGrade: 'A',
    status: 'Available',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [sectionValidation, setSectionValidation] = useState([
    false, // Section 1: Farmer Information
    false, // Section 2: Crop Information
    false, // Section 3: Stock Details
    true,  // Section 4: Paddy/Rice-specific (initially considered valid)
    false  // Section 5: Inventory Details
  ]);

  // Track form progress
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    // Calculate form progress based on filled sections
    const filledSectionsCount = sectionValidation.filter(valid => valid).length;
    setFormProgress((filledSectionsCount / sectionValidation.length) * 100);
    
    // Form is valid if all sections are valid
    setIsFormValid(sectionValidation.every(valid => valid));
  }, [sectionValidation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data without causing unnecessary re-renders
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validateSection = (sectionIndex) => {
    let sectionErrors = {};
    let isValid = true;

    switch (sectionIndex) {
      case 0: // Farmer Information
        if (!formData.farmerName) {
          sectionErrors.farmerName = "Farmer Name is required";
          isValid = false;
        }
        if (!formData.farmerId) {
          sectionErrors.farmerId = "Farmer ID is required";
          isValid = false;
        }
        if (!formData.farmerEmail) {
          sectionErrors.farmerEmail = "Farmer Email is required";
          isValid = false;
        } else {
          // Email validation
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(formData.farmerEmail)) {
            sectionErrors.farmerEmail = "Please enter a valid email address";
            isValid = false;
          }
        }
        break;

      case 1: // Crop Information
        if (!formData.variety) {
          sectionErrors.variety = "Variety Name is required";
          isValid = false;
        }
        break;

      case 2: // Stock Details
        if (!formData.quantity) {
          sectionErrors.quantity = "Quantity is required";
          isValid = false;
        } else if (isNaN(formData.quantity)) {
          sectionErrors.quantity = "Quantity must be a number";
          isValid = false;
        }
        
        if (!formData.price) {
          sectionErrors.price = "Price per Unit is required";
          isValid = false;
        } else if (isNaN(formData.price)) {
          sectionErrors.price = "Price must be a number";
          isValid = false;
        }
        
        if (!formData.stockDate) {
          sectionErrors.stockDate = "Stock Date is required";
          isValid = false;
        } else {
          // Date validation
          const currentDate = new Date().toISOString().slice(0, 10);
          if (formData.stockDate > currentDate) {
            sectionErrors.stockDate = "Stock date cannot be in the future";
            isValid = false;
          }
        }
        break;

      case 3: // Crop-Specific Information (Paddy or Rice)
        if (formData.cropType === 'paddy') {
          if (formData.storageTemperature && isNaN(formData.storageTemperature)) {
            sectionErrors.storageTemperature = "Storage Temperature must be a number";
            isValid = false;
          }
          if (formData.storageHumidity && isNaN(formData.storageHumidity)) {
            sectionErrors.storageHumidity = "Storage Humidity must be a number";
            isValid = false;
          }
          if (formData.harvestedDate) {
            const currentDate = new Date().toISOString().slice(0, 10);
            if (formData.harvestedDate > currentDate) {
              sectionErrors.harvestedDate = "Harvested date cannot be in the future";
              isValid = false;
            }
          }
        } else if (formData.cropType === 'rice') {
          if (!formData.processingType) {
            sectionErrors.processingType = "Processing Type is required for rice";
            isValid = false;
          }
          if (!formData.packagingType) {
            sectionErrors.packagingType = "Packaging Type is required for rice";
            isValid = false;
          }
          if (formData.bestBeforeDate) {
            const currentDate = new Date().toISOString().slice(0, 10);
            if (formData.bestBeforeDate < currentDate) {
              sectionErrors.bestBeforeDate = "Best before date should be in the future";
              isValid = false;
            }
          }
        }
        break;

      case 4: // Inventory Details
        if (!formData.storageLocation) {
          sectionErrors.storageLocation = "Storage Location is required";
          isValid = false;
        }
        break;
        
      default:
        break;
    }

    // Update errors state
    setErrors({...errors, ...sectionErrors});
    
    // Update section validation state
    const newSectionValidation = [...sectionValidation];
    newSectionValidation[sectionIndex] = isValid;
    setSectionValidation(newSectionValidation);
    
    return isValid;
  };

  const nextSection = () => {
    // Validate current section
    if (validateSection(activeSection)) {
      setActiveSection(prev => Math.min(prev + 1, 4));
    }
  };

  const prevSection = () => {
    setActiveSection(prev => Math.max(prev - 1, 0));
  };

  const validateForm = () => {
    // Validate all sections
    let allValid = true;
    const newSectionValidation = [...sectionValidation];
    
    for (let i = 0; i < 5; i++) {
      const sectionValid = validateSection(i);
      newSectionValidation[i] = sectionValid;
      if (!sectionValid) allValid = false;
    }
    
    setSectionValidation(newSectionValidation);
    return allValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all form data before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission
    const dataToSubmit = { ...formData };

    // Conditionally omit fields based on crop type
    if (formData.cropType === 'paddy') {
      delete dataToSubmit.processingType;
      delete dataToSubmit.packagingType;
      delete dataToSubmit.bestBeforeDate;
    } else {
      delete dataToSubmit.moistureLevel;
      delete dataToSubmit.harvestedDate;
      delete dataToSubmit.storageTemperature;
      delete dataToSubmit.storageHumidity;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/add-stock', dataToSubmit);
      if (response.status === 200) {
        setStocks((prevStocks) => [...prevStocks, response.data]);
        setShowSuccess(true);

        // Reset form after successful submission
        setFormData({
          farmerId: '',
          farmerName: '',
          farmerEmail: '',
          cropType: 'paddy',
          variety: '',
          quantity: '',
          quantityUnit: 'kg',
          price: '',
          stockDate: new Date().toISOString().slice(0, 10),
          moistureLevel: '',
          harvestedDate: '',
          storageTemperature: '',
          storageHumidity: '',
          processingType: '',
          packagingType: '',
          bestBeforeDate: '',
          storageLocation: '',
          qualityGrade: 'A',
          status: 'Available',
          description: '',
        });

        setActiveSection(0);
        setSectionValidation([false, false, false, true, false]);
        setFormProgress(0);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Set background image when component mounts
  useEffect(() => {
    document.body.style.backgroundImage = `url(${sharedBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  // Form components
  const FormInput = ({ label, type, name, value, placeholder, options, min, max, error, icon }) => {
    if (type === 'select') {
      return (
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {icon && <span className="mr-2 text-green-600">{icon}</span>}
            {label}
          </label>
          <div className="relative">
            <select
              name={name}
              value={value}
              onChange={handleChange}
              className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 appearance-none bg-white ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaChevronRight className="text-gray-400 transform rotate-90" />
            </div>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );
    }

    return (
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          {icon && <span className="mr-2 text-green-600">{icon}</span>}
          {label}
        </label>
        <div className="relative">
          {type === 'textarea' ? (
            <textarea
              name={name}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 resize-none h-24 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ) : (
            <input
              key={`input-${name}`}
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              min={min}
              max={max}
              className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  // Section components with fade animations
  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <motion.div
            key="section1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaUser className="mr-2" /> Farmer Information
            </h2>
            <FormInput
              label="Farmer Name"
              type="text"
              name="farmerName"
              value={formData.farmerName}
              placeholder="Enter farmer's name"
              error={errors.farmerName}
              icon={<FaUser className="text-green-600" />}
            />
            <FormInput
              label="Farmer ID"
              type="text"
              name="farmerId"
              value={formData.farmerId}
              placeholder="Enter farmer's ID"
              error={errors.farmerId}
              icon={<FaIdCard className="text-green-600" />}
            />
            <FormInput
              label="Farmer Email"
              type="email"
              name="farmerEmail"
              value={formData.farmerEmail}
              placeholder="Enter farmer's email"
              error={errors.farmerEmail}
              icon={<FaEnvelope className="text-green-600" />}
            />
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div
            key="section2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaSeedling className="mr-2" /> Crop Information
            </h2>
            <FormInput
              label="Item Type"
              type="select"
              name="cropType"
              value={formData.cropType}
              options={[
                { value: 'paddy', label: 'Paddy' },
                { value: 'rice', label: 'Rice' },
              ]}
              icon={<FaSeedling className="text-green-600" />}
            />
            <FormInput
              label="Variety Name"
              type="text"
              name="variety"
              value={formData.variety}
              placeholder="E.g., Samba, Nadu"
              error={errors.variety}
              icon={<FaLeaf className="text-green-600" />}
            />
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="section3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaWeightHanging className="mr-2" /> Stock Details
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaWeightHanging className="mr-2 text-green-600" /> Quantity
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      className={`w-full p-3 pl-10 border rounded-l-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaWeightHanging className="text-green-600" />
                    </div>
                  </div>
                  <select
                    name="quantityUnit"
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    className="p-3 border-l-0 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50 min-w-[80px]"
                  >
                    <option value="kg">kg</option>
                    <option value="MT">MT</option>
                  </select>
                </div>
                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
              </div>

              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-600" /> Price per Unit
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      min="0"
                      className={`w-full p-3 pl-10 border rounded-l-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaMoneyBillWave className="text-green-600" />
                    </div>
                  </div>
                  <span className="p-3 border-l-0 border border-gray-300 rounded-r-lg shadow-sm bg-gray-50 whitespace-nowrap">Rs. per kg</span>
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
            </div>

            <FormInput
              label="Stock Added Date"
              type="date"
              name="stockDate"
              value={formData.stockDate}
              max={new Date().toISOString().split("T")[0]}
              error={errors.stockDate}
              icon={<FaCalendarAlt className="text-green-600" />}
            />
          </motion.div>
        );
      
      case 3:
        return formData.cropType === 'paddy' ? (
          <motion.div
            key="section4-paddy"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaSeedling className="mr-2" /> Paddy-Specific Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Moisture Level (%)"
                type="number"
                name="moistureLevel"
                value={formData.moistureLevel}
                placeholder="Enter moisture level"
                error={errors.moistureLevel}
                icon={<FaTint className="text-green-600" />}
              />
              <FormInput
                label="Harvested Date"
                type="date"
                name="harvestedDate"
                value={formData.harvestedDate}
                max={new Date().toISOString().split("T")[0]}
                error={errors.harvestedDate}
                icon={<FaCalendarCheck className="text-green-600" />}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Storage Temperature (°C)"
                type="number"
                name="storageTemperature"
                value={formData.storageTemperature}
                placeholder="Enter storage temperature"
                error={errors.storageTemperature}
                icon={<FaTemperatureHigh className="text-green-600" />}
              />
              <FormInput
                label="Storage Humidity (%)"
                type="number"
                name="storageHumidity"
                value={formData.storageHumidity}
                placeholder="Enter storage humidity"
                error={errors.storageHumidity}
                icon={<FaWater className="text-green-600" />}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="section4-rice"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaSeedling className="mr-2" /> Rice-Specific Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Processing Type"
                type="select"
                name="processingType"
                value={formData.processingType}
                options={[
                  { value: '', label: 'Select processing type' },
                  { value: 'raw', label: 'Raw' },
                  { value: 'parboiled', label: 'Parboiled' },
                  { value: 'polished', label: 'Polished' },
                ]}
                error={errors.processingType}
                icon={<FaCogs className="text-green-600" />}
              />
              <FormInput
                label="Packaging Type"
                type="select"
                name="packagingType"
                value={formData.packagingType}
                options={[
                  { value: '', label: 'Select packaging type' },
                  { value: 'sack', label: 'Sack' },
                  { value: 'box', label: 'Box' },
                  { value: 'loose', label: 'Loose' },
                ]}
                error={errors.packagingType}
                icon={<FaBox className="text-green-600" />}
              />
            </div>
            <FormInput
              label="Best Before Date"
              type="date"
              name="bestBeforeDate"
              value={formData.bestBeforeDate}
              placeholder="Select best before date"
              error={errors.bestBeforeDate}
              icon={<FaCalendarAlt className="text-green-600" />}
            />
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div
            key="section5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-6 text-green-700 border-b pb-2 flex items-center">
              <FaWarehouse className="mr-2" /> Inventory Details
            </h2>
            <FormInput
              label="Storage Location"
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              placeholder="Enter storage location"
              error={errors.storageLocation}
              icon={<FaWarehouse className="text-green-600" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Quality Grade"
                type="select"
                name="qualityGrade"
                value={formData.qualityGrade}
                options={[
                  { value: 'A', label: 'A - Premium' },
                  { value: 'B', label: 'B - Standard' },
                  { value: 'C', label: 'C - Basic' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'standard', label: 'Standard' },
                  { value: 'low', label: 'Low' },
                ]}
                icon={<FaStar className="text-green-600" />}
              />
              <FormInput
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'soldOut', label: 'Sold Out' },
                  { value: 'pending', label: 'Pending' },
                ]}
                icon={<FaInfoCircle className="text-green-600" />}
              />
            </div>
            <FormInput
              label="Description / Notes"
              type="textarea"
              name="description"
              value={formData.description}
              placeholder="Enter any description or notes"
              icon={<FaInfoCircle className="text-green-600" />}
            />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4">
      {/* Success Message */}
      {showSuccess && (
        <motion.div
          className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <FaCheck className="mr-2" /> 
          Stock added successfully!
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with animated gradient */}
        <div className="relative h-48 mb-12 overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 animate-gradient-x">
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Add New Stock</h1>
                <p className="text-green-100">Fill in the details below to add a new stock item to the inventory</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,224C672,245,768,235,864,197.3C960,160,1056,96,1152,74.7C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-green-600 font-medium">Form Progress</span>
              <span className="text-gray-600">{Math.round(formProgress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full" 
                initial={{ width: "0%" }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex justify-between items-center mb-8">
            {['Farmer Details', 'Crop Info', 'Stock Details', formData.cropType === 'paddy' ? 'Paddy Details' : 'Rice Details', 'Inventory'].map((step, index) => (
              <button
                key={index}
                type="button"
                className={`flex flex-col items-center ${index <= activeSection ? 'text-green-600' : 'text-gray-400'}`}
                onClick={() => {
                  // Only allow navigation to sections that have been validated or are already active
                  if (index <= activeSection || sectionValidation[index]) {
                    setActiveSection(index);
                  }
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < activeSection 
                    ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                    : index === activeSection
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {index < activeSection ? <FaCheck /> : index + 1}
                </div>
                <span className="mt-2 text-xs hidden sm:block">{step}</span>
              </button>
            ))}
          </div>

          {/* Main form section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 min-h-[400px]">
            {renderSection()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <motion.button
              type="button"
              className={`py-3 px-6 rounded-lg font-medium ${
                activeSection === 0 ? 'bg-gray-300 text-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
              } transition-colors duration-300 flex items-center`}
              whileHover={activeSection !== 0 ? { scale: 1.02 } : {}}
              whileTap={activeSection !== 0 ? { scale: 0.98 } : {}}
              onClick={prevSection}
              disabled={activeSection === 0}
            >
              Previous
            </motion.button>
            
            {activeSection === 4 ? (
              <motion.button
                type="submit"
                className={`py-3 px-10 rounded-lg font-medium text-white ${
                  isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                } transition-colors duration-300 flex items-center`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Stock
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                className="py-3 px-10 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextSection}
              >
                Next <FaChevronRight className="ml-2" />
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default StockForm;
