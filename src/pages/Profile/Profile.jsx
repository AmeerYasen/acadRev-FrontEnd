"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, patchUser } from "../../api/userAPI";
import {
  UserCircle,
  Mail,
  Shield,
  Briefcase,
  University,
  School,
  Building,
  CheckCircle,
  XCircle,
  CalendarDays,
  AlertTriangle,
  Info,
  Image,
  Edit,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Assuming you have an auth context

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
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
        const data = await getUserProfile(user.id);
        setProfileData(data);
        setEditImageUrl(data.image_url || ""); // Initialize edit field
      } catch (err) {
        setError(err.message || "Could not load profile data.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleEditMode = () => {
    setIsEditMode(true);
    setEditImageUrl(profileData.image_url || "");
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditImageUrl(profileData.image_url || "");
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const updatedData = {
        image_url: editImageUrl,
      };

      const response = await patchUser(updatedData);
      setProfileData({ ...profileData, ...updatedData });
      setIsEditMode(false);
    } catch (err) {
      setError(err.message || "Could not update profile.");
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case "admin":
        return {
          icon: <Shield className="w-5 h-5 text-red-500" />,
          label: "Administrator",
        };
      case "authority":
        return {
          icon: <Briefcase className="w-5 h-5 text-orange-500" />,
          label: "Authority",
        };
      case "university":
        return {
          icon: <University className="w-5 h-5 text-purple-500" />,
          label: "University Staff",
        };
      case "college":
        return {
          icon: <School className="w-5 h-5 text-blue-500" />,
          label: "College Staff",
        };
      case "department":
        return {
          icon: <Building className="w-5 h-5 text-teal-500" />,
          label: "Department Staff",
        };
      default:
        return {
          icon: <UserCircle className="w-5 h-5 text-gray-500" />,
          label: "User",
        };
    }
  };

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 py-3 border-b border-blue-100 last:border-b-0">
      <span className="text-blue-500">{icon}</span>
      <div>
        <p className="text-sm text-blue-600">{label}</p>
        <p className="text-md font-medium text-blue-800">
          {value === null || value === undefined || value === "" ? (
            <span className="italic text-blue-400">N/A</span>
          ) : (
            String(value)
          )}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-lg font-medium text-blue-700">
            Loading Profile...
          </p>
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto border-2 border-blue-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <div className="relative mb-4 sm:mb-0">
              {profileData.image_url ? (
                <img
                  src={profileData.image_url}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.username || "Gest"
                    )}&background=4f46e5&color=fff&size=128&rounded=true`;
                  }}
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileData.username || "Gest"
                  )}&background=4f46e5&color=fff&size=48&rounded=true`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <span
                className={`absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white ${
                  profileData.is_active ? "bg-green-500" : "bg-red-500"
                }`}
                title={profileData.is_active ? "Active" : "Inactive"}
              ></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profileData.username}</h1>
              <p className="text-blue-200 flex items-center mt-1">
                {roleInfo.icon}
                <span className="ml-2">{roleInfo.label}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-2 bg-white">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
            Account Details
          </h2>
          <DetailItem
            icon={<Mail className="w-5 h-5" />}
            label="Email Address"
            value={profileData.email}
          />
          <DetailItem
            icon={<Image className="w-5 h-5" />}
            label="Profile Image"
            value={
              <div className="flex items-center space-x-3">
                <img
                  src={
                    profileData.image_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.username || "Gest"
                    )}&background=4f46e5&color=fff&size=48&rounded=true`
                  }
                  alt="Profile thumbnail"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.username || "Gest"
                    )}&background=4f46e5&color=fff&size=48&rounded=true`;
                  }}
                />

                <span className="text-sm text-blue-600">
                  {profileData.image_url
                    ? "Custom profile image"
                    : "Generated placeholder image"}
                </span>
              </div>
            }
          />
          <DetailItem
            icon={<CalendarDays className="w-5 h-5" />}
            label="Member Since"
            value={new Date(profileData.created_at).toLocaleDateString()}
          />

          {(profileData.authority_id ||
            profileData.university_id ||
            profileData.college_id ||
            profileData.department_id) && (
            <>
              <h2 className="text-xl font-semibold text-blue-800 pt-6 mb-4 border-b border-blue-200 pb-2">
                Organizational Information
              </h2>
              {profileData.authority_id && (
                <DetailItem
                  icon={<Briefcase className="w-5 h-5" />}
                  label="Authority ID"
                  value={profileData.authority_id}
                />
              )}
              {profileData.university_id && (
                <DetailItem
                  icon={<University className="w-5 h-5" />}
                  label="University ID"
                  value={profileData.university_id}
                />
              )}
              {profileData.college_id && (
                <DetailItem
                  icon={<School className="w-5 h-5" />}
                  label="College ID"
                  value={profileData.college_id}
                />
              )}
              {profileData.department_id && (
                <DetailItem
                  icon={<Building className="w-5 h-5" />}
                  label="Department ID"
                  value={profileData.department_id}
                />
              )}
            </>
          )}
        </div>

        {/* Edit Profile Button */}
        <div className="p-6 border-t border-blue-200 text-right bg-blue-50">
          <button
            onClick={handleEditMode}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-150"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-blue-900/75 flex justify-center items-center z-100 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative border-2 border-blue-200">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-600"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="bg-blue-50 p-6 border-b border-blue-200 rounded-t-lg">
              <h2 className="text-xl font-semibold text-blue-800">
                Edit Profile
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-blue-700 mb-1"
                >
                  Profile Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="Enter image URL (optional)..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                />
              </div>

              {/* Image Preview */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                <img
                  src={
                    editImageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.username || "Gest"
                    )}&background=4f46e5&color=fff&size=48&rounded=true`
                  }
                  alt="Preview"
                  className="w-15 h-15 rounded-full object-cover border-2 border-blue-300"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.username || "Gest"
                    )}&background=4f46e5&color=fff&size=48&rounded=true`;
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-blue-700">Preview</p>
                  <p className="text-xs text-blue-500">
                    {editImageUrl ? "Custom image" : "Default placeholder"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-blue-200 bg-blue-50 rounded-b-lg flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 border border-blue-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
