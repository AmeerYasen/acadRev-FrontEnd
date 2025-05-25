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
  const [formError, setFormError] = useState('');

  const isEditMode = !!userToEdit; // This will always be false based on previous changes, but keeping logic for clarity

  useEffect(() => {
    if (isOpen) {
      setFormError(''); 
      // Since edit mode is effectively removed, we only set up for adding new 'authority' users
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'authority', // Default and only role
        authority_id: null, // Explicitly null for non-applicable fields
        university_id: null,
        college_id: null,
        department_id: null,
        is_active: true,
      });
    }
  }, [isOpen, isEditMode]); // isEditMode is kept for logical consistency, though it's always false

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'role') return; // Role is fixed
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const dataToSend = { ...formData };

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
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <div className="relative">
            <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
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

          <div className="flex items-center">
            <input id="is_active" name="is_active" type="checkbox" checked={!!formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Is Active</label>
          </div>

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