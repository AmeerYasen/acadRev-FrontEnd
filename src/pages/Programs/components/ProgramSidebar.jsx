import React from 'react';
const ProgramSidebar = ({
  universities,
  colleges,
  departments,
  selectedUniversity = '',
  selectedCollege = '',
  selectedDepartment = '',
  searchTerm,
  onSearchTermChange,
  onSelectedUniversityChange,
  onSelectedCollegeChange,
  onSelectedDepartmentChange,
  onReset,
  itemsPerPage,
  onItemsPerPageChange,
  // isUniversityFixed,
  isCollegeUser,
  roleWeight,
}) => {
  const handleUniversitySelect = (university) => {
    onSelectedUniversityChange(university);
  };

  const handleCollegeSelect = (college) => {
    onSelectedCollegeChange(college);
  };

  const handleDepartmentSelect = (department) => {
    onSelectedDepartmentChange(department);
  };

  const itemsPerPageOptions = [9, 12, 15, 18, 24, 36, 48];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
        Filter Programs
      </h2>
      
      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="programSearch" className="block text-sm font-medium text-gray-700 mb-1">
          Search by Name
        </label>
        <input
          type="text"
          id="programSearch"
          placeholder="Enter program name..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Universities Filter - Conditionally render */}
      {roleWeight<=2 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University
          </label>
          <div className="relative">
            <select
              value={selectedUniversity}
              onChange={(e) => handleUniversitySelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Colleges Filter - Conditionally render for non-college users */}
      {!isCollegeUser && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College
          </label>
          <div className="relative">
            <select
              value={selectedCollege}
              onChange={(e) => handleCollegeSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select College</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Departments Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => handleDepartmentSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Per Page Selector */}
      <div className="mb-6">
        <label htmlFor="itemsPerPageSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Items per Page
        </label>
        <select
          id="itemsPerPageSelect"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {itemsPerPageOptions.map(option => (
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
          Reset 
        </button>
      </div>
    </div>
  );
};

export default ProgramSidebar;
