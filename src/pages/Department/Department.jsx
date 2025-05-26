import React, { useState, useEffect, useCallback } from 'react';
import { fetchDepartmentsWithPagination, editDepartment } from '../../api/departmentAPI';
import { useAuth } from '../../context/AuthContext';
import {ROLES,getRoleWeight} from '../../constants';
import DepartmentAdminView from './DepartmentAdminView';
import DepartmentStaffView from './DepartmentStaffView';
import DepartmentEditModal from './components/DepartmentEditModal';

// Main Department component
const Department = () => {
  const { user } = useAuth() || {};
  const userRole = user?.role || ROLES.GUEST;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  
  const [itemsPerPage, setItemsPerPage] = useState(12); // Customizable items per page

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDepartmentToEdit, setCurrentDepartmentToEdit] = useState(null);

  // Pagination control flags
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Track if filters were applied to avoid unnecessary fetches
  const [filtersChanged, setFiltersChanged] = useState(false);

  const fetchUniversities = async () => {
    try {
      const response = await fetchUniversities();
      if (Array.isArray(response)) {
        return response;
      } else {
        console.error("Invalid universities data format:", response);
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch universities:", err);
      return [];
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await fetchColleges();
      if (Array.isArray(response)) {
        return response;
      } else {
        console.error("Invalid colleges data format:", response);
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch colleges:", err);
      return [];
    }
  };

  // Fetch departments with current filters and pagination
  const fetchDepartments = useCallback(async (pageToFetch) => {
    setLoading(true);
    setError(null);
    let determinedPage = pageToFetch; // To store the page number confirmed by API or logic

    try {
      const options = {};
      if (searchTerm) options.search = searchTerm;
      if (selectedUniversity) options.university_id = selectedUniversity.id;
      if (selectedCollege) options.college_id = selectedCollege.id;

      console.log(`Fetching departments: page ${pageToFetch}, items: ${itemsPerPage}, options:`, options);

      const response = await fetchDepartmentsWithPagination(pageToFetch, itemsPerPage, options);
      
      if (response && response.data && response.pagination) {
        setDepartments(response.data);
        
        const pagination = response.pagination;
        
        setTotalRecords(pagination.totalRecords || 0);
        const calculatedTotalPages = Math.ceil((pagination.totalRecords || 0) / itemsPerPage) || 1;
        setTotalPages(calculatedTotalPages);
        
        // Determine the actual current page based on API response
        determinedPage = Math.min(
          Math.max(1, pagination.currentPage || pageToFetch), 
          calculatedTotalPages
        );
        
        setHasPrevPage(determinedPage > 1);
        setHasNextPage(determinedPage < calculatedTotalPages);
        
        console.log(`Data fetched. Effective page: ${determinedPage}/${calculatedTotalPages}`);
      } else {
        console.warn("Invalid response format or no data:", response);
        setDepartments([]);
        setTotalRecords(0);
        setTotalPages(1);
        determinedPage = 1; // Reset to page 1 on error or invalid data
        setHasPrevPage(false);
        setHasNextPage(false);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError(err.message || "Failed to fetch departments");
      setDepartments([]);
      setTotalRecords(0);
      setTotalPages(1);
      determinedPage = 1; // Reset to page 1 on error
      setHasPrevPage(false);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
    return determinedPage; // Return the page number that was effectively processed
  }, [searchTerm, selectedUniversity, selectedCollege, itemsPerPage]); // Removed currentPage from dependencies

  // Handle page changes from the pagination component
  const handlePageChange = (pageNumber) => {
    console.log(`Page change requested: ${pageNumber}`);
    
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      console.log(`Setting page to: ${pageNumber}`);
      setCurrentPage(pageNumber);
    }
  };

  // Effect to fetch departments when the page changes or itemsPerPage changes
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const loadedPage = await fetchDepartments(currentPage);
      if (isMounted && loadedPage !== currentPage) {
        // If fetchDepartments determined a different page was loaded (e.g. API corrected it)
        // then update the currentPage state.
        setCurrentPage(loadedPage);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, fetchDepartments]); // Added itemsPerPage

  // Handle filter button click
  const handleFilter = () => {
    if (currentPage === 1) {
      // If we're already on page 1, just fetch.
      // The `fetchDepartments` will return the page it loaded (should be 1).
      // The useEffect won't run again if currentPage is already 1 unless fetchDepartments ref changes.
      // This direct call ensures a refresh.
      fetchDepartments(1).then(loadedPage => {
        // If API somehow redirects from page 1 to another page (unlikely for page 1)
        if (loadedPage !== 1) {
            setCurrentPage(loadedPage);
        }
      });
    } else {
      // If not on page 1, setting currentPage to 1 will trigger the useEffect,
      // which then calls fetchDepartments.
      setCurrentPage(1);
    }
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Handle filter reset
  const handleReset = () => {
    setSearchTerm('');
    setSelectedUniversity(null);
    setSelectedCollege(null);
    // setItemsPerPage(12); // Optionally reset itemsPerPage here too
    setFiltersChanged(true);
    
    if (currentPage === 1) {
      fetchDepartments(1);
    } else {
      setCurrentPage(1); // This will trigger fetch via useEffect
    }
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(Number(newSize));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };
  
  // Handle changes to filters
  useEffect(() => {
    setFiltersChanged(true);
  }, [searchTerm, selectedUniversity, selectedCollege]);

  const openDepartmentModal = (department) => {
    setCurrentDepartmentToEdit(department);
    setIsEditModalOpen(true);
  };

  const closeDepartmentModal = () => {
    setIsEditModalOpen(false);
    setCurrentDepartmentToEdit(null);
  };

  const handleUpdateDepartment = async (updatedData) => {
    if (!currentDepartmentToEdit || !currentDepartmentToEdit.id) {
        console.error("No department selected for update or ID missing.");
        return;
    }
    try {
        setLoading(true);
        
        // Simulate update success
        setDepartments(prev => prev.map(d => d.id === updatedData.id ? updatedData : d));
        console.log("Department updated successfully!", updatedData);
        closeDepartmentModal();
        
        // Refresh data
        fetchDepartments(currentPage);
    } catch (err) {
        console.error("Failed to update department:", err);
    } finally {
        setLoading(false);
    }
  };
  
  // Determine view based on user role
  const canAdminView = [ROLES.ADMIN, ROLES.AUTHORITY, ROLES.UNIVERSITY_ADMIN].includes(userRole);

  // Show loading screen only on initial load
  if (loading && departments.length === 0) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (canAdminView) {
    return (
      <>
        <DepartmentAdminView
          loading={loading}
          error={error}
          departments={departments}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          universities={universities}
          colleges={colleges}
          selectedUniversity={selectedUniversity}
          selectedCollege={selectedCollege}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSelectedUniversityChange={setSelectedUniversity}
          onSelectedCollegeChange={setSelectedCollege}
          onFilter={handleFilter}
          onReset={handleReset}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
          onOpenDepartmentModal={openDepartmentModal}
          itemsPerPage={itemsPerPage} // Pass itemsPerPage
          onItemsPerPageChange={handleItemsPerPageChange} // Pass handler
        />
        {isEditModalOpen && currentDepartmentToEdit && (
          <DepartmentEditModal
            isOpen={isEditModalOpen}
            department={currentDepartmentToEdit}
            onClose={closeDepartmentModal}
            onUpdate={handleUpdateDepartment}
            userRole={userRole}
            canEdit={true}
          />
        )}
      </>
    );
  } else if (userRole === ROLES.DEPARTMENT) {
    return (
        <>
            <DepartmentStaffView departmentData={currentDepartmentToEdit} />
            {isEditModalOpen && currentDepartmentToEdit && (
              <DepartmentEditModal
                isOpen={isEditModalOpen}
                department={currentDepartmentToEdit}
                onClose={closeDepartmentModal}
                onUpdate={handleUpdateDepartment}
                userRole={userRole}
                canEdit={true}
              />
            )}
        </>
    );
  } else {
    return <div className="p-6">Access Denied or Role View Not Implemented.</div>;
  }
};

export default Department;