import React, { useState } from 'react';
import { FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function DiseasesOverlay({ onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResults, setApiResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });

      // Make request to Plant.id API
      const apiResponse = await axios({
        method: 'post',
        url: 'https://crop.kindwise.com/api/v1/identification',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'NGXBHMAex01ipHhfvocubcTZOQtf9Oi6b6FLyq1H2YcrEfPp3l'
        },
        data: {
          images: [base64Image],
          latitude: 7.8731,  // Sri Lanka's approximate latitude
          longitude: 80.7718, // Sri Lanka's approximate longitude
          similar_images: true
        }
      });

      console.log('API Response:', apiResponse.data); // Add detailed logging

      if (apiResponse.data) {
        // Check if the response has the expected structure
        const diseases =
          apiResponse.data.diseases ||
          apiResponse.data.health_assessment?.diseases ||
          apiResponse.data.result?.disease?.suggestions ||
          [];
        const transformedResults = {
          diseases: diseases.map(disease => ({
            name: disease.name || 'Unknown Disease',
            confidence: disease.probability || disease.confidence || 0,
            description: disease.description || 'No description available',
            treatment: disease.treatment
              ? (typeof disease.treatment === 'object'
                  ? Object.values(disease.treatment).join(' | ')
                  : disease.treatment)
              : 'No treatment information available'
          }))
        };
        setApiResults(transformedResults);
        
        if (diseases.length === 0) {
          setError('No diseases detected in the image. Please try with a clearer image of the affected area.');
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('API Key authentication failed. Please check if the API key is valid.');
      } else if (err.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the API configuration.');
      } else {
        setError('Error processing image. Please try again with a clearer image of the disease symptoms.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Disease Detection from Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg mb-4 object-contain"
                />
              ) : (
                <FaUpload size={48} className="text-gray-400 mb-4" />
              )}
              <span className="text-gray-600">
                {selectedImage ? 'Change Image' : 'Click to upload image'}
              </span>
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedImage || loading}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
              loading || !selectedImage
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <FaUpload /> Upload and Detect
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center p-3 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* API Results */}
          {apiResults && apiResults.diseases.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Detection Results</h3>
              <div className="space-y-4">
                {apiResults.diseases.map((disease, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-lg text-green-800">{disease.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Confidence: {(disease.confidence * 100).toFixed(2)}%
                    </p>
                    {disease.description && (
                      <div className="mb-2">
                        <p className="font-medium">Description:</p>
                        <p className="text-sm text-gray-700">{disease.description}</p>
                      </div>
                    )}
                    {disease.treatment && (
                      <div>
                        <p className="font-medium">Treatment:</p>
                        <p className="text-sm text-gray-700">{disease.treatment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiseasesOverlay;
