import React from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';
import { getLocalizedText, getLocalizedName } from '../../../utils/translationUtils';

const ProgramFilterSidebar = ({
  universities,
  colleges,
  departments,
  selectedUniversities,
  selectedColleges,
  selectedDepartments,
  searchTerm,
  onSearchTermChange,
  onUniversityChange,
  onCollegeChange,
  onDepartmentChange,
  onReset,
  itemsPerPage,
  onItemsPerPageChange,
  userRoleWeight,
}) => {
  const { translateResults, currentLanguage } = useNamespacedTranslation();
  const itemsPerPageOptions = [3,6,9,12,15,21];

  const handleUniversitySelect = (universityId) => {
    if (universityId === '') {
      onUniversityChange([]);
    } else {
      onUniversityChange([universityId]);
    }
  };

  const handleCollegeSelect = (collegeId) => {
    if (collegeId === '') {
      onCollegeChange([]);
    } else {
      onCollegeChange([collegeId]);
    }
  };

  const handleDepartmentSelect = (departmentId) => {
    if (departmentId === '') {
      onDepartmentChange([]);
    } else {
      onDepartmentChange([departmentId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6  top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
        {translateResults('programSelector.filterPrograms')}
      </h2>
      
      {/* Search */}
      <div className="mb-6">
        <label htmlFor="programSearch" className="block text-sm font-medium text-gray-700 mb-1">
          {translateResults('programSelector.searchByName')}
        </label>
        <input
          type="text"
          id="programSearch"
          placeholder={translateResults('programSelector.enterProgram')}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>      {/* Universities Filter - Only show for admin/authority */}
      {userRoleWeight <= 2 && universities.length > 0 && (
        <div className="mb-6">
          <label htmlFor="universitySelect" className="block text-sm font-medium text-gray-700 mb-1">
            {translateResults('programSelector.university')}
          </label>
          <select
            id="universitySelect"
            value={selectedUniversities.length > 0 ? selectedUniversities[0] : ''}
            onChange={(e) => handleUniversitySelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{translateResults('programSelector.selectUniversity')}</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {getLocalizedName(university, currentLanguage, 'university_name') || getLocalizedText(university, currentLanguage)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Colleges Filter - Show for admin/authority/university */}
      {userRoleWeight <= 3 && colleges.length > 0 && (
        <div className="mb-6">
          <label htmlFor="collegeSelect" className="block text-sm font-medium text-gray-700 mb-1">
            {translateResults('programSelector.college')}
          </label>
          <select
            id="collegeSelect"
            value={selectedColleges.length > 0 ? selectedColleges[0] : ''}
            onChange={(e) => handleCollegeSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{translateResults('programSelector.selectCollege')}</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {getLocalizedName(college, currentLanguage, 'college_name') || getLocalizedText(college, currentLanguage)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Departments Filter - Show for admin/authority/university/college */}
      {userRoleWeight <= 4 && departments.length > 0 && (
        <div className="mb-6">
          <label htmlFor="departmentSelect" className="block text-sm font-medium text-gray-700 mb-1">
            {translateResults('programSelector.department')}
          </label>
          <select
            id="departmentSelect"
            value={selectedDepartments.length > 0 ? selectedDepartments[0] : ''}
            onChange={(e) => handleDepartmentSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{translateResults('programSelector.selectDepartment')}</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {getLocalizedName(department, currentLanguage, 'department_name') || getLocalizedText(department, currentLanguage)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Items per page */}
      <div className="mb-6">
        <label htmlFor="itemsPerPageSelect" className="block text-sm font-medium text-gray-700 mb-1">
          {translateResults('programSelector.itemsPerPage')}
        </label>
        <select
          id="itemsPerPageSelect"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
        {/* Reset button */}
      <div className="flex flex-col gap-3 pt-4 border-t mt-6">
        <button
          onClick={onReset}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 font-medium"
        >
          {translateResults('programSelector.resetFilters')}
        </button>
      </div>
    </div>
  );
};

export default ProgramFilterSidebar;
