import React, { useState } from 'react';
import { X, Mail, University, School, Building, UserCheck, Shield, CheckSquare, Users as UsersIcon, User, Briefcase, Key, Image, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '../../components/ui/ConfirmDeleteDialog';
import { deleteAuthority } from '../../api/authorityAPI';
import { deleteUser } from '../../api/userAPI';
import { ROLES } from '../../constants';

// Helper function for Role Styling (passed as prop or imported from a shared util)
// const getRoleStyle = (role) => { ... }; 

function UserDetailModal({ user, isOpen, onClose, getRoleStyle, translateUsers, loggedInUser, onUserDeleted }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const roleStyle = getRoleStyle(user.role);
  const RoleIcon = roleStyle.icon;

  // Check if current user is admin and viewing an authority user
  const canDelete = loggedInUser?.role === ROLES.ADMIN && user.role === ROLES.AUTHORITY;

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Delete both user and authority records
      // Delete the authority first
      if (user.authority_id) {
        await deleteAuthority(user.authority_id);
      }
      
      // Then delete the user record
      await deleteUser(user.id);
      
      // Notify parent component about the deletion
      if (onUserDeleted) {
        onUserDeleted(user.id);
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error('Delete user and authority error:', error);
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

  const detailItem = (IconComponent, label, value) => (
    <div className="flex items-start space-x-3 py-2.5 border-b border-gray-100 last:border-b-0">
      <IconComponent className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value === null || value === undefined || value === '' ? <span className="italic text-gray-400">{translateUsers('fields.notAvailable')}</span> : value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex justify-center items-center z-100 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors" aria-label={translateUsers('modal.closeModal')}>
          <X size={24} />
        </button>
        <div className="flex items-center p-5 border-b border-gray-200">
           <div className="w-22 h-22 m-3 rounded-full bg-indigo-100 flex items-center justify-center border flex-shrink-0 mr-4">
             <img 
                src={user.image_url || `https://picsum.photos/seed/${user.id}/100/100`} 
                alt={translateUsers('fields.userImage')}
                className="w-22 h-22 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${user.id}/100/100`;
                }}
              />
           </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-500">{translateUsers('fields.id')}: {String(user.id).padStart(3, '0')}</p>
          </div>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">
         
          {detailItem(Mail, translateUsers('fields.email'), user.email)}
          {detailItem(RoleIcon, translateUsers('fields.role'), translateUsers(`roles.${user.role}`))}
          {detailItem(Briefcase, translateUsers('fields.authorityName'), user.authority_name)}
          {detailItem(Key, translateUsers('fields.authorityId'), user.authority_id)}
          {detailItem(University, translateUsers('fields.universityId'), user.university_id)}
          {detailItem(School, translateUsers('fields.collegeId'), user.college_id)}
          {detailItem(Building, translateUsers('fields.departmentId'), user.department_id)}
          {detailItem(CheckSquare, translateUsers('fields.active'), user.is_active ? translateUsers('messages.yes') : translateUsers('messages.no'))}
          {detailItem(UsersIcon, translateUsers('fields.createdAt'), new Date(user.created_at).toLocaleString())}
           {detailItem(Image, translateUsers('fields.imageUrl'), 
            <div className="flex items-center space-x-3">
             
              <span className="text-sm text-gray-600">
                {user.image_url ? translateUsers('messages.customImage') : translateUsers('messages.placeholderImage')}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {/* Delete button - only show for admin users viewing authority users */}
          {canDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              {translateUsers('actions.delete')}
            </button>
          )}
          
          {/* Spacer for when delete button is not shown */}
          {!canDelete && <div></div>}
          
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm">
            {translateUsers('actions.close')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title={translateUsers('modal.deleteTitle')}
        message={translateUsers('modal.deleteWarning')}
        resourceName={user?.authority_name || user?.username}
        confirmationText={user?.authority_name || user?.username || ''}
        confirmButtonText={translateUsers('actions.delete')}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default UserDetailModal;