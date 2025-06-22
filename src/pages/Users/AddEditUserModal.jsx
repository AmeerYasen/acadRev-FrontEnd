import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

// InputField component can be co-located or imported if it becomes a shared component
function InputField({ label, name, type = "text", value, onChange, required = false, placeholder = '' }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder}
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
  );
}

function AddEditUserModal({ isOpen, onClose, onSave, userToEdit, loggedInUserRole }) {
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
      setFormError("Passwords do not match.");
      return;
    }
    
    const dataToSend = { ...formData };
    // Remove confirmPassword from data sent to backend
    delete dataToSend.confirmPassword;

    // Ensure IDs are numbers or null. Since we only add 'authority', these might not be relevant.
    // However, if your backend expects them as null, this is fine.
    ['authority_id', 'university_id', 'college_id', 'department_id'].forEach(key => {
        dataToSend[key] = dataToSend[key] ? parseInt(dataToSend[key], 10) : null;
    });
    dataToSend.is_active = dataToSend.is_active ? 1 : 0;
    dataToSend.role = 'authority'; // Enforce role

    if (!dataToSend.password) { // Password is required for new users
        setFormError("Password is required for new users.");
        return;
    }

    try {
      await onSave(dataToSend); // userToEdit?.id is removed as we only add
      onClose();
    } catch (error) {
      console.error("Save user error:", error);
      setFormError(error.message || "Failed to save user.");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        <h2 className="text-xl font-semibold p-6 border-b">Add New Authority User</h2>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {formError && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{formError}</p>}
          <InputField label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />          <div className="relative">
            <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
          
          <div className="relative">
            <InputField label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500">
              {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input 
              type="text" 
              value="Authority" 
              disabled 
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Admin users can only create Authority users</p>
          </div>

          {/* Fields like authority_id, university_id etc. are not relevant for creating an 'authority' user directly.
              If your backend requires them as null, the current setup is fine. Otherwise, they can be removed from the form.
              For now, they are part of formData but not rendered as input fields.
          */}

       

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Create Authority User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditUserModal;