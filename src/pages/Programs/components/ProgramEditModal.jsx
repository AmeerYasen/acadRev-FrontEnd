import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../constants";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import { deleteProgram } from "../../../api/programAPI";
import { useToast } from "../../../context/ToastContext";

const ProgramEditModal = ({
  program,
  isOpen,
  onClose,
  onUpdate,
  userRole,
  onProgramDeleted,
}) => {
  const navigate = useNavigate();
  const { translatePrograms } = useNamespacedTranslation();
  const { showSuccess, showError } = useToast();
  const [editedProgram, setEditedProgram] = useState({
    name: "",
    language: "",
    website: "",
    head_name: "",
    established: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (program) {
      setEditedProgram({
        name: program.program_name || "",
        language: program.language || "",
        website: program.website || "",
        head_name: program.head_name || program.program_head || "",
        established: program.created_at || "",
      });
      setIsEditing(false); // Reset editing mode when program changes
    }
  }, [program]);

  if (!isOpen || !program) return null;

  // Only DEPARTMENT role can edit programs
  const showEditButton = userRole === ROLES.DEPARTMENT;

  const formattedDate = program.created_at
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(program.created_at))
    : "N/A";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    const updatedProgramData = {
      ...program,
      ...editedProgram,
    };
    if (onUpdate) {
      await onUpdate(updatedProgramData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    if (showEditButton) {
      setIsEditing(!isEditing);
    }
  };

  // Check if current user is department and can delete program
  const canDelete = userRole === ROLES.DEPARTMENT;

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Delete the program using the program API
      await deleteProgram(program.id || program.program_id);

      // Show success message
      showSuccess(translatePrograms("messages.deleteSuccess"));

      // Notify parent component about the deletion
      if (onProgramDeleted) {
        onProgramDeleted(program.id || program.program_id);
      }

      onClose(); // Close the modal
    } catch (error) {
      console.error("Delete program error:", error);
      showError(translatePrograms("errors.deleteError"));
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
  const renderField = (
    label,
    value,
    name,
    type = "text",
    multiline = false
  ) => {
    const getPlaceholder = () => {
      switch (name) {
        case "name":
          return translatePrograms("modal.placeholders.enterProgramName");
        case "language":
          return translatePrograms("modal.placeholders.selectLanguage");
        case "website":
          return translatePrograms("modal.placeholders.enterWebsite");
        case "head_name":
          return translatePrograms("modal.placeholders.enterCoordinator");
        case "established":
          return translatePrograms("modal.placeholders.enterDuration");
        default:
          return `Enter ${label.toLowerCase()}...`;
      }
    };

    if (name === "name" && !isEditing) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <p className="text-gray-900 font-medium">
            {value || translatePrograms("modal.fields.notSpecified")}
          </p>
        </div>
      );
    }

    if (isEditing) {
      if (multiline) {
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <textarea
              name={name}
              value={editedProgram[name]}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
              placeholder={getPlaceholder()}
            />
          </div>
        );
      }
      if (name === "language") {
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              name={name}
              value={editedProgram[name]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
            >
              <option value="">
                {translatePrograms("modal.placeholders.selectLanguage")}
              </option>
              <option value="English">
                {translatePrograms("modal.fields.languages.english")}
              </option>
              <option value="Arabic">
                {translatePrograms("modal.fields.languages.arabic")}
              </option>
              <option value="French">
                {translatePrograms("modal.fields.languages.french")}
              </option>
              <option value="German">
                {translatePrograms("modal.fields.languages.german")}
              </option>
            </select>
          </div>
        );
      }

      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={editedProgram[name]}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200"
            placeholder={getPlaceholder()}
          />
        </div>
      );
    }

    if (name === "website" && value) {
      return (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {value}
          </a>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
        <p className="text-gray-900">
          {value || translatePrograms("modal.fields.notSpecified")}
        </p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-100 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white py-8 px-8 rounded-xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 rounded-t-xl"></div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-full w-10 h-10 flex items-center justify-center text-white hover:text-gray-100 backdrop-blur-sm z-10"
          onClick={onClose}
          aria-label={translatePrograms("modal.closePopup")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Logo and Title Section */}
        <div className="relative mb-8 pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Program Icon */}
            <div className="mb-4">
              <div className="h-20 w-20 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-white text-2xl font-bold mb-2">
              {isEditing
                ? translatePrograms("modal.editTitle")
                : editedProgram.name || translatePrograms("modal.title")}
            </h2>

            {/* Subtitle */}
            {program.department_name && (
              <p className="text-blue-100 text-sm">
                {program.department_name}
                {program.college_name && ` • ${program.college_name}`}
                {program.university_name && ` • ${program.university_name}`}
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderField(
                  translatePrograms("modal.fields.programName"),
                  editedProgram.name,
                  "name"
                )}
                {renderField(
                  translatePrograms("modal.fields.language"),
                  editedProgram.language,
                  "language"
                )}
                {renderField(
                  translatePrograms("modal.fields.website"),
                  editedProgram.website,
                  "website",
                  "url"
                )}
              </div>
              <div className="space-y-6">
                {renderField(
                  translatePrograms("modal.fields.coordinator"),
                  editedProgram.head_name,
                  "head_name"
                )}
                {renderField(
                  translatePrograms("modal.fields.established"),
                  editedProgram.established,
                  "established",
                  "number"
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {translatePrograms("modal.actions.cancelEdit")}
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                {translatePrograms("modal.actions.saveChanges")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-6">
                {renderField(
                  translatePrograms("modal.fields.programName"),
                  editedProgram.name,
                  "name"
                )}
                {renderField(
                  translatePrograms("modal.fields.language"),
                  editedProgram.language,
                  "language"
                )}
                {renderField(
                  translatePrograms("modal.fields.website"),
                  editedProgram.website,
                  "website"
                )}
                {renderField(
                  translatePrograms("modal.fields.coordinator"),
                  editedProgram.head_name,
                  "head_name"
                )}
                {renderField(
                  translatePrograms("modal.fields.established"),
                  formattedDate,
                  "created_at"
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 10h10M7 13h10"
                      />
                    </svg>
                    {translatePrograms("modal.fields.department")}{" "}
                    {translatePrograms("modal.fields.information")}
                  </h3>
                  <div className="space-y-3">
                    {program.department_name && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {translatePrograms("modal.fields.department")}:
                        </span>
                        <span className="text-sm text-gray-800">
                          {program.department_name}
                        </span>
                      </div>
                    )}
                    {program.college_name && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {translatePrograms("modal.fields.college")}:
                        </span>
                        <span className="text-sm text-gray-800">
                          {program.college_name}
                        </span>
                      </div>
                    )}
                    {program.university_name && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {translatePrograms("modal.fields.university")}:
                        </span>
                        <span className="text-sm text-gray-800">
                          {program.university_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Buttons - Hidden when department role is editing */}
            {!isEditing && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {translatePrograms("modal.assessmentTools.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      navigate(
                        `/quantitative/${program.id || program.program_id}`
                      );
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {translatePrograms(
                        "modal.assessmentTools.quantitativeIndicators"
                      )}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(
                        `/qualitative/${program.id || program.program_id}`
                      );
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {translatePrograms(
                        "modal.assessmentTools.qualitativeIndicators"
                      )}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/report/${program.id || program.program_id}`);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 group"
                  >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {translatePrograms(
                        "modal.assessmentTools.selfAssessmentReport"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {showEditButton && (
              <div className="pt-6 mt-8 border-t border-gray-200 flex justify-between items-center">
                {/* Delete button - only show for department users */}
                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    {translatePrograms("actions.delete")}
                  </button>
                )}

                {/* Spacer for when delete button is not shown */}
                {!canDelete && <div></div>}

                {/* Edit button */}
                <button
                  onClick={toggleEditMode}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 flex items-center shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {translatePrograms("modal.actions.editProgram")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title={translatePrograms("modal.deleteTitle")}
        message={translatePrograms("modal.deleteWarning")}
        resourceName={editedProgram?.name || program?.program_name || ""}
        confirmationText={editedProgram?.name || program?.program_name || ""}
        confirmButtonText={translatePrograms("actions.delete")}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProgramEditModal;
