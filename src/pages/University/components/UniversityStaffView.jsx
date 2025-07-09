import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { fetchMyUniversity, editUniversity } from "../../../api/universityApi";
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Phone,
  User,
  FileText,
  Calendar,
  Pencil,
  X,
  Save,
  Loader2,
  AlertCircle,
  Shield,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

// --- Define field components outside UniversityStaffView ---

const TextField = ({
  label,
  name,
  value,
  icon,
  editable = true,
  isEditing,
  onChangeInput,
  translateUniversity,
}) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">{icon}</div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">
        {label}
      </label>
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
        <p className="text-gray-800 mt-1 font-medium">
          {value || translateUniversity("staffView.noData")}
        </p>
      )}
    </div>
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  icon,
  isEditing,
  onChangeInput,
  translateUniversity,
}) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">{icon}</div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">
        {label}
      </label>
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
        <p className="text-gray-800 mt-1 whitespace-pre-line font-medium">
          {value || translateUniversity("staffView.noData")}
        </p>
      )}
    </div>
  </div>
);

const UrlField = ({
  label,
  name,
  value,
  icon,
  isEditing,
  onChangeInput,
  translateUniversity,
}) => (
  <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="mt-1 p-2 bg-blue-50 rounded-md">{icon}</div>
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-500">
        {label}
      </label>
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
          href={value || "#"} // Provide a fallback href
          target="_blank"
          rel="noopener noreferrer"
          // Conditionally style if no value to avoid looking like a broken link
          className={`mt-1 block font-medium ${
            value
              ? "text-blue-600 hover:underline"
              : "text-gray-800 cursor-default"
          }`}
        >
          {value || translateUniversity("staffView.noData")}
        </a>
      )}
    </div>
  </div>
);

// --- End of field components ---

/**
 * Staff view component for university information
 * Allows university users to edit their information
 */
