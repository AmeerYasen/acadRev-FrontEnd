import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Mail, Globe, MapPin, User, FileText, Calendar,
  Pencil, X, Save, Loader2, AlertCircle, Shield, Briefcase
} from "lucide-react";
import CollegeCard from './components/CollegeCard';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';

// --- Define field components outside CollegeStaffView ---

const TextField = ({ label, name, value, icon, editable = true, isEditing, onChangeInput, translateCollege }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">
      {icon}
    </div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing && editable ? (
        <input
          type="text"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChangeInput}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
        />
      ) : (
        <p className="text-gray-800 mt-1 font-medium">{value || translateCollege('form.notProvided')}</p>
      )}
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, icon, isEditing, onChangeInput, translateCollege }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">
      {icon}
    </div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChangeInput}
          rows={3}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
        />
      ) : (
        <p className="text-gray-800 mt-1 whitespace-pre-line font-medium">{value || translateCollege('form.notProvided')}</p>
      )}
    </div>
  </div>
);

const UrlField = ({ label, name, value, icon, isEditing, onChangeInput, translateCollege }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">
      {icon}
    </div>
    <div className="flex-1 min-w-0"> {/* min-w-0 allows flex item to shrink below content size */}
      <label htmlFor={name} className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing ? (
        <input
          type="url"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChangeInput}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
          placeholder="https://"
        />
      ) : (
        <a 
          href={value || '#'}
          target="_blank" 
          rel="noopener noreferrer"
          className={`mt-1 block font-medium break-all ${value ? 'text-blue-600 hover:underline' : 'text-gray-800 cursor-default'}`}
        >
          {value || translateCollege('form.notProvided')}
        </a>
      )}
    </div>
  </div>
);

const EmailField = ({ label, name, value, icon, isEditing, onChangeInput, translateCollege }) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">
      {icon}
    </div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">{label}</label>
      {isEditing ? (
        <input
          type="email"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChangeInput}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
        />
      ) : (
        <a 
          href={value ? `mailto:${value}` : '#'}
          className={`mt-1 block font-medium ${value ? 'text-blue-600 hover:underline' : 'text-gray-800 cursor-default'}`}
        >
          {value || translateCollege('form.notProvided')}
        </a>
      )}
    </div>
  </div>
);

// --- End of field components ---

