import React from 'react';
import { X, Mail, University, School, Building, UserCheck, Shield, CheckSquare, Users as UsersIcon, User, Briefcase, Key, Image } from 'lucide-react';

// Helper function for Role Styling (passed as prop or imported from a shared util)
// const getRoleStyle = (role) => { ... }; 

function UserDetailModal({ user, isOpen, onClose, getRoleStyle, translateUsers }) {
  if (!isOpen || !user) return null;

  const roleStyle = getRoleStyle(user.role);
  const RoleIcon = roleStyle.icon;

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
        <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm">
            {translateUsers('actions.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;