export default function UniversityStaffView() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { translateUniversity } = useNamespacedTranslation();
  const isUniversityRole = user?.role === "university";

  const [universityData, setUniversityData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Define loadUniversityData in the component scope, wrapped with useCallback
  const loadUniversityData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMyUniversity();
      setUniversityData(data);
      setEditableData(JSON.parse(JSON.stringify(data)));
      setError(null);
    } catch (err) {
      console.error("Failed to load university data:", err);
      const errorMessage = translateUniversity("staffView.errors.loadFailed");
      setError(errorMessage);
      showError(errorMessage); // Show toast for loading errors as well
    } finally {
      setLoading(false);
    }
  }, [showError]); // Add showError as a dependency for useCallback

  useEffect(() => {
    loadUniversityData();
  }, [loadUniversityData]); // Call loadUniversityData on mount

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []); // setEditableData is stable, so empty dependency array is fine

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes by deep copying original data again
      setEditableData(JSON.parse(JSON.stringify(universityData)));
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!editableData) {
        showError(translateUniversity("staffView.errors.noDataToSave"));
        setSaving(false);
        return;
      }

      const { name, ...dataToSend } = editableData;

      console.log("Data being sent to backend for update:", dataToSend);

      await editUniversity(dataToSend);

      showSuccess(translateUniversity("staffView.messages.updateSuccess"));
      await loadUniversityData(); // Now correctly calls the function in scope

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update university:", err);
      let errorMessage = translateUniversity("staffView.errors.updateFailed");
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 font-medium">
            {translateUniversity("staffView.loading")}
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-100 rounded-lg mt-8">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {translateUniversity("staffView.errors.errorOccurred")}
            </h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );

  if (!universityData)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-yellow-50 border border-yellow-100 rounded-lg mt-8">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              {translateUniversity("staffView.errors.universityNotFound")}
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              {translateUniversity("staffView.errors.noUniversityInfo")}
            </div>
          </div>
        </div>
      </div>
    );

  // Use editableData when editing, otherwise universityData. Fallback to universityData if editableData is somehow null.
  const displayData = isEditing
    ? editableData || universityData
    : universityData;

  // This check is an additional safeguard, though unlikely to be hit if universityData is present.
  if (!displayData) {
    console.warn(
      "Display data is null, check state logic for editableData initialization."
    );
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-600 font-medium">
          {translateUniversity("staffView.errors.informationUnavailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 h-48 md:h-60"></div>
          <div className="absolute bottom-0 w-full transform translate-y-1/2">
            <div className="px-6 flex flex-col md:flex-row items-center">
              <div className="h-32 w-32 rounded-xl overflow-hidden bg-white border-4 border-white shadow-xl">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayData.username || "Gest"
                  )}&background=4f46e5&color=fff&size=48&rounded=true`}
                  alt={translateUniversity("staffView.universityLogo", {
                    name:
                      displayData.name ||
                      translateUniversity("staffView.defaultUniversityName"),
                  })}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300?text=University";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-4 px-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {displayData.name}
                </h1>
                {/* Render abbreviation input/text. Show input if editing and property exists, otherwise display value. */}
                <div className="text-blue-600 text-lg mt-1 font-medium">
                  {isEditing ? (
                    <input
                      type="text"
                      name="abbreviation"
                      value={displayData.abbreviation || ""}
                      onChange={handleInputChange}
                      className="w-48 p-1 bg-gray-50 border border-gray-300 rounded-md"
                      placeholder={translateUniversity(
                        "staffView.abbreviationPlaceholder"
                      )}
                    />
                  ) : (
                    displayData.abbreviation || "" // Display empty string if null/undefined to avoid 'false' or 'null' text
                  )}
                </div>
              </div>

              {isUniversityRole && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition-colors"
                      >
                        {saving ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Save size={18} />
                        )}
                        {saving
                          ? translateUniversity("staffView.saving")
                          : translateUniversity("staffView.saveChanges")}
                      </button>
                      <button
                        onClick={handleEditToggle}
                        disabled={saving} // Disable cancel while saving
                        className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow transition-colors"
                      >
                        <X size={18} />
                        {translateUniversity("staffView.cancel")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors"
                    >
                      <Pencil size={18} />
                      {translateUniversity("staffView.editInformation")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing && isUniversityRole && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-blue-600 shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h3 className="font-medium text-blue-800">
                    {translateUniversity("staffView.editingMode")}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1">
                    {translateUniversity("staffView.editingInstructions")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-600" />
                {translateUniversity("staffView.universityInformation")}
              </h2>
              <div className="space-y-4">
                <TextField
                  label={translateUniversity("staffView.fields.email")}
                  name="email"
                  value={displayData.email}
                  icon={<Mail className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
                <UrlField
                  label={translateUniversity("staffView.fields.website")}
                  name="website"
                  value={displayData.website}
                  icon={<Globe className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
                <TextAreaField
                  label={translateUniversity("staffView.fields.address")}
                  name="address"
                  value={displayData.address}
                  icon={<MapPin className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
                <TextField
                  label={translateUniversity("staffView.fields.phone")}
                  name="phone"
                  value={displayData.phone}
                  icon={<Phone className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                {translateUniversity("staffView.additionalDetails")}
              </h2>
              <div className="space-y-4">
                <TextField
                  label={translateUniversity("staffView.fields.presidentDean")}
                  name="head_name"
                  value={displayData.head_name}
                  icon={<User className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
                <TextField
                  label={translateUniversity("staffView.fields.established")}
                  name="since"
                  value={displayData.since}
                  icon={<Calendar className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
                <TextField
                  label={translateUniversity("staffView.fields.country")}
                  name="country"
                  value={displayData.country}
                  icon={<Building2 className="text-blue-600" size={20} />}
                  isEditing={isEditing}
                  onChangeInput={handleInputChange}
                  translateUniversity={translateUniversity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
