import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilePdf } from 'react-icons/fa';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
import axios from 'axios';
import DiseaseView from './DiseaseView';
import sharedBg from '../assets/shared_bg.png';
import logo from '../assets/Yellow Vintage Wheat Rice Oats logo.png';

// Create PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
  },
  reportInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 8,
    fontSize: 12,
  },
  indexCell: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },
  nameCell: {
    width: '85%',
  },
});

// PDF Document Component
const DiseaseListPDF = ({ diseases }) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm a');
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header with Logo */}
        <View style={pdfStyles.header}>
          <Image style={pdfStyles.logo} src={logo} />
          <Text style={pdfStyles.title}>HarvestEase - Names of Diseases</Text>
        </View>

        {/* Report Information */}
        <View style={pdfStyles.reportInfo}>
          <Text style={pdfStyles.infoText}>Report Generated: {currentDate}</Text>
          <Text style={pdfStyles.infoText}>Total Diseases: {diseases.length}</Text>
        </View>

        {/* Table Header */}
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <View style={[pdfStyles.tableCell, pdfStyles.indexCell]}>
            <Text>No.</Text>
          </View>
          <View style={[pdfStyles.tableCell, pdfStyles.nameCell]}>
            <Text>Disease Name</Text>
          </View>
        </View>

        {/* Table Content */}
        {diseases.map((disease, index) => (
          <View key={disease._id} style={pdfStyles.tableRow}>
            <View style={[pdfStyles.tableCell, pdfStyles.indexCell]}>
              <Text>{index + 1}</Text>
            </View>
            <View style={[pdfStyles.tableCell, pdfStyles.nameCell]}>
              <Text>{disease.diseaseName}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

function DiseasesAdmin() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewOverlay, setShowViewOverlay] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    diseaseName: '',
    affectedParts: '',
    symptoms: '',
    favorableConditions: '',
    treatments: '',
    nextSeasonManagement: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/diseases');
      setDiseases(response.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      alert('Error fetching diseases. Please try again.');
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Disease Name validation
    if (!formData.diseaseName.trim()) {
      newErrors.diseaseName = 'Disease name is required';
    } else if (formData.diseaseName.length < 3) {
      newErrors.diseaseName = 'Disease name must be at least 3 characters long';
    }

    // Affected Parts validation
    if (!formData.affectedParts.trim()) {
      newErrors.affectedParts = 'Affected parts are required';
    } else {
      const parts = formData.affectedParts.split(',').map(part => part.trim());
      if (parts.some(part => part.length < 2)) {
        newErrors.affectedParts = 'Each affected part must be at least 2 characters long';
      }
    }

    // Symptoms validation
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms are required';
    } else {
      const symptoms = formData.symptoms.split(',').map(symptom => symptom.trim());
      if (symptoms.some(symptom => symptom.length < 3)) {
        newErrors.symptoms = 'Each symptom must be at least 3 characters long';
      }
    }

    // Favorable Conditions validation
    if (!formData.favorableConditions.trim()) {
      newErrors.favorableConditions = 'Favorable conditions are required';
    } else {
      const conditions = formData.favorableConditions.split(',').map(condition => condition.trim());
      if (conditions.some(condition => condition.length < 3)) {
        newErrors.favorableConditions = 'Each condition must be at least 3 characters long';
      }
    }

    // Treatments validation
    if (!formData.treatments.trim()) {
      newErrors.treatments = 'Treatments are required';
    } else {
      const treatments = formData.treatments.split(',').map(treatment => treatment.trim());
      if (treatments.some(treatment => treatment.length < 3)) {
        newErrors.treatments = 'Each treatment must be at least 3 characters long';
      }
    }

    // Next Season Management validation
    if (!formData.nextSeasonManagement.trim()) {
      newErrors.nextSeasonManagement = 'Next season management is required';
    } else {
      const management = formData.nextSeasonManagement.split(',').map(item => item.trim());
      if (management.some(item => item.length < 3)) {
        newErrors.nextSeasonManagement = 'Each management item must be at least 3 characters long';
      }
    }

    // Image validation
    if (formData.image) {
      const fileSize = formData.image.size / 1024 / 1024; // Convert to MB
      if (fileSize > 5) {
        newErrors.image = 'Image size must be less than 5MB';
      }
      if (!formData.image.type.startsWith('image/')) {
        newErrors.image = 'File must be an image';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear image error if exists
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'affectedParts' || key === 'symptoms' || 
            key === 'favorableConditions' || key === 'treatments' || 
            key === 'nextSeasonManagement') {
          formDataToSend.append(key, formData[key].split(',').map(item => item.trim()));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('http://localhost:5000/api/diseases/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowAddForm(false);
      resetForm();
      fetchDiseases();
    } catch (error) {
      console.error('Error adding disease:', error);
      alert('Error adding disease. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('diseaseName', formData.diseaseName);
      
      // Handle array fields
      const arrayFields = ['affectedParts', 'symptoms', 'favorableConditions', 'treatments', 'nextSeasonManagement'];
      arrayFields.forEach(field => {
        const arrayData = formData[field].split(',').map(item => item.trim());
        formDataToSend.append(field, JSON.stringify(arrayData));
      });

      // Handle image
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.put(`http://localhost:5000/api/diseases/${selectedDisease._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowEditForm(false);
      resetForm();
      fetchDiseases();
    } catch (error) {
      console.error('Error updating disease:', error);
      alert('Error updating disease. Please try again.');
    }
  };

  const handleEdit = (disease) => {
    setSelectedDisease(disease);
    setFormData({
      diseaseName: disease.diseaseName,
      affectedParts: disease.affectedParts.join(', '),
      symptoms: disease.symptoms.join(', '),
      favorableConditions: disease.favorableConditions.join(', '),
      treatments: disease.treatments.join(', '),
      nextSeasonManagement: disease.nextSeasonManagement.join(', '),
      image: null
    });
    setImagePreview(disease.image ? `http://localhost:5000/${disease.image}` : null);
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      diseaseName: '',
      affectedParts: '',
      symptoms: '',
      favorableConditions: '',
      treatments: '',
      nextSeasonManagement: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    setSelectedDisease(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this disease?')) {
      try {
        await axios.delete(`http://localhost:5000/api/diseases/${id}`);
        fetchDiseases();
      } catch (error) {
        console.error('Error deleting disease:', error);
        alert('Error deleting disease. Please try again.');
      }
    }
  };

  const handleView = (disease) => {
    setSelectedDisease(disease);
    setShowViewOverlay(true);
  };

  const renderForm = (isEdit = false) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto mt-[60px]">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8 relative">
        <div className="bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-800">
            {isEdit ? 'Edit Disease' : 'Add New Disease'}
          </h2>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditForm(false);
              } else {
                setShowAddForm(false);
              }
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-6 mt-10 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease Name
              </label>
              <input
                type="text"
                name="diseaseName"
                value={formData.diseaseName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.diseaseName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.diseaseName && (
                <p className="mt-1 text-sm text-red-600">{errors.diseaseName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected Parts (comma-separated)
              </label>
              <input
                type="text"
                name="affectedParts"
                value={formData.affectedParts}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.affectedParts ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.affectedParts && (
                <p className="mt-1 text-sm text-red-600">{errors.affectedParts}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (comma-separated)
              </label>
              <input
                type="text"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.symptoms ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.symptoms && (
                <p className="mt-1 text-sm text-red-600">{errors.symptoms}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favorable Conditions (comma-separated)
              </label>
              <input
                type="text"
                name="favorableConditions"
                value={formData.favorableConditions}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.favorableConditions ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.favorableConditions && (
                <p className="mt-1 text-sm text-red-600">{errors.favorableConditions}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatments (comma-separated)
              </label>
              <input
                type="text"
                name="treatments"
                value={formData.treatments}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.treatments ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.treatments && (
                <p className="mt-1 text-sm text-red-600">{errors.treatments}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Season Management (comma-separated)
              </label>
              <input
                type="text"
                name="nextSeasonManagement"
                value={formData.nextSeasonManagement}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.nextSeasonManagement ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.nextSeasonManagement && (
                <p className="mt-1 text-sm text-red-600">{errors.nextSeasonManagement}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:border-transparent ${
                  errors.image ? 'border-red-500' : ''
                }`}
                accept="image/*"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
            <div className="bg-white py-4 border-t flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  if (isEdit) {
                    setShowEditForm(false);
                  } else {
                    setShowAddForm(false);
                  }
                  resetForm();
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {isEdit ? 'Update Disease' : 'Add Disease'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center opacity-10"
        style={{ 
          backgroundImage: `url(${sharedBg})`,
          backgroundSize: '900px',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Content Container */}
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-green-800">Disease Management</h2>
          <div className="flex gap-4">
            {diseases.length > 0 && (
              <PDFDownloadLink
                document={<DiseaseListPDF diseases={diseases} />}
                fileName={`disease-list-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : (
                    <>
                      <FaFilePdf />
                      Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <FaPlus /> Add New Disease
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search diseases by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Add Disease Form */}
        {showAddForm && renderForm(false)}

        {/* Edit Disease Form */}
        {showEditForm && renderForm(true)}

        {/* Diseases List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {diseases.filter(disease => 
              disease.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((disease) => (
              <div
                key={disease._id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <h4 className="text-lg font-semibold text-green-800">{disease.diseaseName}</h4>
                </div>
                <div className="flex gap-2">
                <button
                    onClick={() => handleView(disease)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-2"
                  >
                    <FaEye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEdit(disease)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center gap-2"
                  >
                    <FaEdit size={16} />
                    <span>Update</span>
                  </button>
                  <button
                    onClick={() => handleDelete(disease._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-2"
                  >
                    <FaTrash size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Disease Overlay */}
      {showViewOverlay && selectedDisease && (
        <DiseaseView
          disease={selectedDisease}
          onClose={() => setShowViewOverlay(false)}
        />
      )}
    </div>
  );
}

export default DiseasesAdmin;
