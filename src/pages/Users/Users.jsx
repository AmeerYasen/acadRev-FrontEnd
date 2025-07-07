"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, University, School, Building, UserCheck, Shield, CheckSquare, Users as UsersIcon, User, PlusCircle, Briefcase, Key, Eye, EyeOff } from 'lucide-react'; // Removed Edit3, Trash2
import { getUsers, createUser } from '../../api/userAPI'; // Updated to use new userAPI
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import {ROLES} from '../../constants/index.js'; // Import roles constant if needed

// Import the extracted modal components
import UserDetailModal from './UserDetailModal';
import AddEditUserModal from './AddEditUserModal';

// --- Helper Function for Role Styling ---
// This function is used by UserCard and UserDetailModal.
// It can stay here or be moved to a shared utils file and imported where needed.
const getRoleStyle = (role) => {
  const styles = {
    admin:     { icon: Shield,      classes: 'bg-red-100 text-red-700 border-red-300' },
    authority: { icon: Briefcase,   classes: 'bg-orange-100 text-orange-700 border-orange-300' },
    university:{ icon: University,  classes: 'bg-purple-100 text-purple-700 border-purple-300' },
    college:   { icon: School,      classes: 'bg-blue-100 text-blue-700 border-blue-300' },
    department:{ icon: Building,    classes: 'bg-teal-100 text-teal-700 border-teal-300' },
    default:   { icon: UserCheck,   classes: 'bg-gray-100 text-gray-700 border-gray-300' },
  };
  return styles[role] || styles.default;
};

// const ALL_ROLES = ['admin', 'authority', 'university', 'college', 'department']; // No longer needed here if AddEditUserModal handles role fixed

// --- User Card Component ---
function UserCard({ user, onView, translateUsers }) {
  const roleStyle = getRoleStyle(user.role);
  const RoleIcon = roleStyle.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden border border-blue-200 flex flex-col group hover:border-blue-400">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="w-22 h-22 rounded-full m-3 bg-blue-100 flex items-center justify-center border-2 border-blue-300 group-hover:border-blue-500 transition-colors flex-shrink-0">
             <img 
                src={user.image_url || `https://picsum.photos/seed/${user.id}/150/150`} 
                alt={translateUsers('fields.userImage')}
                className="w-22 h-22 rounded-full object-cover border-2 border-blue-200"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${user.id}/150/150`;
                }}
              />
          </div>
          <div className="ml-4 overflow-hidden">
            <h3 className="text-lg font-bold text-blue-800 truncate" title={user.username}>
              {user.username}
            </h3>
            <p className="text-sm text-blue-500">{translateUsers('fields.id')}: {String(user.id).padStart(3, '0')}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm mb-4 flex-grow">
          <div className="flex items-center text-blue-600" title={user.email}>
            <Mail size={14} className="mr-2 flex-shrink-0 text-blue-400" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.university_id && user.role ==ROLES.UNIVERSITY && (
            <div className="flex items-center text-blue-600">
              <University size={14} className="mr-2 flex-shrink-0 text-blue-400" />
              <span className="truncate">{translateUsers('fields.universityId')}: {user.university_id}</span>
            </div>
          )}
          {user.authority_id && user.role == ROLES.AUTHORITY && (
            <div className="flex items-center text-blue-600">
              <Briefcase size={14} className="mr-2 flex-shrink-0 text-blue-400" />
              <span className="truncate">
                {user.authority_name ? user.authority_name : `${translateUsers('fields.authorityId')}: ${user.authority_id}`}
              </span>
            </div>
          )}
          {user.college_id && user.role == ROLES.COLLEGE&& (
            <div className="flex items-center text-blue-600">
              <School size={14} className="mr-2 flex-shrink-0 text-blue-400" />
              <span className="truncate">{translateUsers('fields.collegeId')}: {user.college_id}</span>
            </div>
          )}
          {user.department_id && user.role == ROLES.DEPATMENT && (
            <div className="flex items-center text-blue-600">
              <Building size={14} className="mr-2 flex-shrink-0 text-blue-400" />
              <span className="truncate">{translateUsers('fields.departmentId')}: {user.department_id}</span>
            </div>
          )}
        </div>
        <div className="pt-3 border-t border-blue-100 ">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${roleStyle.classes}`}>
            <RoleIcon size={14} />
            {translateUsers(`roles.${user.role}`)}
          </span>
        </div>
      </div>
      <div className="bg-blue-50 p-2 flex mt-auto space-x-2 border-t border-blue-100">
        <button onClick={() => onView(user)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors" title={translateUsers('actions.view')}>
          <Eye size={18}/>
        </button>
      </div>
    </div>
  );
}

