import React, { useState } from 'react';
import { X, Calendar, Globe, Building2, Book, GraduationCap, Users, Mail, Phone, MapPin, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';
import ConfirmDeleteDialog from '../../../components/ui/ConfirmDeleteDialog';
import { deleteCollege } from '../../../api/collegeApi';
import { ROLES } from '../../../constants';

// --- CollegePopup Component ---
function CollegePopup({ college, onClose, onUpdate, canEdit = true, userRole, loggedInUser, onCollegeDeleted }) {
  const { translateCollege } = useNamespacedTranslation();
  const [editedCollege, setEditedCollege] = useState({
    email: college.email || '',
    website: college.website || '',
    address: college.address || '',
    logo: college.logo || '',
    head_name: college.head_name || '',
    description: college.description || '',
    established: college.established || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Determine if the current user has edit permission
  const hasEditPermission = userRole === 'college' && canEdit;
  
  // Check if current user is university and can delete college
  const canDelete = loggedInUser?.role === ROLES.UNIVERSITY;
  
  const handleDeleteCollege = async () => {
    if (!canDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCollege(college.id);
      if (onCollegeDeleted) {
        onCollegeDeleted(college.id);
      }
      onClose();
    } catch (error) {
      console.error('Failed to delete college:', error);
      // Handle error appropriately
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return translateCollege('form.notSpecified');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCollege((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!hasEditPermission) return;
    
    const updatedCollegeData = {
      ...college,
      ...editedCollege,
    };
    if (onUpdate) {
      await onUpdate(updatedCollegeData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    if (hasEditPermission) {
      setIsEditing(!isEditing);
    }
  };

  // Mock stats - in real app these would come from college data
  const mockStats = {
    departments: college.departments?.length || 0,
    programs: college.programsCount || Math.floor(Math.random() * 50) + 10,
    students: college.studentsCount || Math.floor(Math.random() * 1000) + 200,
    faculty: college.facultyCount || Math.floor(Math.random() * 100) + 25,
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-auto h-full max-h-screen animate-fadeIn">
        {/* Header with college logo and name */}
        <div className="relative">
          {/* Background header image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
            aria-label={translateCollege('actions.closePopup')}
          >
            <X size={20} />
          </button>
          
          {/* College logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ bottom: "-64px" }}>
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                {college.logo ? (
                  <img
                    src={college.logo || `https://picsum.photos/seed/${college.id}/800/600`}
                    alt={`${college.name} logo`}
                    className="object-cover w-full h-full rounded-full"
                    onError={(e) => (e.target.src = `https://picsum.photos/seed/${college.id}/800/600`)}
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-blue-400" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* College name and details */}
        <div className="text-center pt-20 pb-6 px-6">
          <h2 className="text-2xl font-bold text-gray-800">{college.name}</h2>
          {college.head_name && (
            <p className="text-gray-500 mt-1">{translateCollege('form.headOfCollege')}: {college.head_name}</p>
          )}
          <div className="flex items-center justify-center mt-2 flex-wrap gap-2">
            {college.established && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                {translateCollege('form.established')}: {college.established}
              </span>
            )}
            {college.established && <span className="text-gray-300">•</span>}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Globe className="w-3 h-3 mr-1" />
              {isEditing ? translateCollege('actions.editing') : translateCollege('card.established')}
            </span>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 mb-8">
          <StatCard 
            icon={<Book className="w-5 h-5 text-blue-500" />} 
            title={translateCollege('form.departments')} 
            value={mockStats.departments} 
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={<GraduationCap className="w-5 h-5 text-purple-500" />} 
            title={translateCollege('card.programs')} 
            value={mockStats.programs}
            bgColor="bg-purple-50"
          />
          <StatCard 
            icon={<Users className="w-5 h-5 text-green-500" />} 
            title={translateCollege('card.students')} 
            value={mockStats.students}
            bgColor="bg-green-50"
          />
          <StatCard 
            icon={<Users className="w-5 h-5 text-amber-500" />} 
            title={translateCollege('card.faculty')} 
            value={mockStats.faculty}
            bgColor="bg-amber-50"
          />
        </div>
        
        {isEditing && hasEditPermission ? (
          /* Edit Form */
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column - Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </span>
                  {translateCollege('form.contactInformation')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={editedCollege.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.website')}</label>
                    <input
                      type="url"
                      name="website"
                      value={editedCollege.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.address')}</label>
                    <textarea
                      name="address"
                      value={editedCollege.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.headOfCollege')}</label>
                    <input
                      type="text"
                      name="head_name"
                      value={editedCollege.head_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right column - Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </span>
                  {translateCollege('form.additionalInfo')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.logoUrl')}</label>
                    <input
                      type="url"
                      name="logo"
                      value={editedCollege.logo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.establishedYear')}</label>
                    <input
                      type="number"
                      name="established"
                      value={editedCollege.established}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{translateCollege('form.aboutCollege')}</label>
                    <textarea
                      name="description"
                      value={editedCollege.description}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                </span>
                {translateCollege('form.contactInformation')}
              </h3>
              
              <div className="space-y-4">
                {college.email && (
                  <ContactItem 
                    icon={<Mail className="w-4 h-4 text-gray-500" />} 
                    label={translateCollege('form.email')}
                    value={<a href={`mailto:${college.email}`} className="text-blue-600 hover:underline">{college.email}</a>}
                  />
                )}
                
                {college.website && (
                  <ContactItem 
                    icon={<ExternalLink className="w-4 h-4 text-gray-500" />} 
                    label={translateCollege('form.website')}
                    value={
                      <a 
                        href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {college.website.replace(/^https?:\/\//i, '')}
                        <ExternalLink className="ml-1 w-3 h-3" />
                      </a>
                    }
                  />
                )}
                
                {college.address && (
                  <ContactItem 
                    icon={<MapPin className="w-4 h-4 text-gray-500" />} 
                    label={translateCollege('form.address')}
                    value={college.address}
                  />
                )}
                
                {college.head_name && (
                  <ContactItem 
                    icon={<Users className="w-4 h-4 text-gray-500" />} 
                    label={translateCollege('form.headOfCollege')}
                    value={college.head_name}
                  />
                )}
              </div>
              
              {/* System information */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {translateCollege('form.systemInformation')}
                </h3>
                
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{translateCollege('form.registrationDate')}:</span>
                    <span className="font-medium">{formatDate(college.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{translateCollege('form.collegeId')}:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{college.id || translateCollege('form.notSpecified')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Description & Departments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <Book className="w-4 h-4 text-indigo-600" />
                </span>
                {translateCollege('form.aboutCollege')}
              </h3>
              
              {college.description ? (
                <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                  <p>{college.description}</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-6">
                  <p className="text-sm">{translateCollege('form.noDescriptionAvailable')}</p>
                </div>
              )}

              {/* Departments */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">{translateCollege('form.departments')}</h4>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md min-h-[80px] border border-gray-200">
                  {college.departments && college.departments.length > 0 ? college.departments.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 flex items-center text-sm"
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
        )}
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 mt-8 flex justify-between items-center border-t">
          {/* Delete button - only show for university users */}
          {canDelete && !isEditing && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              {translateCollege('actions.deleteCollege')}
            </button>
          )}
          
          {/* Edit button - only show for college users */}
          {hasEditPermission && !isEditing && (
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              <Book size={16} />
              {translateCollege('actions.editCollege')}
            </button>
          )}
          
          {/* Spacer for when no action buttons are shown */}
          {!canDelete && !hasEditPermission && <div></div>}
          
          {/* Save/Cancel buttons in edit mode */}
          {isEditing && hasEditPermission && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                {translateCollege('actions.cancel')}
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-colors"
              >
                {translateCollege('actions.saveChanges')}
              </button>
            </div>
          )}
          
          {/* Close button */}
          {!isEditing && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
              {translateCollege('actions.closePopup')}
            </button>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteCollege}
          title={translateCollege('delete.title')}
          message={translateCollege('delete.warning', { name: college.name })}
          confirmationText={college.name}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}

// Helper component for displaying contact items
function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="ml-3">
        <h4 className="text-xs font-medium text-gray-500">{label}</h4>
        <div className="text-sm text-gray-800">{value || 'Not available'}</div>
      </div>
    </div>
  );
}

// Helper component for stat cards
function StatCard({ icon, title, value, bgColor = "bg-gray-50" }) {
  return (
    <div className={`rounded-lg ${bgColor} p-4 flex items-center justify-between`}>
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <div>
          <h4 className="text-xs font-medium text-gray-500">{title}</h4>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default CollegePopup;