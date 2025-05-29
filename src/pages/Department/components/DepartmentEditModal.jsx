import React, { useState, useEffect } from 'react';
import { ROLES } from '../../../constants'; // Ensure ROLES is correctly imported

const DepartmentEditModal = ({ department, isOpen, onClose, onUpdate, userRole }) => { // Removed canEdit from props
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
        established: department.created_at || '', // Assuming created_at is the source for established year
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
          <p className="text-gray-900 font-medium">{value || 'Not specified'}</p>
        </div>
      );
    }
    
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
              placeholder={`Enter ${label.toLowerCase()}...`}
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
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      );
    }
    
    if (name === 'logo' && value) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <img 
            src={value} 
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
        <p className="text-gray-900">{value || 'Not specified'}</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white py-8 px-8 rounded-xl shadow-2xl max-w-3xl w-full relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600 rounded-t-xl"></div>
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-blue-600 text-2xl font-bold">
            {isEditing ? "Edit Department Details" : (editedDepartment.name || "Department Details")}
          </h2>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              {renderField("Department Name", editedDepartment.name, "name")}
              {renderField("Department Code", editedDepartment.code, "code")}
              {renderField("Email", editedDepartment.email, "email", "email")}
              {renderField("Website", editedDepartment.website, "website", "url")}
              {renderField("Head of Department", editedDepartment.head_name, "head_name")}
            </div>
            <div>
              {renderField("Established Year", editedDepartment.established, "established", "number")}
              {renderField("Logo URL", editedDepartment.logo, "logo")}
              {renderField("Address", editedDepartment.address, "address", "text", true)}
              {renderField("About Department", editedDepartment.description, "description", "text", true)}
            </div>
            
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel Edit
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                {renderField("Department Name", editedDepartment.name, "name")}
                {renderField("Department Code", editedDepartment.code, "code")}
                {renderField("Email", editedDepartment.email, "email")}
                {renderField("Website", editedDepartment.website, "website")}
                {renderField("Head of Department", editedDepartment.head_name, "head_name")}
                {renderField("Established", editedDepartment.established, "established")}
                {renderField("Registration Date", formattedDate, "created_at")}
              </div>
              <div>
                {renderField("Logo", editedDepartment.logo, "logo")}
                {renderField("Address", editedDepartment.address, "address")}
                {renderField("About Department", editedDepartment.description, "description")}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Programs</h3>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                    {programs && programs.length > 0 ? (
                      programs.map((prog, index) => (
                        <div
                          key={prog.id || index}
                          className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100"
                        >
                          <span>{prog.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm italic">No programs listed</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show Edit button only if the user has permission */}
            {showEditButton && (
              <div className="pt-4 mt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={toggleEditMode}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Department
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