import React, { useState } from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

// --- CollegePopup Component ---
function CollegePopup({ college, onClose, onUpdate, canEdit = true, userRole }) {
  const { translateCollege } = useNamespacedTranslation();
  const [editedCollege, setEditedCollege] = useState({
    email: college.email || '',
    website: college.website || '',
    address: college.address || '',
    logo: college.logo || '',
    head_name: college.head_name || '',
    description: college.description || '',
    established: college.established || ''
    // name removed from editable fields
  });
  const [departments, setDepartments] = useState(college.departments || []);
  const [isEditing, setIsEditing] = useState(false);
  
  // Determine if the current user has edit permission
  const hasEditPermission = userRole === 'college' && canEdit;
  
  const formattedDate = college.created_at 
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(college.created_at))
    : 'N/A';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCollege((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    // Only proceed if user has permission
    if (!hasEditPermission) return;
    
    const updatedCollegeData = {
      ...college, // original college data (including id, universityId, and name)
      ...editedCollege, // edited fields
      departments: departments,
    };
    if (onUpdate) {
      await onUpdate(updatedCollegeData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    // Only allow toggling if user has permission
    if (hasEditPermission) {
      setIsEditing(!isEditing);
    }
  };

  const renderField = (label, value, name, type = "text", multiline = false) => {
    // For college name, always render as non-editable regardless of isEditing state
    if (name === "name") {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <p className="text-gray-900 font-medium">{value || translateCollege('form.notSpecified')}</p>
        </div>
      );
    }
    
    if (isEditing && hasEditPermission) {
      if (multiline) {
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea
              name={name}
              value={editedCollege[name]}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base transition-all duration-200"
              placeholder={translateCollege('form.placeholderText', { field: label.toLowerCase() })}
            />
          </div>
        );
      }
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={editedCollege[name]}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-base transition-all duration-200"
            placeholder={translateCollege('form.placeholderText', { field: label.toLowerCase() })}
          />
        </div>
      );
    }
    
    // Display mode
    if (name === 'logo' && value) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <img 
            src={value} 
            alt={`${college.name} logo`} 
            className="h-24 object-contain border border-gray-200 rounded-md p-2 bg-white"
          />
        </div>
      );
    }
    
    if (name === 'website' && value) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-primary hover:text-primary-dark hover:underline transition-colors duration-200"
          >
            {value}
          </a>
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
        <p className="text-gray-900">{value || translateCollege('form.notSpecified')}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-100 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white py-8 px-8 rounded-xl shadow-2xl max-w-5xl w-full relative max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-primary rounded-t-xl"></div>
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label={translateCollege('actions.closePopup')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-primary text-2xl font-bold">
            {isEditing ? translateCollege('actions.editCollegeDetails') : college.name}
          </h2>
        </div>

        {isEditing && hasEditPermission ? (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              {renderField(translateCollege('form.collegeName'), college.name, "name")} {/* Always non-editable */}
              {renderField(translateCollege('form.email'), editedCollege.email, "email", "email")}
              {renderField(translateCollege('form.website'), editedCollege.website, "website", "url")}
              {renderField(translateCollege('form.headOfCollege'), editedCollege.head_name, "head_name")}
              {renderField(translateCollege('form.establishedYear'), editedCollege.established, "established", "number")}
            </div>
            <div>
              {renderField(translateCollege('form.logoUrl'), editedCollege.logo, "logo")}
              {renderField(translateCollege('form.address'), editedCollege.address, "address", "text", true)}
              {renderField(translateCollege('form.aboutCollege'), editedCollege.description, "description", "text", true)}
              
              {/* Departments section is now read-only even in edit mode */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{translateCollege('form.departments')}</h3>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md min-h-[80px] border border-gray-200">
                  {departments && departments.length > 0 ? departments.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center"
                    >
                      <span>{dept}</span>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-sm italic flex items-center justify-center w-full">{translateCollege('empty.noDepartments')}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {translateCollege('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {translateCollege('actions.saveChanges')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                {renderField(translateCollege('form.collegeName'), college.name, "name")}
                {renderField(translateCollege('form.email'), college.email, "email")}
                {renderField(translateCollege('form.website'), college.website, "website")}
                {renderField(translateCollege('form.headOfCollege'), college.head_name, "head_name")}
                {renderField(translateCollege('form.established'), college.established, "established")}
                {renderField(translateCollege('form.registrationDate'), formattedDate, "created_at")}
              </div>
              <div>
                {renderField(translateCollege('form.logo'), college.logo, "logo")}
                {renderField(translateCollege('form.address'), college.address, "address")}
                {renderField(translateCollege('form.aboutCollege'), college.description, "description")}

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{translateCollege('form.departments')}</h3>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md min-h-[80px] border border-gray-200">
                    {departments && departments.length > 0 ? departments.map((dept, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center"
                      >
                        <span>{dept}</span>
                      </div>
                    )) : (
                      <div className="text-gray-400 text-sm italic flex items-center justify-center w-full">{translateCollege('empty.noDepartments')}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit button only appears for college role */}
            {hasEditPermission && (
              <div className="pt-4 mt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={toggleEditMode}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {translateCollege('actions.editCollege')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CollegePopup;