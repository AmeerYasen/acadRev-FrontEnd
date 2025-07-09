import React from "react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

const DepartmentSidebar = React.memo(
  ({
    universities,
    colleges,
    selectedUniversity = "",
    selectedCollege = "",
    searchTerm,
    onSearchTermChange,
    onSelectedUniversityChange,
    onSelectedCollegeChange,
    onReset,
    itemsPerPage,
    onItemsPerPageChange,
    isUniversityFixed,
    // isCollegeUser, // No longer needed directly by DepartmentSidebar if it's hidden for college users
  }) => {
    const { translateDepartment } = useNamespacedTranslation();

    const handleUniversitySelect = (university) => {
      onSelectedUniversityChange(university);
    };

    const handleCollegeSelect = (college) => {
      onSelectedCollegeChange(college);
    };

    const itemsPerPageOptions = [9, 12, 15, 18, 24, 36, 48];

    return (
      <div className="bg-white rounded-lg shadow-md p-6 top-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
          {translateDepartment("sidebar.title")}
        </h2>

        {/* Search Input - This is now handled in DepartmentAdminView for college users */}
        {/* We can keep it here for other roles if the sidebar is visible and they don't have a top search bar */}
        <div className="mb-6">
          <label
            htmlFor="departmentSearch"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {translateDepartment("sidebar.searchLabel")}
          </label>
          <input
            type="text"
            id="departmentSearch"
            placeholder={translateDepartment("sidebar.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {console.log("isUniversityFixed:", isUniversityFixed)}
        {/* Universities Filter - Conditionally render this entire block */}
        {!isUniversityFixed && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {translateDepartment("sidebar.universityLabel")}
            </label>
            <div className="relative">
              <select
                value={selectedUniversity}
                onChange={(e) => handleUniversitySelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                // disabled={isUniversityFixed} // No longer needed here as the block is conditional
              >
                <option value="">
                  {translateDepartment("sidebar.selectUniversity")}
                </option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Colleges Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translateDepartment("sidebar.collegeLabel")}
          </label>
          <div className="relative">
            <select
              value={selectedCollege}
              onChange={(e) => handleCollegeSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">
                {translateDepartment("sidebar.selectCollege")}
              </option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Per Page Selector */}
        <div className="mb-6">
          <label
            htmlFor="itemsPerPageSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {translateDepartment("sidebar.itemsPerPageLabel")}
          </label>
          <select
            id="itemsPerPageSelect"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t mt-6">
          <button
            onClick={onReset}
            className="w-full bg-green-500 text-white py-2.5 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition duration-200 font-medium"
          >
            {translateDepartment("sidebar.resetButton")}
          </button>
        </div>
      </div>
    );
  }
);

DepartmentSidebar.displayName = "DepartmentSidebar";

export default DepartmentSidebar;
