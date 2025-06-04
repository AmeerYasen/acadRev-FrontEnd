import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../../constants';

const ProgramEditModal = ({ program, isOpen, onClose, onUpdate, userRole }) => {
  const navigate = useNavigate();
  const [editedProgram, setEditedProgram] = useState({
    name: '',
    language: '',
    website: '',
    head_name: '',
    established: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (program) {      setEditedProgram({
        name: program.name || '',
        language: program.language || '',
        website: program.website || '',
        head_name: program.head_name || program.program_head || '',
        established: program.created_at || '',
      });
      setIsEditing(false); // Reset editing mode when program changes
    }
  }, [program]);

  if (!isOpen || !program) return null;

  // Only DEPARTMENT role can edit programs
  const showEditButton = userRole === ROLES.DEPARTMENT;

  const formattedDate = program.created_at
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(program.created_at))
    : 'N/A';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    
    const updatedProgramData = {
      ...program,
      ...editedProgram,
    };
    if (onUpdate) {
      await onUpdate(updatedProgramData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    if (showEditButton) {
      setIsEditing(!isEditing);
    }
  };
  const renderField = (label, value, name, type = "text", multiline = false) => {
    if (name === "name") {
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
              value={editedProgram[name]}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          </div>
        );
      }
        if (name === "language") {
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
              name={name}
              value={editedProgram[name]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
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
        );
      }
      
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={editedProgram[name]}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
            placeholder={`Enter ${label.toLowerCase()}...`}
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
            {isEditing ? "Edit Program Details" : (editedProgram.name || "Program Details")}
          </h2>
        </div>

        {isEditing ? (          <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              {renderField("Program Name", editedProgram.name, "name")}
              {renderField("Language", editedProgram.language, "language")}
              {renderField("Website", editedProgram.website, "website", "url")}
            </div>
            <div>
              {renderField("Program Head", editedProgram.head_name, "head_name")}
              {renderField("Established Year", editedProgram.established, "established", "number")}
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
          <>            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                {renderField("Program Name", editedProgram.name, "name")}
                {renderField("Language", editedProgram.language, "language")}
                {renderField("Website", editedProgram.website, "website")}
                {renderField("Program Head", editedProgram.head_name, "head_name")}
                {renderField("Registration Date", formattedDate, "created_at")}
              </div>
              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Department Info</h3>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {program.department_name && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Department:</span> {program.department_name}
                      </div>
                    )}
                    {program.college_name && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">College:</span> {program.college_name}
                      </div>
                    )}
                    {program.university_name && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">University:</span> {program.university_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>            </div>
            
            {/* Assessment Buttons - Hidden when department role is editing */}
            {!isEditing && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                  <button
                    onClick={() => {
                      navigate(`/quantitative/${program.id || program.program_id}`);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Quantitative Indicators</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate(`/qualitative/${program.id || program.program_id}`);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Qualitative Indicators</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate(`/report/${program.id || program.program_id}`);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Self-Assessment Report</span>
                  </button>
                </div>
              </div>
            )}
            
            {showEditButton && (
              <div className="pt-4 mt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={toggleEditMode}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Program
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramEditModal;