const CollegeStaffView = ({ user, colleges, onUpdateCollege, openCollegePopup }) => {
  const { translateCollege } = useNamespacedTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Determine if user should see staff view (college or department users)
  const shouldShowStaffView = user?.role === 'college' || user?.role === 'department';
  const collegeForStaffView = shouldShowStaffView && colleges && colleges.length > 0 ? colleges[0] : null;
  const isCollegeRole = user?.role === 'college'; // Only college users can edit

  useEffect(() => {
    if (shouldShowStaffView && collegeForStaffView) {
      setFormData({
        name: collegeForStaffView.name || '',
        email: collegeForStaffView.email || '',
        website: collegeForStaffView.website || '',
        address: collegeForStaffView.address || '',
        logo: collegeForStaffView.logo || '',
        head_name: collegeForStaffView.head_name || '',
      });
    }
    console.log(collegeForStaffView);
  }, [collegeForStaffView, shouldShowStaffView]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      if (collegeForStaffView) {
        setFormData({
          name: collegeForStaffView.name || '',
          email: collegeForStaffView.email || '',
          website: collegeForStaffView.website || '',
          address: collegeForStaffView.address || '',
          logo: collegeForStaffView.logo || '',
          head_name: collegeForStaffView.head_name || '',
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!collegeForStaffView) return;

    try {
      setSaving(true);
      const { name, ...restOfData } = formData; // Extract non-editable fields name and rest of data
      const updatedCollegeData = {
        id: collegeForStaffView.id,
        university_id: collegeForStaffView.university_id, // Keep non-editable fields like id, university_id
        ...restOfData // Apply changes from the form
      };

      await onUpdateCollege(updatedCollegeData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating college from staff view:", error);
      // Optionally, display an error message to the user within this component
    } finally {
      setSaving(false);
    }
  };

  if (shouldShowStaffView) {
    if (!collegeForStaffView) {
      return (
        <div className="max-w-3xl mx-auto p-6 bg-yellow-50 border border-yellow-100 rounded-lg mt-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{translateCollege('errors.collegeInfoNotAvailable')}</h3>
              <div className="mt-2 text-sm text-yellow-700">{translateCollege('empty.noCollegeData')}</div>
            </div>
          </div>
        </div>
      );
    }

    // Use formData when editing, otherwise collegeForStaffView
    const displayData = isEditing ? formData : collegeForStaffView;
    
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 h-48 md:h-60"></div>
            <div className="absolute bottom-0 w-full transform translate-y-1/2">
              <div className="px-6 flex flex-col md:flex-row items-center">
                <div className="h-32 w-32 rounded-xl overflow-hidden bg-white border-4 border-white shadow-xl">
                  {collegeForStaffView.logo ? (
                    <img 
                      src={collegeForStaffView.logo}
                      alt={translateCollege('staffView.collegeLogo', { name: collegeForStaffView.name })}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${collegeForStaffView.id}/800/600`;
                       }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-4 px-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {collegeForStaffView.name}
                  </h1>
                  <div className="text-blue-600 text-lg mt-1 font-medium">
                    {translateCollege('staffView.collegeInformation')}
                  </div>
                </div>
                
                {isCollegeRole && (
                  <div className="flex gap-2 mt-4 md:mt-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition-colors"
                        >
                          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                          {saving ? translateCollege('staffView.saving') : translateCollege('actions.saveChanges')}
                        </button>
                        <button
                          onClick={handleEditToggle}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow transition-colors"
                        >
                          <X size={18} />
                          {translateCollege('actions.cancel')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors"
                      >
                        <Pencil size={18} />
                        {translateCollege('actions.editDetails')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {isEditing && isCollegeRole && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-blue-800">{translateCollege('staffView.editingMode')}</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      {translateCollege('staffView.editingInstructions')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  {translateCollege('staffView.collegeDetails')}
                </h2>
                <div className="space-y-4">
                  <EmailField 
                    label={translateCollege('form.email')} 
                    name="email" 
                    value={displayData.email} 
                    icon={<Mail className="text-blue-600" size={20} />} 
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                  <UrlField 
                    label={translateCollege('form.website')} 
                    name="website" 
                    value={displayData.website} 
                    icon={<Globe className="text-blue-600" size={20} />} 
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                  <TextAreaField 
                    label={translateCollege('form.address')} 
                    name="address" 
                    value={displayData.address} 
                    icon={<MapPin className="text-blue-600" size={20} />} 
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  {translateCollege('staffView.administrativeInfo')}
                </h2>
                <div className="space-y-4">
                  <TextField 
                    label={translateCollege('form.headOfCollege')} 
                    name="head_name" 
                    value={displayData.head_name} 
                    icon={<User className="text-blue-600" size={20} />} 
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                  <TextField 
                    label={translateCollege('form.universityId')} 
                    name="university_id" 
                    value={collegeForStaffView.university_id} 
                    icon={<Building2 className="text-blue-600" size={20} />} 
                    editable={false}
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                  <TextField 
                    label={translateCollege('form.dateEstablished')} 
                    name="created_at" 
                    value={new Date(collegeForStaffView.created_at).toLocaleDateString()} 
                    icon={<Calendar className="text-blue-600" size={20} />} 
                    editable={false}
                    isEditing={isEditing}
                    onChangeInput={handleInputChange}
                    translateCollege={translateCollege}
                  />
                </div>
              </div>
            </div>
            
            {/* Logo URL field - only visible in edit mode and spans full width */}
            {isEditing && (
              <div className="mt-6">
                <UrlField 
                  label={translateCollege('form.logoUrl')} 
                  name="logo" 
                  value={displayData.logo} 
                  icon={<FileText className="text-blue-600" size={20} />} 
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateCollege={translateCollege}
                />
              </div>
            )}
          </div>
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
      <p className="text-center text-gray-500 text-lg font-medium">{translateCollege('empty.noColleges')}</p>
      <p className="text-center text-gray-400 mt-2">{translateCollege('empty.noCollegeData')}</p>
    </div>
  );
};

export default CollegeStaffView;