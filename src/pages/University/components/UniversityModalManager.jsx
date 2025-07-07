import React, { useState } from "react";
import UniversityStaffView from "./UniversityStaffView";
import UniversityAdminViewModal from "./UniversityAdminViewModal";
import UniversityAddModal from "./UniversityAddModal";

export default function UniversityModalManager({ 
  isOpen, 
  onClose, 
  onSave, // This is handleSaveUniversity from University.jsx
  universityData,
  mode,     // "add", "edit", "view", "view-staff"
  userRole,  // "admin", "authority", "university"
  loggedInUser,
  onUniversityDeleted
}) {
  // Internal state for admin/authority toggling from view to edit mode
  // for an existing university.
  const [isInternalEditMode, setIsInternalEditMode] = useState(false);
  
  if (!isOpen) return null;
  
  const handleClose = () => {
    setIsInternalEditMode(false); // Reset internal edit mode on any close
    onClose();
  };

  // This function is called by the modals (AddModal, StaffView in edit mode)
  // It then calls the onSave prop (handleSaveUniversity in University.jsx)
  // with the correct 'isEditing' flag.
  const handleSave = async (formDataFromModal, isModalIndicatingEditing) => {
    let finalIsEditing;

    if (mode === 'add') {
        finalIsEditing = false; // Adding a new university is never editing an existing one
    } else if (isInternalEditMode) { 
        // Admin/Authority was viewing, then clicked "Edit" inside UniversityAdminViewModal
        finalIsEditing = true;
    } else if (typeof isModalIndicatingEditing === 'boolean') {
        // Modal (e.g., UniversityStaffView) explicitly states if it's editing
        finalIsEditing = isModalIndicatingEditing;
    } else {
        // Fallback: if mode from parent is 'edit', assume editing.
        finalIsEditing = (mode === 'edit');
    }

    await onSave(formDataFromModal, finalIsEditing); // Call parent onSave (e.g., handleSaveUniversity)
    
    // If admin/authority was editing (toggled via internal isInternalEditMode), revert to view display.
    if (isInternalEditMode) { 
      setIsInternalEditMode(false); 
    }
    // Note: UniversityAddModal and UniversityStaffView (in edit mode) typically call their own onClose
    // after a successful save. If not, handleClose() might be needed here.
  };

  // Called from UniversityAdminViewModal when admin/authority clicks "Edit"
  const handleEditClick = () => { 
    setIsInternalEditMode(true);
  };

  // Determine which modal to display based on mode and userRole
  
  // Case 1: Adding a new university (for admin/authority)
  if (mode === "add" && (userRole === "admin" || userRole === "authority")) {
    return (
      <UniversityAddModal
        isOpen={isOpen}
        onClose={handleClose} // UniversityAddModal will call this
        onSave={handleSave}  // UniversityAddModal will call this with (formData)
        // No universityData needed for adding
      />
    );
  } 
  // // Case 2: Admin/Authority was viewing (in UniversityAdminViewModal) and clicked "Edit"
  // else if (isInternalEditMode && (userRole === "admin" || userRole === "authority") && universityData) {
  //   // The original code used UniversityStaffView for admin editing an existing university.
  //   // This could potentially be a more specific AdminEditModal in the future.
  //   return (
  //     <UniversityStaffView 
  //       isOpen={isOpen}
  //       onClose={handleClose}
  //       onSave={handleSave} // UniversityStaffView calls this with (formData, true)
  //       universityData={universityData}
  //       isEditing={true} // Explicitly tell UniversityStaffView it's in edit mode
  //     />
  //   );
  // } 
  // Case 2: Admin/Authority viewing a specific university (with option to edit)
  else if (mode === "view" && universityData && (userRole === "admin" || userRole === "authority")) {
    return (
      <UniversityAdminViewModal 
        isOpen={isOpen}
        onClose={handleClose}
        universityData={universityData}
        onEdit={handleEditClick} // This sets isInternalEditMode = true
        userRole={userRole}
        loggedInUser={loggedInUser}
        onUniversityDeleted={onUniversityDeleted}
      />
    );
  } 
  // // Case 4: University staff viewing their own university details (read-only from this entry point)
  // // Parent University.jsx might set mode to "view-staff" or similar for this.
  // else if (mode === "view-staff" && universityData && userRole === "university") {
  //   return (
  //     <UniversityStaffView // This component is also used for staff viewing their own uni
  //       isOpen={isOpen}
  //       onClose={handleClose}
  //       universityData={universityData}
  //       // onSave is not typically needed for a pure view modal from this path
  //       // isEditing is implicitly false or not relevant for view-only
  //     />
  //   );
  // } 
  // // Case 5: University staff editing their own university details
  // // Parent University.jsx sets mode to "edit" for this.
  // else if (mode === "edit" && universityData && userRole === "university") {
  //   return (
  //     <UniversityStaffView
  //       isOpen={isOpen}
  //       onClose={handleClose}
  //       onSave={handleSave} // UniversityStaffView calls this with (formData, true)
  //       universityData={universityData}
  //       isEditing={true} // Pass this prop to indicate university staff is editing their own info
  //     />
  //   );
  // }
  
  // Fallback if no condition is met (should ideally not happen with correct parent logic)
  // console.warn("UniversityModalManager: No modal rendered for mode:", mode, "role:", userRole, "isInternalEditMode:", isInternalEditMode);
  return null; 
}