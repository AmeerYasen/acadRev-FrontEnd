"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentUser,updateUser } from './function'; // Adjust path as needed
import { UserCircle, Mail, Shield, Briefcase, University, School, Building, CheckCircle, XCircle, CalendarDays, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an auth context



const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from your auth context

  useEffect(() => {
    if (!user) {
      setError("User is not logged in. Please log in.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUser();
        setProfileData(data);
      } catch (err) {
        setError(err.message || "Could not load profile data.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin': return { icon: <Shield className="w-5 h-5 text-red-500" />, label: 'Administrator' };
      case 'authority': return { icon: <Briefcase className="w-5 h-5 text-orange-500" />, label: 'Authority' };
      case 'university': return { icon: <University className="w-5 h-5 text-purple-500" />, label: 'University Staff' };
      case 'college': return { icon: <School className="w-5 h-5 text-blue-500" />, label: 'College Staff' };
      case 'department': return { icon: <Building className="w-5 h-5 text-teal-500" />, label: 'Department Staff' };
      default: return { icon: <UserCircle className="w-5 h-5 text-gray-500" />, label: 'User' };
    }
  };

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-500">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md font-medium text-gray-800">
          {value === null || value === undefined || value === '' ? <span className="italic text-gray-400">N/A</span> : String(value)}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-lg font-medium text-gray-700">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 lg:p-8 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md max-w-lg mx-auto">
          <div className="flex items-center">
            <AlertTriangle size={24} className="mr-3 text-red-500" />
            <div>
              <h2 className="text-xl font-semibold">Error</h2>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
       <div className="container mx-auto p-6 lg:p-8 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-md shadow-md max-w-lg mx-auto">
          <div className="flex items-center">
            <Info size={24} className="mr-3 text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold">No Profile Data</h2>
              <p className="mt-1">Could not find profile information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(profileData.role);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <div className="relative mb-4 sm:mb-0">
              <UserCircle size={80} className="p-2 bg-white/20 rounded-full text-white" />
               <span className={`absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white ${profileData.is_active ? 'bg-green-500' : 'bg-red-500'}`} title={profileData.is_active ? 'Active' : 'Inactive'}></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profileData.username}</h1>
              <p className="text-indigo-200 flex items-center mt-1">
                {roleInfo.icon}
                <span className="ml-2">{roleInfo.label}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Account Details</h2>
          <DetailItem icon={<Mail className="w-5 h-5" />} label="Email Address" value={profileData.email} />
          <DetailItem 
            icon={profileData.is_active ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />} 
            label="Account Status" 
            value={profileData.is_active ? 'Active' : 'Inactive'} 
          />
          <DetailItem icon={<CalendarDays className="w-5 h-5" />} label="Member Since" value={new Date(profileData.created_at).toLocaleDateString()} />
          
          {(profileData.authority_id || profileData.university_id || profileData.college_id || profileData.department_id) && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 pt-6 mb-4 border-b pb-2">Organizational Information</h2>
              {profileData.authority_id && <DetailItem icon={<Briefcase className="w-5 h-5" />} label="Authority ID" value={profileData.authority_id} />}
              {profileData.university_id && <DetailItem icon={<University className="w-5 h-5" />} label="University ID" value={profileData.university_id} />}
              {profileData.college_id && <DetailItem icon={<School className="w-5 h-5" />} label="College ID" value={profileData.college_id} />}
              {profileData.department_id && <DetailItem icon={<Building className="w-5 h-5" />} label="Department ID" value={profileData.department_id} />}
            </>
          )}
        </div>
        
        {/* Placeholder for Edit Profile Button */}
         <div className="p-6 border-t border-gray-200 text-right">
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition duration-150">
            Edit Profile
          </button>
        </div> 
      </div>
    </div>
  );
};

export default ProfilePage;