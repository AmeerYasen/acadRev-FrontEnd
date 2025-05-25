import React from 'react';

const DepartmentModal = ({ department, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary-dark">{department.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Code
              </label>
              <p className="text-gray-900">{department.code || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Established
              </label>
              <p className="text-gray-900">{department.established || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Head
              </label>
              <p className="text-gray-900">{department.head_name || department.chair_name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Programs
              </label>
              <p className="text-gray-900">{department.programs?.length || 0}</p>
            </div>
          </div>

          {/* Description */}
          {department.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <p className="text-gray-900 leading-relaxed">{department.description}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {department.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{department.email}</p>
              </div>
            )}
            {department.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{department.phone}</p>
              </div>
            )}
          </div>

          {/* Location */}
          {department.location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <p className="text-gray-900">{department.location}</p>
            </div>
          )}

          {/* Programs List */}
          {department.programs && department.programs.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programs Offered
              </label>
              <div className="space-y-2">
                {department.programs.map((program, index) => (
                  <div
                    key={program.id || index}
                    className="p-3 bg-gray-50 rounded-lg border"
                  >
                    <h4 className="font-medium text-gray-900">{program.name}</h4>
                    {program.degree_type && (
                      <p className="text-sm text-gray-600">Degree: {program.degree_type}</p>
                    )}
                    {program.duration && (
                      <p className="text-sm text-gray-600">Duration: {program.duration}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;