// --- User Detail Modal (Component is now imported) ---
// --- Add/Edit User Modal (Component is now imported) ---
// --- InputField (Moved to AddEditUserModal.jsx) ---


// --- Main Users Page Component ---
function UsersPage() {
  const { translateUsers } = useNamespacedTranslation();
  const [loggedInUser, setLoggedInUser] = useState({ role: 'admin', id: 1 }); 
  const [authLoading, setAuthLoading] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    if (loggedInUser?.role !== 'admin') return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [loggedInUser?.role]);

  useEffect(() => {
    if (loggedInUser?.role === 'admin') {
      loadUsers();
    }
  }, [loadUsers, loggedInUser?.role]);

  const handleViewUser = (user) => {
    setSelectedUserForView(user);
    setIsViewModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveUser = async (createdAuthority) => {
    try {
      // The authority has already been created by the modal
      // Just refresh the users list to show the new authority
      loadUsers(); 
    } catch (err) {
      // Error handling for authority creation is handled in the modal
      console.error("Add authority user failed:", err);
      // Optionally set a page-level error if needed
    }
  };

  const handleUserDeleted = async (deletedUserId) => {
    try {
      // Remove the deleted user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUserId));
      // Optionally refresh the users list to ensure consistency
      await loadUsers();
    } catch (err) {
      console.error("Failed to refresh users after deletion:", err);
      // Optionally set a page-level error if needed
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg">{translateUsers('loadingAuth')}</p></div>;
  }

  if (loggedInUser?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 lg:p-8 text-center bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-blue-200 max-w-md mx-auto mt-20">
          <Shield size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-red-700">{translateUsers('errors.accessDenied')}</h1>
          <p className="text-blue-600 mt-2">{translateUsers('errors.adminOnly')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">{translateUsers('title')}</h1>
          <p className="text-blue-600 mt-1">{translateUsers('subtitle')}</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150"
        >
          <PlusCircle size={20} />
          {translateUsers('addAuthorityUser')}
        </button>
      </div>

      {isLoading && <p className="text-center text-blue-600">{translateUsers('loading')}</p>}
      {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md border border-red-200">{translateUsers('errors.loadingError')}: {error}</p>}
      
      {!isLoading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onView={handleViewUser}
              translateUsers={translateUsers}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
         <div className="text-center py-16 text-blue-600 bg-white rounded-lg shadow border border-blue-200">
            <UsersIcon size={48} className="mx-auto mb-4 text-blue-400" />
            <p className="text-lg font-medium">{translateUsers('messages.noUsers')}</p>
            <p className="text-sm">{translateUsers('messages.startAdding')}</p>
         </div>
      )}

      <UserDetailModal
        user={selectedUserForView}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        getRoleStyle={getRoleStyle} // Pass getRoleStyle as a prop
        translateUsers={translateUsers}
        loggedInUser={loggedInUser}
        onUserDeleted={handleUserDeleted}
      />

      <AddEditUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveUser}
        // userToEdit is no longer relevant as we only add
        loggedInUserRole={loggedInUser?.role} // Still passed for context if needed inside modal
        translateUsers={translateUsers}
      />

      {/* Global styles for animations (optional) */}
     
    </div>
  );
}

export default UsersPage;
