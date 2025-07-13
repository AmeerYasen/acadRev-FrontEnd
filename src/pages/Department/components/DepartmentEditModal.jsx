import React, { useState, useEffect } from 'react';
import { ROLES } from '../../../constants'; // Ensure ROLES is correctly imported
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';
import { editDepartment } from '../../../api/departmentAPI';
import { formatDisplayDate } from '../../../utils/dateUtils'; // Assuming you have a utility for date formatting

const DepartmentEditModal = ({ department, isOpen, onClose, onUpdate, userRole }) => { // Removed canEdit from props
  const { translateDepartment } = useNamespacedTranslation();
  
  const [editedDepartment, setEditedDepartment] = useState({
    name: '',
    code: '',
    email: '',
    website: '',
    address: '',
    logo: '',
    head_name: '',
    description: '',
    established: '',
  });
  
  const [programs, setPrograms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const getPrograms = (programsInfo) => {
    if (!programsInfo || typeof programsInfo !== 'string') return [];
    // Split the semicolon-separated string and parse id:name pairs
    return programsInfo.split(';').map((prog) => {
      const [id, name] = prog.trim().split(':');
      return { id: id || '', name: name || '' };
    }).filter(prog => prog.name); // Filter out any invalid entries
  };

  useEffect(() => {
    if (department) {
      setEditedDepartment({
        name: department.name || '',
        code: department.code || '',
        email: department.email || '',
        website: department.website || '',
        address: department.address || '',
        logo: department.logo || '',
        head_name: department.head_name || '',
        description: department.description || '',
        established: formatDisplayDate(department.created_at) || '', // Assuming created_at is the source for established year
      });
      setPrograms(getPrograms(department.programs_info));
      setIsEditing(false); // Reset editing mode when department changes
    }
  }, [department]);

  if (!isOpen || !department) return null;

  // Determine if the current user has permission to initiate editing.
  // This controls the visibility of the "Edit Department" button.
  const showEditButton = userRole === ROLES.DEPARTMENT; // Simplified: only DEPARTMENT role can see the edit button

  const formattedDate = department.created_at
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(department.created_at))
    : 'N/A';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    // Permission to submit is implicitly handled by `isEditing` being true,
    // which can only be set if `showEditButton` was true.
    if (!isEditing) return;
    
    const updatedDepartmentData = {
      ...department,
      ...editedDepartment,
      programs_info: programs.map(p => `${p.id}:${p.name}`).join('; '), // Format back to backend-compatible string
    };
    if (onUpdate) {
      await onUpdate(updatedDepartmentData);
    }
    setIsEditing(false); // Exit editing mode after submit
  };

  const toggleEditMode = () => {
    // Only allow toggling to edit mode if the user has permission (showEditButton is true)
    if (showEditButton) {
      setIsEditing(!isEditing);
    }
  };

  const renderField = (label, value, name, type = "text", multiline = false) => {
    if (name === "name" && !isEditing) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <p className="text-gray-900 font-medium">{value || translateDepartment('modal.fields.notSpecified')}</p>
        </div>
      );
    }
    
    // Helper function to get placeholder text
    const getPlaceholder = (fieldName) => {
      const placeholderMap = {
        'name': 'enterDepartmentName',
        'code': 'enterDepartmentCode', 
        'email': 'enterEmail',
        'website': 'enterWebsite',
        'head_name': 'enterHeadName',
        'established': 'enterEstablishedYear',
        'logo': 'enterLogoUrl',
        'address': 'enterAddress',
        'description': 'enterDescription'
      };
      
      const placeholderKey = placeholderMap[fieldName];
      return placeholderKey ? translateDepartment(`modal.placeholders.${placeholderKey}`) : `Enter ${label.toLowerCase()}...`;
    };
    
    if (isEditing) {
      if (multiline) {
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea
              name={name}
              value={editedDepartment[name]}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
              placeholder={getPlaceholder(name)}
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
            value={editedDepartment[name]}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
            placeholder={getPlaceholder(name)}
          />
        </div>
      );
    }
    
    if (name === 'logo' && value) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <img 
            src={editDepartment.logo} 
            alt={`${editedDepartment.name} logo`} 
            className="h-24 object-contain border border-gray-200 rounded-md p-2 bg-white shadow-sm"
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
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {value}
          </a>
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
        <p className="text-gray-900">{value || translateDepartment('modal.fields.notSpecified')}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-100 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white py-8 px-8 rounded-xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 rounded-t-xl"></div>
        
        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-gray-100 backdrop-blur-sm z-10"
          onClick={onClose}
          aria-label={translateDepartment('modal.closePopup')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Logo and Title Section */}
        <div className="relative mb-8 pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo Display */}
            <div className="mb-4">
              {editedDepartment.logo ? (
                <div className="relative">
                  <img 
                    src={editedDepartment.logo} 
                    alt={`${editedDepartment.name} logo`} 
                    className="h-20 w-20 object-contain bg-white rounded-xl border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80x80?text=DEPT";
                    }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 10h10M7 13h10" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-white text-2xl font-bold mb-2">
              {isEditing ? translateDepartment('modal.editTitle') : (editedDepartment.name || translateDepartment('modal.title'))}
            </h2>
            
            {/* Subtitle */}
            {department.college_name && (
              <p className="text-blue-100 text-sm">
                {department.college_name}
                {department.university_name && ` • ${department.university_name}`}
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderField(translateDepartment('modal.fields.departmentName'), editedDepartment.name, "name")}
                {renderField(translateDepartment('modal.fields.departmentCode'), editedDepartment.code, "code")}
                {renderField(translateDepartment('modal.fields.email'), editedDepartment.email, "email", "email")}
                {renderField(translateDepartment('modal.fields.website'), editedDepartment.website, "website", "url")}
                {renderField(translateDepartment('modal.fields.headOfDepartment'), editedDepartment.head_name, "head_name")}
              </div>
              <div className="space-y-6">
                {renderField(translateDepartment('modal.fields.establishedYear'), editedDepartment.established, "established", "number")}
                {renderField(translateDepartment('modal.fields.logoUrl'), editedDepartment.logo, "logo")}
                {renderField(translateDepartment('modal.fields.address'), editedDepartment.address, "address", "text", true)}
                {renderField(translateDepartment('modal.fields.aboutDepartment'), editedDepartment.description, "description", "text", true)}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {translateDepartment('modal.actions.cancelEdit')}
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                {translateDepartment('modal.actions.saveChanges')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderField(translateDepartment('modal.fields.departmentName'), editedDepartment.name, "name")}
                {renderField(translateDepartment('modal.fields.departmentCode'), editedDepartment.code, "code")}
                {renderField(translateDepartment('modal.fields.email'), editedDepartment.email, "email")}
                {renderField(translateDepartment('modal.fields.website'), editedDepartment.website, "website")}
                {renderField(translateDepartment('modal.fields.headOfDepartment'), editedDepartment.head_name, "head_name")}
                {renderField(translateDepartment('modal.fields.establishedYear'), editedDepartment.established, "established")}
                {renderField(translateDepartment('modal.fields.registrationDate'), formattedDate, "created_at")}
              </div>
              <div className="space-y-6">
                {renderField(translateDepartment('modal.fields.address'), editedDepartment.address, "address")}
                {renderField(translateDepartment('modal.fields.aboutDepartment'), editedDepartment.description, "description")}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {translateDepartment('modal.fields.programs')}
                  </h3>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {programs && programs.length > 0 ? (
                      programs.map((prog, index) => (
                        <div
                          key={prog.id || index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-blue-200"
                        >
                          <span>{prog.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm italic flex items-center justify-center w-full h-16">
                        {translateDepartment('modal.programs.noProgramsListed')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show Edit button only if the user has permission */}
            {showEditButton && (
              <div className="pt-6 mt-8 border-t border-gray-200 flex justify-end">
                <button
                  onClick={toggleEditMode}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {translateDepartment('modal.actions.editDepartment')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentEditModal;