import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import sharedBg from '../assets/shared_bg.png';

const CropForm = () => {
  const [formData, setFormData] = useState({
    farmerName: '',
    paddyType: '',
    plantedDate: '',
    landArea: '',
    phoneNumber: '',
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({
    phoneNumber: '',
    landArea: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaddyTypeLocked, setIsPaddyTypeLocked] = useState(false);
  const [isFarmerNameLocked, setIsFarmerNameLocked] = useState(true); // New state for read-only name
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0];

  // Get user data from localStorage and set farmer name automatically
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Try to get user data from localStorage (common approach)
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData) {
          // If user data is stored in localStorage
          const user = JSON.parse(userData);
          if (user.fullName || user.name) {
            setFormData(prev => ({
              ...prev,
              farmerName: user.fullName || user.name
            }));
          }
        } else if (token) {
          // If using JWT token, you might need to decode it to get user info
          // Note: This is a basic implementation - you might want to use a proper JWT library
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.fullName || payload.name) {
              setFormData(prev => ({
                ...prev,
                farmerName: payload.fullName || payload.name
              }));
            }
          } catch (decodeError) {
            console.warn('Could not decode token:', decodeError);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Get paddy type from navigation state
  useEffect(() => {
    if (location.state && location.state.paddyType) {
      setFormData(prev => ({
        ...prev,
        paddyType: location.state.paddyType
      }));
      setIsPaddyTypeLocked(true);
    }
  }, [location.state]);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, char => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't update farmerName if it's locked (read-only)
    if (name === 'farmerName' && isFarmerNameLocked) {
      return;
    }

    if (name === 'farmerName') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: capitalizeWords(lettersOnly) }));
      return;
    }

    if (name === 'phoneNumber') {
      const digitOnly = value.replace(/\D/g, '');
      if (digitOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitOnly }));
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
      return;
    }

    if (name === 'landArea') {
      const parsed = parseFloat(value);
      if (value === '' || parsed > 0) {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, landArea: '' }));
      } else {
        setErrors(prev => ({ ...prev, landArea: 'Land Area must be greater than 0' }));
      }
      return;
    }

    // Don't update paddyType if it's locked
    if (name === 'paddyType' && isPaddyTypeLocked) {
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let valid = true;
    let newErrors = { phoneNumber: '', landArea: '' };

    if (formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
      valid = false;
    }

    const landValue = parseFloat(formData.landArea);
    if (isNaN(landValue) || landValue <= 0) {
      newErrors.landArea = 'Land Area must be greater than 0';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to submit crops.");
        navigate('/login');
        setIsSubmitting(false);
        return;
      }
      const response = await axios.post('http://localhost:5000/crops/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data.crops);
      toast.success(" Crop data submitted successfully!");

      // ✅ Send SMS but remove toast messages for it
      try {
        await axios.post('http://localhost:5000/api/send-sms', {
          phoneNumber: `+94${formData.phoneNumber}`,
          message: `Hello ${formData.farmerName}, your ${formData.paddyType} paddy cultivation has been registered successfully!\n\nPlanted Date: ${formData.plantedDate}\nLand Area: ${formData.landArea} hectares\n\nThank you for using our service!`
        });
      } catch (smsError) {
        console.error('SMS Error:', smsError); // ✅ only log error, no toast
      }

      setFormData({
        farmerName: formData.farmerName, // Keep the farmer name for future submissions
        paddyType: '',
        plantedDate: '',
        landArea: '',
        phoneNumber: '',
      });
      setErrors({ phoneNumber: '', landArea: '' });
      setIsPaddyTypeLocked(false);

      setTimeout(() => {
        navigate('/crop-table');
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      const message = err.response?.data?.message || '❌ Submission failed. Try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${sharedBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0 bg-white opacity-10 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1A512E]">
          Crop Tracking Form
        </h2>

        {/* Farmer Name */}
        <label className="block mb-2 font-semibold">Farmer Name</label>
        <input
          type="text"
          name="farmerName"
          value={formData.farmerName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-gray-100"
          placeholder="Auto-filled from your profile"
          required
          readOnly={isFarmerNameLocked}
        />
        <p className="text-sm text-gray-600 mb-4 -mt-2">
          ✓ Automatically filled from your registered profile
        </p>

        {/* Paddy Type */}
        <label className="block mb-2 font-semibold">Paddy Type</label>
        {isPaddyTypeLocked ? (
          <div className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-gray-100">
            {formData.paddyType}
          </div>
        ) : (
          <select
            name="paddyType"
            value={formData.paddyType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            required
          >
            <option value="">Select Paddy Type</option>
            <option value="Nadu">Nadu</option>
            <option value="Samba">Samba</option>
            <option value="Red Rice">Red Rice</option>
            <option value="Bg 352">Bg 352</option>
            <option value="Suwandel">Suwandel</option>
            <option value="Pachchaperumal">Pachchaperumal</option>
          </select>
        )}

        {/* Planted Date */}
        <label className="block mb-2 font-semibold">Planted Date</label>
        <input
          type="date"
          name="plantedDate"
          value={formData.plantedDate}
          onChange={handleChange}
          min={today}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          required
        />

        {/* Land Area */}
        <label className="block mb-2 font-semibold">Land Area (Hectares)</label>
        <input
          type="number"
          name="landArea"
          value={formData.landArea}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.landArea ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter positive number"
          step="0.01"
          required
        />
        {errors.landArea && <p className="text-red-600 text-sm mb-3">{errors.landArea}</p>}

        {/* Phone Number */}
        <label className="block mb-2 font-semibold">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g. 0712345678"
          required
        />
        {errors.phoneNumber && <p className="text-red-600 text-sm mb-3">{errors.phoneNumber}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#1A512E] hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>

        {/* Display Result */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded text-green-800">
            <p><strong>Fertilization Date:</strong> {result.fertilizationDate}</p>
            <p><strong>Harvest Date:</strong> {result.harvestDate}</p>
          </div>
        )}

        <ToastContainer position="top-center" />
      </form>
    </motion.div>
  );
};

export default CropForm;