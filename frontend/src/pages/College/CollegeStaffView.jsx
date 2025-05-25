import React, { useState, useEffect } from 'react';
import CollegeCard from './components/CollegeCard';

const CollegeStaffView = ({ user, colleges, onUpdateCollege, openCollegePopup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Assuming for 'college' role, 'colleges' array will contain their specific college.
  const collegeForCollegeRole = user?.role === 'college' && colleges && colleges.length > 0 ? colleges[0] : null;

  useEffect(() => {
    if (user?.role === 'college' && collegeForCollegeRole) {
      setFormData({
        name: collegeForCollegeRole.name || '',
        email: collegeForCollegeRole.email || '',
        website: collegeForCollegeRole.website || '',
        address: collegeForCollegeRole.address || '',
        logo: collegeForCollegeRole.logo || '',
        head_name: collegeForCollegeRole.head_name || '',
      });
    }
  }, [collegeForCollegeRole, user?.role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original college data
    if (collegeForCollegeRole) {
      setFormData({
        name: collegeForCollegeRole.name || '',
        email: collegeForCollegeRole.email || '',
        website: collegeForCollegeRole.website || '',
        address: collegeForCollegeRole.address || '',
        logo: collegeForCollegeRole.logo || '',
        head_name: collegeForCollegeRole.head_name || '',
      });
    }
  };

  const handleSave = async () => {
    if (!collegeForCollegeRole) {return};

    const { name, ...restOFData } = formData; // Extract non-editable fields name and rest of data
    // Assuming 'restOFData' contains the rest of the fields that can be edited
    const updatedCollegeData = {
      id: collegeForCollegeRole.id,
      university_id: collegeForCollegeRole.university_id, // Keep non-editable fields like id, university_id
      ...restOFData // Apply changes from the form
    };



    try {
      await onUpdateCollege(updatedCollegeData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating college from staff view:", error);
      // Optionally, display an error message to the user within this component
    }
  };

  const renderDetailField = (label, value, name, type = "text", isEditable = true, multiline = false) => {
    if (isEditing && isEditable) {
      if (multiline) {
        return (
          <div className="mb-5">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea
              id={name}
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
            />
          </div>
        );
      }
      return (
        <div className="mb-5">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
          />
        </div>
      );
    }
    // Improved display for non-editable fields
    return (
      <div className="mb-5 py-2 border-b border-gray-100 last:border-b-0">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</span>
          <span className="text-gray-800 font-medium">
            {value ? (
              type === 'url' && value.startsWith('http') ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {value}
                </a>
              ) : type === 'email' ? (
                <a href={`mailto:${value}`} className="text-primary hover:underline">
                  {value}
                </a>
              ) : (
                value
              )
            ) : (
              <span className="text-gray-400 italic">Not provided</span>
            )}
          </span>
        </div>
      </div>
    );
  };


  if (user?.role === 'college') {
    if (!collegeForCollegeRole) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-white shadow-lg rounded-lg p-8">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-center text-gray-500 text-lg">College information is not available.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header with College Name and Edit Button */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? `Editing: ${collegeForCollegeRole.name}` : collegeForCollegeRole.name}
          </h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-150 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Details
            </button>
          )}
        </div>
        
        <div className="p-6 md:p-8">
          {/* Logo and Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Section */}
            <div className="md:col-span-1">
              {collegeForCollegeRole.logo ? (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-center">
                  <img 
                    src={collegeForCollegeRole.logo} 
                    alt={`${collegeForCollegeRole.name} logo`} 
                    className="max-h-48 max-w-full object-contain" 
                  />
                </div>
              ) : (
                <div className="mb-6 bg-gray-50 p-8 rounded-lg border border-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              
              {isEditing && renderDetailField("Logo URL", formData.logo, "logo")}
              
              {/* Read-only information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">Administrative Information</h3>
                {renderDetailField("University ID", collegeForCollegeRole.university_id, "university_id", "text", false)}
                {renderDetailField("Date Established", new Date(collegeForCollegeRole.created_at).toLocaleDateString(), "created_at", "text", false)}
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 pb-2 border-b">College Details</h3>
              
              {renderDetailField("College Name", collegeForCollegeRole.name, "name", "text", false)}
              {renderDetailField("Email", collegeForCollegeRole.email, "email", "email", true)}
              {renderDetailField("Website", collegeForCollegeRole.website, "website", "url", true)}
              {renderDetailField("Head of College", collegeForCollegeRole.head_name, "head_name", "text", true)}
              {renderDetailField("Address", collegeForCollegeRole.address, "address", "text", true, true)}
            </div>
          </div>

          {/* Action Buttons for Edit Mode */}
          {isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-opacity-50 transition duration-150 font-medium"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For 'university' role or other non-admin/non-authority roles that see a list
  if (colleges && colleges.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map(college => (
          <CollegeCard
            key={college.id}
            college={college}
            onClick={() => openCollegePopup(college)}
          />
        ))}
      </div>
    );
  }
  
  // Empty state with illustration
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <p className="text-center text-gray-500 text-lg font-medium">No colleges to display.</p>
      <p className="text-center text-gray-400 mt-2">No college data is currently available for your account.</p>
    </div>
  );
};

export default CollegeStaffView;