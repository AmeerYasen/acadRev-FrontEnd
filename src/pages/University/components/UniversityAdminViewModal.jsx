import React, { useState } from "react";
import { X, Calendar, Globe, Building2, Book, GraduationCap, Users, Mail, Phone, MapPin, ExternalLink, Clock, Trash2 } from "lucide-react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import { deleteUniversity } from "../../../api/universityApi";
import { ROLES } from "../../../constants";

export default function UniversityAdminViewModal({ 
  isOpen, 
  onClose, 
  universityData,
  onEdit,
  userRole,
  loggedInUser,
  onUniversityDeleted
}) {
  const { translateUniversity } = useNamespacedTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!isOpen || !universityData) return null;

  // Mock data for visualization - normally this would come from props or context
  const mockStats = {
    colleges: universityData.collegesCount || Math.floor(Math.random() * 12) + 3,
    departments: universityData.departmentsCount || Math.floor(Math.random() * 50) + 15,
    programs: universityData.programsCount || Math.floor(Math.random() * 100) + 30,
    users: universityData.usersCount || Math.floor(Math.random() * 500) + 100,
    createdAt: universityData.createdAt || "2022-07-15T09:24:58.123Z",
    lastUpdated: universityData.lastUpdated || new Date().toISOString(),
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return translateUniversity('adminModal.noDate');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if current user is authority and can delete university
  const canDelete = loggedInUser?.role === ROLES.AUTHORITY;

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Delete the university using the university API
      await deleteUniversity(universityData.id);
      
      // Notify parent component about the deletion
      if (onUniversityDeleted) {
        onUniversityDeleted(universityData.id);
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error('Delete university error:', error);
      throw error; // Re-throw to let the confirmation dialog handle the error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-auto h-full max-h-screen animate-fadeIn">
        {/* Header with university logo and name */}
        <div className="relative">
          {/* Background header image */}
          <div className="h-48 bg-gradient-to-r from-indigo-600 to-blue-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
            aria-label={translateUniversity('adminModal.closeModal')}
          >
            <X size={20} />
          </button>
          
          {/* University logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ bottom: "-64px" }}>
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(universityData.name || "university")}/300/300`}
                  alt={translateUniversity('adminModal.universityLogo', { name: universityData.name || translateUniversity('adminModal.defaultUniversityName') })}
                  className="object-cover w-full h-full rounded-full"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=Uni")}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* University name and abbreviation */}
        <div className="text-center pt-20 pb-6 px-6">
          <h2 className="text-2xl font-bold text-gray-800">{universityData.name}</h2>
          {universityData.abbreviation && (
            <p className="text-gray-500 mt-1">({universityData.abbreviation})</p>
          )}
          <div className="flex items-center justify-center mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Calendar className="w-3 h-3 mr-1" />
              {translateUniversity('adminModal.established', { year: universityData.since || translateUniversity('adminModal.notAvailable') })}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Globe className="w-3 h-3 mr-1" />
              {universityData.country || translateUniversity('adminModal.international')}
            </span>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 mb-8">
          <StatCard 
            icon={<Building2 className="w-5 h-5 text-blue-500" />} 
            title={translateUniversity('adminModal.stats.colleges')} 
            value={mockStats.colleges} 
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon={<Book className="w-5 h-5 text-purple-500" />} 
            title={translateUniversity('adminModal.stats.departments')} 
            value={mockStats.departments}
            bgColor="bg-purple-50"
          />
          <StatCard 
            icon={<GraduationCap className="w-5 h-5 text-green-500" />} 
            title={translateUniversity('adminModal.stats.programs')} 
            value={mockStats.programs}
            bgColor="bg-green-50"
          />
          <StatCard 
            icon={<Users className="w-5 h-5 text-amber-500" />} 
            title={translateUniversity('adminModal.stats.users')} 
            value={mockStats.users}
            bgColor="bg-amber-50"
          />
        </div>
        
        {/* Contact details & description */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                <Mail className="w-4 h-4 text-indigo-600" />
              </span>
              {translateUniversity('adminModal.contactInformation')}
            </h3>
            
            <div className="space-y-4">
              {universityData.email && (
                <ContactItem 
                  icon={<Mail className="w-4 h-4 text-gray-500" />} 
                  label={translateUniversity('adminModal.contactLabels.email')}
                  value={<a href={`mailto:${universityData.email}`} className="text-blue-600 hover:underline">{universityData.email}</a>}
                />
              )}
              
              {universityData.phone && (
                <ContactItem 
                  icon={<Phone className="w-4 h-4 text-gray-500" />} 
                  label={translateUniversity('adminModal.contactLabels.phone')}
                  value={universityData.phone}
                />
              )}
              
              {universityData.address && (
                <ContactItem 
                  icon={<MapPin className="w-4 h-4 text-gray-500" />} 
                  label={translateUniversity('adminModal.contactLabels.address')}
                  value={universityData.address}
                />
              )}
              
              {universityData.website && (
                <ContactItem 
                  icon={<ExternalLink className="w-4 h-4 text-gray-500" />} 
                  label={translateUniversity('adminModal.contactLabels.website')}
                  value={
                    <a 
                      href={universityData.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {universityData.website.replace(/^https?:\/\//i, '')}
                      <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  }
                />
              )}
            </div>
            
            {/* System information */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {translateUniversity('adminModal.systemInformation')}
              </h3>
              
              <div className="text-xs text-gray-500 space-y-2">
                <div className="flex items-center justify-between">
                  <span>{translateUniversity('adminModal.systemLabels.created')}:</span>
                  <span className="font-medium">{formatDate(mockStats.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{translateUniversity('adminModal.systemLabels.lastUpdated')}:</span>
                  <span className="font-medium">{formatDate(mockStats.lastUpdated)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{translateUniversity('adminModal.systemLabels.recordId')}:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{universityData.id || translateUniversity('adminModal.notAvailable')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Book className="w-4 h-4 text-blue-600" />
              </span>
              {translateUniversity('adminModal.about')}
            </h3>
            
            {universityData.description ? (
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>{universityData.description}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                <p className="text-sm">{translateUniversity('adminModal.noDescriptionAvailable')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 mt-8 flex justify-between items-center border-t">
          {/* Delete button - only show for authority users */}
          {canDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              {translateUniversity('actions.delete')}
            </button>
          )}
          
          {/* Spacer for when delete button is not shown */}
          {!canDelete && <div></div>}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            {translateUniversity('adminModal.closeButton')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title={translateUniversity('adminModal.deleteTitle')}
        message={translateUniversity('adminModal.deleteWarning')}
        resourceName={universityData?.name || ''}
        confirmationText={universityData?.name || ''}
        confirmButtonText={translateUniversity('actions.delete')}
        isLoading={isDeleting}
      />
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
        <div className="text-sm text-gray-800">{value || translateUniversity('adminModal.noData')}</div>
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