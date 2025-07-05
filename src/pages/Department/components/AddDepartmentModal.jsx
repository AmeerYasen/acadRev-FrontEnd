import React, { useState, useEffect } from 'react';
import { ROLES } from '../../../constants'; // Assuming ROLES are defined here
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';


const AddDepartmentModal = ({ isOpen, onClose, onAddDepartment, userRole, collegeId, universityId }) => {
  const { translateDepartment } = useNamespacedTranslation();
  
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    username: '', // For the department admin account
    email: '', // For the department admin account
    password: '', // For the department admin account
    confirmPassword: '', // Password confirmation
  });
  const [error, setError] = useState('');
  useEffect(() => {
    // Reset form when modal is opened or closed, or relevant IDs change
    if (!isOpen) {
      setNewDepartment({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setError('');
    }
  }, [isOpen, collegeId, universityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDepartment.name || !newDepartment.username || !newDepartment.email || !newDepartment.password) {
      setError(translateDepartment('addModal.errors.allFieldsRequired'));
      return;
    }
    if (newDepartment.password !== newDepartment.confirmPassword) {
      setError(translateDepartment('addModal.errors.passwordsDoNotMatch'));
      return;
    }
    if (newDepartment.password.length < 8) {
      setError(translateDepartment('addModal.errors.passwordTooShort'));
      return;
    }
    setError('');
    try {
      // Include college_id and university_id when adding
      // The backend will handle creating the user account and linking it.
      await onAddDepartment({ 
        name: newDepartment.name,
        username: newDepartment.username,
        email: newDepartment.email,
        password: newDepartment.password,
        college_id: collegeId, 
        university_id: universityId,
        role: ROLES.DEPARTMENT // Explicitly set the role for the new user account
      });
      onClose(); // Close modal on successful add
    } catch (err) {
      setError(err.message || translateDepartment('addModal.errors.addFailed'));
      console.error("Error adding department:", err);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Only College users (or higher admins if you decide so later) should be able to add departments.
  // This modal's opening should be controlled by the parent component based on userRole.
  // For now, we assume if it's open, the user has permission.

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-100 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{translateDepartment('addModal.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label={translateDepartment('addModal.accessibility.closePopup')}
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
        )}        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment('addModal.departmentName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="departmentName"
              value={newDepartment.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder={translateDepartment('addModal.departmentNamePlaceholder')}
            />
          </div>

          <h3 className="text-lg font-medium text-gray-700 pt-2 border-t mt-4">{translateDepartment('addModal.adminUserDetails')}</h3>
          
          <div>
            <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment('addModal.adminUsername')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              id="adminUsername"
              value={newDepartment.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder={translateDepartment('addModal.adminUsernamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment('addModal.adminEmail')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="adminEmail"
              value={newDepartment.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder={translateDepartment('addModal.adminEmailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment('addModal.adminPassword')} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="adminPassword"
              value={newDepartment.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder={translateDepartment('addModal.adminPasswordPlaceholder')}
              minLength="8"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment('addModal.confirmPassword')} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={newDepartment.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
              placeholder={translateDepartment('addModal.confirmPasswordPlaceholder')}
              minLength="8"
            />
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              {translateDepartment('addModal.createDepartment')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-150"
            >
              {translateDepartment('addModal.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
