"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, University, School, Building, UserCheck, Shield, CheckSquare, Users as UsersIcon, User, PlusCircle, Briefcase, Key, Eye, EyeOff } from 'lucide-react'; // Removed Edit3, Trash2
import { fetchUsers, addUser } from './function'; // Removed updateUser, deleteUserApi as they are no longer used

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
function UserCard({ user, onView }) {
  const roleStyle = getRoleStyle(user.role);
  const RoleIcon = roleStyle.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden border border-gray-200 flex flex-col group">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-300 group-hover:border-indigo-500 transition-colors flex-shrink-0">
            <User size={32} className="text-indigo-500" />
          </div>
          <div className="ml-4 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 truncate" title={user.username}>
              {user.username}
            </h3>
            <p className="text-sm text-gray-500">ID: {String(user.id).padStart(3, '0')}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm mb-4 flex-grow">
          <div className="flex items-center text-gray-600" title={user.email}>
            <Mail size={14} className="mr-2 flex-shrink-0 text-gray-400" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.university_id && (
            <div className="flex items-center text-gray-600">
              <University size={14} className="mr-2 flex-shrink-0 text-gray-400" />
              <span className="truncate">Uni ID: {user.university_id}</span>
            </div>
          )}
          {/* Add similar displays for authority_id, college_id, department_id if needed */}
        </div>
        <div className="pt-3 border-t border-gray-100">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${roleStyle.classes}`}>
            <RoleIcon size={14} />
            {user.role}
          </span>
        </div>
      </div>
      <div className="bg-gray-50 p-2 flex justify-end space-x-2 border-t">
        <button onClick={() => onView(user)} className="p-1.5 text-gray-500 hover:text-indigo-600"><Eye size={18}/></button>
      </div>
    </div>
  );
}

// --- User Detail Modal (Component is now imported) ---
// --- Add/Edit User Modal (Component is now imported) ---
// --- InputField (Moved to AddEditUserModal.jsx) ---


// --- Main Users Page Component ---
function UsersPage() {
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
      const data = await fetchUsers();
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

  const handleSaveUser = async (userData) => {
    try {
      await addUser(userData);
      loadUsers(); 
    } catch (err) {
      // Error handling for addUser can be done here or within the modal,
      // for now, modal handles its own form error display.
      console.error("Add user failed:", err);
      // Optionally set a page-level error if needed
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading authentication...</p></div>;
  }

  if (loggedInUser?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 lg:p-8 text-center">
        <Shield size={48} className="mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
        <p className="text-gray-600 mt-2">This page is for administrators only.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Admin users can add authority users only</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition duration-150"
        >
          <PlusCircle size={20} />
          Add Authority User
        </button>
      </div>

      {isLoading && <p className="text-center text-gray-600">Loading users...</p>}
      {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">Error: {error}</p>}
      
      {!isLoading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onView={handleViewUser}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
         <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow">
            <UsersIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No users found.</p>
            <p className="text-sm">Start by adding authority users to the system.</p>
         </div>
      )}

      <UserDetailModal
        user={selectedUserForView}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        getRoleStyle={getRoleStyle} // Pass getRoleStyle as a prop
      />

      <AddEditUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveUser}
        // userToEdit is no longer relevant as we only add
        loggedInUserRole={loggedInUser?.role} // Still passed for context if needed inside modal
      />

      {/* Global styles for animations (optional) */}
     
    </div>
  );
}

export default UsersPage;
