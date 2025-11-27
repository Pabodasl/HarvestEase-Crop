import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sharedBg from '../assets/shared_bg.png';

const CropUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    farmerName: '',
    paddyType: '',
    plantedDate: '',
    landArea: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/crops/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data.crop);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load crop data");
      }
    };
    fetchCrop();
  }, [id]);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, char => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'farmerName') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: capitalizeWords(lettersOnly) }));
      return;
    }

    if (name === 'phoneNumber') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digits }));
      }
      return;
    }

    if (name === 'landArea') {
      if (value === '' || parseFloat(value) > 0) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(formData.farmerName)) {
      newErrors.farmerName = 'Only letters allowed. Each word must start with a capital.';
    }

    if (!formData.paddyType) {
      newErrors.paddyType = 'Please select a paddy type.';
    }

    if (!formData.plantedDate || formData.plantedDate < today) {
      newErrors.plantedDate = 'Cannot use a past date.';
    }

    const land = parseFloat(formData.landArea);
    if (isNaN(land) || land <= 0) {
      newErrors.landArea = 'Land Area must be a positive number.';
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/crops/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("✅ Crop updated successfully!");
      setTimeout(() => navigate('/crop-table'), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${sharedBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white opacity-10 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md relative z-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1A512E]">
          Update Crop Details
        </h2>

        {/* Farmer Name */}
        <label className="block mb-2 font-semibold">Farmer Name</label>
        <input
          type="text"
          name="farmerName"
          value={formData.farmerName}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.farmerName ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.farmerName && <p className="text-red-600 text-sm mb-3">{errors.farmerName}</p>}

        {/* Paddy Type */}
        <label className="block mb-2 font-semibold">Paddy Type</label>
        <select
          name="paddyType"
          value={formData.paddyType}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.paddyType ? 'border-red-500' : 'border-gray-300'}`}
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
        {errors.paddyType && <p className="text-red-600 text-sm mb-3">{errors.paddyType}</p>}

        {/* Planted Date */}
        <label className="block mb-2 font-semibold">Planted Date</label>
        <input
          type="date"
          name="plantedDate"
          value={formData.plantedDate}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.plantedDate ? 'border-red-500' : 'border-gray-300'}`}
          min={today}
          required
        />
        {errors.plantedDate && <p className="text-red-600 text-sm mb-3">{errors.plantedDate}</p>}

        {/* Land Area */}
        <label className="block mb-2 font-semibold">Land Area (Hectares)</label>
        <input
          type="number"
          name="landArea"
          value={formData.landArea}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 mb-1 ${errors.landArea ? 'border-red-500' : 'border-gray-300'}`}
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
          required
        />
        {errors.phoneNumber && <p className="text-red-600 text-sm mb-3">{errors.phoneNumber}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#1A512E] hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full mt-4"
        >
          Update Crop
        </button>

        <ToastContainer position="top-center" />
      </form>
    </div>
  );
};

export default CropUpdate;
