import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createAuthority } from '../../api/authorityAPI';

// InputField component can be co-located or imported if it becomes a shared component
function InputField({ label, name, type = "text", value, onChange, required = false, placeholder = '' }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-blue-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder}
             className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white" />
    </div>
  );
}

/**
 * Modal component for adding new authority users
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {function} onSave - Optional callback function when user is successfully created
 * @param {Object} userToEdit - Not used (kept for compatibility)
 * @param {string} loggedInUserRole - Current user's role
 * @param {function} translateUsers - Translation function for user-related text
 */
function AddEditUserModal({ isOpen, onClose, onSave, userToEdit, translateUsers }) {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formError, setFormError] = useState('');

  const isEditMode = !!userToEdit; // This will always be false based on previous changes, but keeping logic for clarity
  useEffect(() => {
    if (isOpen) {
      setFormError(''); 
      setPasswordsMatch(true);
      // Since edit mode is effectively removed, we only set up for adding new 'authority' users
      setFormData({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'authority', // Default and only role
        authority_id: null, // Explicitly null for non-applicable fields
        university_id: null,
        college_id: null,
        department_id: null,
      });
    }
  }, [isOpen, isEditMode]); // isEditMode is kept for logical consistency, though it's always false
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'role') return; // Role is fixed
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      // Check password match when either password field changes
      if (name === 'password' || name === 'confirmPassword') {
        const password = name === 'password' ? value : newData.password;
        const confirmPassword = name === 'confirmPassword' ? value : newData.confirmPassword;
        setPasswordsMatch(password === confirmPassword || confirmPassword === '');
      }
      
      return newData;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError(translateUsers('errors.passwordMismatch'));
      return;
    }
    
    const dataToSend = { 
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    if (!dataToSend.password || !dataToSend.name || !dataToSend.username || !dataToSend.email) {
        setFormError(translateUsers('errors.validation'));
        return;
    }

    try {
      // Create the authority user using the authority API
      const createdAuthority = await createAuthority(dataToSend);
      
      // Call onSave if provided (for parent component to handle success)
      if (onSave) {
        await onSave(createdAuthority);
      }
      
      onClose();
    } catch (error) {
      console.error("Create authority error:", error);
      setFormError(error.message || translateUsers('errors.addUserFailed'));
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex justify-center items-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up border-2 border-blue-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-blue-400 hover:text-blue-600" aria-label={translateUsers('modal.closeModal')}>
          <X size={20} />
        </button>
        <div className="bg-blue-50 p-6 border-b border-blue-200 rounded-t-lg">
          <h2 className="text-xl font-semibold text-blue-800">{translateUsers('modal.addTitle')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
          {formError && <p className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">{formError}</p>}
          <InputField 
            label={translateUsers('fields.username')} 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            placeholder={translateUsers('placeholders.enterUsername')}
          />
          <InputField 
            label={translateUsers('fields.email')} 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder={translateUsers('placeholders.enterEmail')}
          />
          <InputField 
            label={translateUsers('fields.authorityName')} 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder={translateUsers('placeholders.enterAuthorityName')}
          />
          <div className="relative">
            <InputField 
              label={translateUsers('password')} 
              name="password" 
              type={showPassword ? "text" : "password"} 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder={translateUsers('placeholders.enterPassword')}
            />
           
          </div>
          
          <div className="relative">
            <InputField 
              label={translateUsers('confirmPassword')} 
              name="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              placeholder={translateUsers('placeholders.confirmPassword')}
            />
           
            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{translateUsers('messages.passwordsDontMatch')}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">{translateUsers('fields.role')}</label>
            <input 
              type="text" 
              value={translateUsers('roles.authority')} 
              disabled 
              className="mt-1 block w-full px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-blue-600 font-medium"
            />
            <p className="mt-1 text-xs text-blue-500">{translateUsers('subtitle')}</p>
          </div>

          {/* Fields like authority_id, university_id etc. are not relevant for creating an 'authority' user directly.
              If your backend requires them as null, the current setup is fine. Otherwise, they can be removed from the form.
              For now, they are part of formData but not rendered as input fields.
          */}

          <div className="pt-4 flex justify-end space-x-3 bg-blue-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg border-t border-blue-200">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 border border-blue-300 font-medium transition-colors">
              {translateUsers('actions.cancel')}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors">
              {translateUsers('addAuthorityUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditUserModal;