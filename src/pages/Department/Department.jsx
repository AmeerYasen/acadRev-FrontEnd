import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants';
import { fetchDepartmentsWithPagination, editDepartment, addDepartment, fetchMyDepartment } from '../../api/departmentAPI';
import { fetchUniversityNames } from '../../api/universityApi';
import { fetchCollegeNamesByUniversity } from '../../api/collegeApi';
import { useDebounce } from '../../hooks/useDebounce';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import DepartmentAdminView from './DepartmentAdminView';
import DepartmentStaffView from './DepartmentStaffView';
import DepartmentEditModal from './components/DepartmentEditModal';
import AddDepartmentModal from './components/AddDepartmentModal';

// Main Department component
const Department = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const { translateDepartment } = useNamespacedTranslation();
  const userRole = user?.role || ROLES.GUEST;

  // Early return for department users - they don't need admin functionality
  if (userRole === ROLES.DEPARTMENT) {
    return <DepartmentStaffView />;
  }

  // For access denied cases - early return
  const canAdminView = [ROLES.ADMIN, ROLES.AUTHORITY, ROLES.UNIVERSITY, ROLES.COLLEGE].includes(userRole);
  if (!canAdminView) {
    return <div className="p-6">{translateDepartment('errors.accessDenied')}</div>;
  }

  // If we reach here, user has admin access - render the admin component
  return <AdminDepartmentComponent user={user} userRole={userRole} translateDepartment={translateDepartment} />;
};

