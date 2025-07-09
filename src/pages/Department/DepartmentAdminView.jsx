import React from 'react';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import DepartmentSidebar from './components/DepartmentSidebar';
import DepartmentDisplayCard from './components/viewCard'; // Assuming you renamed viewCard to DepartmentDisplayCard
import DepartmentPagination from './components/Pagination';

const DepartmentAdminView = ({
  loading,
  error,
  departments,
  sidebarOpen,
  setSidebarOpen, // For mobile toggle
  // Sidebar props
  universities,
  colleges,
  selectedUniversity,
  selectedCollege,
  searchTerm,
  onSearchTermChange,
  onSelectedUniversityChange,
  onSelectedCollegeChange,
  onReset,
  // Pagination props
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  hasPrevPage,
  hasNextPage,
  // Action props
  onOpenDepartmentModal, // Function to open the edit/view modal
  onOpenAddDepartmentModal, // Function to open the add modal
  // Items per page props
  itemsPerPage,
  onItemsPerPageChange,
  // Role-based props
  isUniversityFixed,
  isCollegeUser,
}) => {
  const { translateDepartment } = useNamespacedTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */} 
      <div className="bg-gray-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">{translateDepartment('adminView.title')}</h1>
            <div className="flex items-center gap-4">
              {isCollegeUser && ( // Show Add Department button for College Users
                <button
                  onClick={onOpenAddDepartmentModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  {translateDepartment('adminView.addButton')}
                </button>
              )}
              {/* Mobile Filter Toggle Button - Hide if college user as sidebar is hidden */} 
              {!isCollegeUser && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={translateDepartment('adminView.filterToggle')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Search bar for College User */} 
          {isCollegeUser && (
            <div className="mt-4 mb-6">
              <input
                type="text"
                placeholder={translateDepartment('adminView.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */} 
      <div className=" px-4 sm:px-6 lg:px-4 py-4">
        <div className={`flex flex-col ${!isCollegeUser ? 'lg:flex-row' : ''} gap-8`}>
          {/* Sidebar - Conditionally render based on isCollegeUser */} 
          {!isCollegeUser && (
            <div className={`lg:w-70 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <DepartmentSidebar
                universities={universities}
                colleges={colleges}
                selectedUniversity={selectedUniversity}
                selectedCollege={selectedCollege}
                searchTerm={searchTerm}
                onSearchTermChange={onSearchTermChange}
                onSelectedUniversityChange={onSelectedUniversityChange}
                onSelectedCollegeChange={onSelectedCollegeChange}
                onReset={onReset}
                itemsPerPage={itemsPerPage} 
                onItemsPerPageChange={onItemsPerPageChange} 
                isUniversityFixed={isUniversityFixed}
              />
            </div>
          )}

          {/* Department Grid and Pagination */} 
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{translateDepartment('adminView.errorTitle')}</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : departments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{translateDepartment('adminView.emptyTitle')}</h3>
                <p className="mt-1 text-sm text-gray-500">{translateDepartment('adminView.emptyMessage')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {departments.map((department) => (
                    <DepartmentDisplayCard // Use the department-specific card
                        key={department.id} 
                        item={department} 
                        onClick={() => onOpenDepartmentModal(department)}
                        parentCode={department.code} 
                    />
                  ))}
                </div>
                <DepartmentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  totalRecords={totalRecords}
                  hasPrevPage={hasPrevPage}
                  hasNextPage={hasNextPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdminView;