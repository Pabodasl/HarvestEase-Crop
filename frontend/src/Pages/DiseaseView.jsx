import React from 'react';
import { FaTimes } from 'react-icons/fa';

function DiseaseView({ disease, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-[100px]">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">{disease.diseaseName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Disease Image */}
          {disease.imageUrl && (
            <div className="relative w-full rounded-lg overflow-hidden">
              <img
                src={`http://localhost:5000${disease.imageUrl}`}
                alt={disease.diseaseName}
                className="w-full h-auto max-h-[500px] object-contain"
                onError={(e) => {
                  console.error('Error loading image:', disease.imageUrl);
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
          )}

          {/* Disease Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Affected Parts</h3>
                <ul className="list-disc list-inside space-y-1">
                  {disease.affectedParts.map((part, index) => (
                    <li key={index} className="text-gray-700">{part}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Symptoms</h3>
                <ul className="list-disc list-inside space-y-1">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index} className="text-gray-700">{symptom}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Favorable Conditions</h3>
                <ul className="list-disc list-inside space-y-1">
                  {disease.favorableConditions.map((condition, index) => (
                    <li key={index} className="text-gray-700">{condition}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Treatments</h3>
                <ul className="list-disc list-inside space-y-1">
                  {disease.treatments.map((treatment, index) => (
                    <li key={index} className="text-gray-700">{treatment}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Next Season Management</h3>
                <ul className="list-disc list-inside space-y-1">
                  {disease.nextSeasonManagement.map((management, index) => (
                    <li key={index} className="text-gray-700">{management}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseView;