// Admin Department Component - handles admin functionality
const AdminDepartmentComponent = ({ user, userRole, translateDepartment }) => {
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
  const [selectedUniversity, setSelectedUniversity] = useState(''); // Initialize with empty string for <select>
  const [selectedCollege, setSelectedCollege] = useState(''); // Initialize with empty string for <select>
  
  // Debounced search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [itemsPerPage, setItemsPerPage] = useState(12); // Customizable items per page

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDepartmentToEdit, setCurrentDepartmentToEdit] = useState(null);
  const [currentDepartmentToAdd, setCurrentDepartmentToAdd] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination control flags
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  // Determine if the university filter should be fixed for UNIVERSITY_ADMIN role
  const isUniversityFixed = userRole === ROLES.UNIVERSITY && user?.university_id;
  // Determine if the user is a COLLEGE role, which will also fix university and college
  const isCollegeUser = userRole === ROLES.COLLEGE && user?.college_id;

  const fetchUniversitiesList = useCallback(async () => {
    try {
      const names = await fetchUniversityNames();
      setUniversities(names.map(uni => ({ id: uni.id, name: uni.name })));
    } catch (err) {
      setError(err.message);
      setUniversities([]);
    }
  }, []); // Remove translateDepartment dependency to prevent infinite re-renders

  const fetchCollegesList = useCallback(async (universityId) => {
    if (!universityId) {
      setColleges([]);
      setSelectedCollege(''); // Clear selected college if universityId is cleared
      return;
    }
    try {
      const names = await fetchCollegeNamesByUniversity(universityId);
      setColleges(names.map(col => ({ id: col.id, name: col.name })));
    } catch (err) {
      setError(err.message);
      setColleges([]);
      setSelectedCollege(''); // Clear selected college on error
    }
  }, []); // Remove translateDepartment dependency to prevent infinite re-renders

  // Effect for initial university/college setup based on role and fixed status
  useEffect(() => {
    if (isCollegeUser && user?.college_id) {
      // Case 1: User is a College User
      setSelectedCollege(user.college_id.toString());
    
     
    } else if (isUniversityFixed && user?.university_id) {
      // Case 2: University is fixed for the user (e.g., user.role === ROLES.UNIVERSITY)
      setSelectedUniversity(user.university_id.toString()); 
      fetchCollegesList(user.university_id.toString());
      setSelectedCollege(''); // Ensure college is not pre-selected unless it's a college user
    } else {
      // Case 3: University is NOT fixed (Admin/Authority)
      if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
        fetchUniversitiesList(); // Fetch all universities for Admin/Authority
        setColleges([]); // Clear colleges initially
        setSelectedCollege('');
        setSelectedUniversity('');
      } else {
        // Other roles (not Admin/Authority, and not a fixed University/College Admin)
        setUniversities([]);
        setSelectedUniversity('');
        setColleges([]);
        setSelectedCollege('');
      }
    }
  }, [isCollegeUser, isUniversityFixed, user?.university_id, user?.college_id, user?.university_name, user?.college_name, userRole, fetchUniversitiesList, fetchCollegesList]);

  // Effect to fetch colleges when selectedUniversity changes (and university is NOT fixed and not a college user)
  useEffect(() => {
    if (!isUniversityFixed && !isCollegeUser) { // Only run if university is not fixed and not a college user
      if (selectedUniversity) {
        fetchCollegesList(selectedUniversity);
      } else {
        setColleges([]);
        setSelectedCollege('');
      }
    }
  }, [selectedUniversity, isUniversityFixed, isCollegeUser, fetchCollegesList]);

  // Memoized fetchDepartments function
  const fetchDepartments = useCallback(async (pageToFetch) => {
    setLoading(true);
    setError(null);
    let determinedPage = pageToFetch;

    try {      const options = {};
      if (debouncedSearchTerm) options.search = debouncedSearchTerm;

      let universityToFilter = selectedUniversity;
      let collegeToFilter = selectedCollege;

      if (isCollegeUser && user?.college_id) {
        collegeToFilter = user.college_id.toString();
      } else if (isUniversityFixed && user?.university_id) {
        universityToFilter = user.university_id.toString();
      }
      
      if (universityToFilter) options.university_id = universityToFilter;
      if (collegeToFilter) options.college_id = collegeToFilter;

      console.log('universityToFilter:', universityToFilter);
      console.log('collegeToFilter:', collegeToFilter);
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
        console.warn(translateDepartment('errors.invalidResponse'), response);
        setDepartments([]);
        setTotalRecords(0);
        setTotalPages(1);
        determinedPage = 1; // Reset to page 1 on error or invalid data
        setHasPrevPage(false);
        setHasNextPage(false);
      }
    } catch (err) {
      console.error(translateDepartment('errors.fetchFailed'), err);
      setError(err.message || translateDepartment('errors.fetchDepartments'));
      setDepartments([]);
      setTotalRecords(0);
      setTotalPages(1);
      determinedPage = 1; // Reset to page 1 on error
      setHasPrevPage(false);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }    return determinedPage; // Return the page number that was effectively processed
  }, [debouncedSearchTerm, selectedUniversity, selectedCollege, itemsPerPage]); // Removed currentPage from dependencies

  // Handle page changes from the pagination component
  const handlePageChange = (pageNumber) => {
    console.log(`Page change requested: ${pageNumber}`);
    // Ensure pageNumber is a number before using it
    const numericPageNumber = Number(pageNumber);
    if (numericPageNumber >= 1 && numericPageNumber <= totalPages && numericPageNumber !== currentPage) {
      setCurrentPage(numericPageNumber);
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

  // Handle filter reset
  const handleReset = () => {
    setSearchTerm('');
    // Only reset filters if not fixed by role
    if (!isUniversityFixed && !isCollegeUser) {
      setSelectedUniversity(''); 
      setSelectedCollege(''); 
    }
    if (isUniversityFixed && !isCollegeUser) {
      // University admin can reset college filter
      setSelectedCollege('');
    }
    // College user cannot reset university or college filters via this button
    // Items per page can always be reset if desired, or handled separately
    // setItemsPerPage(12); 
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(Number(newSize));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };
    // Handle changes to filters - now resets to page 1 if not already there
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || selectedUniversity || selectedCollege)) {
        // More precise check: if any of the actively settable filters changed, reset page.
        // This logic might need refinement based on exact desired behavior for fixed roles.
        setCurrentPage(1);
    } else if (currentPage === 1 && (debouncedSearchTerm || selectedUniversity || selectedCollege)){
        // If already on page 1, and filters changed, the fetchDepartments dependency change will trigger refetch.
        // No explicit action needed here other than ensuring fetchDepartments has the right dependencies.
    }

  }, [debouncedSearchTerm, selectedUniversity, selectedCollege, isUniversityFixed, isCollegeUser]);

  const openDepartmentModal = (department) => {
    setCurrentDepartmentToEdit(department);
    setIsEditModalOpen(true);
  };

  const closeDepartmentModal = () => {
    setIsEditModalOpen(false);
    setCurrentDepartmentToEdit(null);
  };

  const openAddDepartmentModal = () => {
    setCurrentDepartmentToAdd({ name: '', university_id: selectedUniversity, college_id: selectedCollege });
    setIsAddModalOpen(true);
  };

  const closeAddDepartmentModal = () => {
    setIsAddModalOpen(false);
    setCurrentDepartmentToAdd(null);
  };  const handleAddDepartment = async (newData) => {
    try { 
      setLoading(true);
      // Call the actual API to add the department
      const addedDepartment = await addDepartment(newData);
      console.log(translateDepartment('messages.addSuccess'), addedDepartment); 
      closeAddDepartmentModal();
      // Refresh data to show the new department
      await fetchDepartments(currentPage);
    } catch (err) {
      console.error(translateDepartment('errors.addFailed'), err);
      setError(err.message || translateDepartment('errors.addDepartment'));
      // Don't close the modal on error so user can retry
    } finally {
      setLoading(false);
    }
  };
  // Handle department update 

  const handleUpdateDepartment = async (updatedData) => {
    if (!currentDepartmentToEdit || !currentDepartmentToEdit.id) {
        console.error(translateDepartment('errors.noSelection'));
        return;
    }
    try {
        setLoading(true);
        
        // Simulate update success
        setDepartments(prev => prev.map(d => d.id === updatedData.id ? updatedData : d));
        console.log(translateDepartment('messages.updateSuccess'), updatedData);
        closeDepartmentModal();
        
        // Refresh data
        fetchDepartments(currentPage);
    } catch (err) {
        console.error(translateDepartment('errors.updateFailed'), err);
    } finally {
        setLoading(false);
    }
  };
  
  // Show loading screen only on initial load
  if (loading && departments.length === 0) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">{translateDepartment('loading.loadingData')}</span>
    </div>;
  }

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
        onReset={handleReset}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        onOpenDepartmentModal={openDepartmentModal}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        isUniversityFixed={isUniversityFixed} 
        isCollegeUser={isCollegeUser} // Pass isCollegeUser
        onOpenAddDepartmentModal={openAddDepartmentModal}
        userRole={userRole} // Pass userRole to control add button visibility
      />
      {isEditModalOpen && currentDepartmentToEdit && (
        <DepartmentEditModal
          isOpen={isEditModalOpen}
          department={currentDepartmentToEdit}
          onClose={closeDepartmentModal}
          onUpdate={handleUpdateDepartment}
          userRole={userRole}
        />
      )}
      {isAddModalOpen && (
        <AddDepartmentModal
          isOpen={isAddModalOpen}
          onClose={closeAddDepartmentModal}
          onAddDepartment={handleAddDepartment}
          userRole={userRole}
          collegeId={isCollegeUser ? user?.college_id : selectedCollege}
          universityId={isCollegeUser ? user?.university_id : selectedUniversity}
        />
      )}
    </>
  );
};

export default Department;