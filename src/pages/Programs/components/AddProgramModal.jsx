import React, { useState, useEffect } from 'react';

const AddProgramModal = ({ isOpen, onClose, onAddProgram, userRole, departmentId, collegeId, universityId }) => {  const [newProgram, setNewProgram] = useState({
    name: '',
    language: '',
  });
  const [error, setError] = useState('');
  useEffect(() => {
    // Reset form when modal is opened or closed, or relevant IDs change
    if (!isOpen) {
      setNewProgram({
        name: '',
        language: '',
      });
      setError('');
    }
  }, [isOpen, departmentId, collegeId, universityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.language) {
      setError('Program name and language are required.');
      return;
    }
    
    setError('');
    try {
      // Include department_id, college_id, and university_id when adding
      await onAddProgram({ 
        name: newProgram.name,
        language: newProgram.language,
        department_id: departmentId, 
        college_id: collegeId,
        university_id: universityId,
      });
      onClose(); // Close modal on successful add
    } catch (err) {
      setError(err.message || 'Failed to add program. Please try again.');
      console.error("Error adding program:", err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Program</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
              Program Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="programName"
              value={newProgram.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder="e.g., Computer Science"
            />
          </div>          <div>
            <label htmlFor="programLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              name="language"
              id="programLanguage"
              value={newProgram.language}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Spanish">Spanish</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Russian">Russian</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Dutch">Dutch</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Add Program
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgramModal;
