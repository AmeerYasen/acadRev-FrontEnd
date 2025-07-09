import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { ROLES, getRoleWeight } from "../../constants";
import {
  fetchProgramsWithPagination,
  addProgram,
  editProgram,
} from "../../api/programAPI";
import { fetchUniversityNames } from "../../api/universityApi";
import { fetchCollegeNamesByUniversity } from "../../api/collegeApi";
import { fetchDepNamesByCollege } from "../../api/departmentAPI";
import { useDebounce } from "../../hooks/useDebounce";
import { useNamespacedTranslation } from "../../hooks/useNamespacedTranslation";
import ProgramAdminView from "./ProgramAdminView";
import ProgramEditModal from "./components/ProgramEditModal";
import AddProgramModal from "./components/AddProgramModal";
import { useToast } from "../../context/ToastContext";

// Main Program component
const Program = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const { translatePrograms } = useNamespacedTranslation();
  const userRole = user?.role || ROLES.GUEST;
  const roleWeight = getRoleWeight(userRole);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { showSuccess, showError } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Debounced search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProgramToEdit, setCurrentProgramToEdit] = useState(null);
  const [currentProgramToAdd, setCurrentProgramToAdd] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination control flags
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Determine if filters should be fixed based on user role
  const isUniversityFixed =
    userRole === ROLES.UNIVERSITY && user?.university_id;
  const isCollegeUser = userRole === ROLES.COLLEGE && user?.college_id;
  const isDepartmentUser = userRole === ROLES.DEPARTMENT && user?.department_id;

  const fetchUniversitiesList = useCallback(async () => {
    try {
      const names = await fetchUniversityNames();
      setUniversities(names.map((uni) => ({ id: uni.id, name: uni.name })));
    } catch (err) {
      setError(err.message);
      setUniversities([]);
    }
  }, []);

  const fetchCollegesList = useCallback(async (universityId) => {
    if (!universityId) {
      setColleges([]);
      setSelectedCollege("");
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }
    try {
      const names = await fetchCollegeNamesByUniversity(universityId);
      setColleges(names.map((col) => ({ id: col.id, name: col.name })));
    } catch (err) {
      setError(err.message);
      setColleges([]);
      setSelectedCollege("");
      setDepartments([]);
      setSelectedDepartment("");
    }
  }, []);

  const fetchDepartmentsList = useCallback(async (collegeId) => {
    if (!collegeId) {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }
    try {
      const names = await fetchDepNamesByCollege(collegeId);
      setDepartments(names.map((dept) => ({ id: dept.id, name: dept.name })));
    } catch (err) {
      setError(err.message);
      setDepartments([]);
      setSelectedDepartment("");
    }
  }, []);

  // Effect for initial setup based on role and fixed status
  useEffect(() => {
    if (isDepartmentUser && user?.department_id) {
      // Case 1: User is a Department User - fix all filters
      setSelectedDepartment(user.department_id.toString());
      setSelectedCollege(user.college_id?.toString() || "");
      setSelectedUniversity(user.university_id?.toString() || "");
    } else if (isCollegeUser && user?.college_id) {
      // Case 2: User is a College User - fix university and college
      setSelectedCollege(user.college_id.toString());
      setSelectedUniversity(user.university_id?.toString() || "");
      fetchDepartmentsList(user.college_id);
    } else if (isUniversityFixed && user?.university_id) {
      // Case 3: University is fixed
      setSelectedUniversity(user.university_id.toString());
      fetchCollegesList(user.university_id);
    } else {
      // Case 4: No fixed filters (admin/authority)
      fetchUniversitiesList();
    }
  }, [
    isDepartmentUser,
    isCollegeUser,
    isUniversityFixed,
    user?.university_id,
    user?.college_id,
    user?.department_id,
    fetchUniversitiesList,
    fetchCollegesList,
    fetchDepartmentsList,
  ]);

  // Effect to fetch colleges when selectedUniversity changes
  useEffect(() => {
    if (!isUniversityFixed && !isCollegeUser && !isDepartmentUser) {
      if (selectedUniversity) {
        fetchCollegesList(selectedUniversity);
      } else {
        setColleges([]);
        setSelectedCollege("");
        setDepartments([]);
        setSelectedDepartment("");
      }
    }
  }, [
    selectedUniversity,
    isUniversityFixed,
    isCollegeUser,
    isDepartmentUser,
    fetchCollegesList,
  ]);

  // Effect to fetch departments when selectedCollege changes
  useEffect(() => {
    if (!isCollegeUser && !isDepartmentUser) {
      if (selectedCollege) {
        fetchDepartmentsList(selectedCollege);
      } else {
        setDepartments([]);
        setSelectedDepartment("");
      }
    }
  }, [selectedCollege, isCollegeUser, isDepartmentUser, fetchDepartmentsList]);

  // Memoized fetchPrograms function
  const fetchProgramsData = useCallback(
    async (pageToFetch) => {
      setLoading(true);
      setError(null);
      let determinedPage = pageToFetch;

      try {
        const options = {};
        if (debouncedSearchTerm) {
          options.search = debouncedSearchTerm;
        }

        let universityToFilter = selectedUniversity;
        let collegeToFilter = selectedCollege;
        let departmentToFilter = selectedDepartment;

        if (isDepartmentUser && user?.department_id) {
          departmentToFilter = user.department_id;
          collegeToFilter = user.college_id;
          universityToFilter = user.university_id;
        } else if (isCollegeUser && user?.college_id) {
          collegeToFilter = user.college_id;
          universityToFilter = user.university_id;
        } else if (isUniversityFixed && user?.university_id) {
          universityToFilter = user.university_id;
        }

        if (universityToFilter) {
          options.university_id = universityToFilter;
        }
        if (collegeToFilter) {
          options.college_id = collegeToFilter;
        }
        if (departmentToFilter) {
          options.department_id = departmentToFilter;
        }

        const result = await fetchProgramsWithPagination(
          determinedPage,
          itemsPerPage,
          options
        );

        setPrograms(result.data);
        setTotalRecords(result.pagination.totalRecords);
        setTotalPages(result.pagination.totalPages);
        setHasPrevPage(result.pagination.hasPrevPage);
        setHasNextPage(result.pagination.hasNextPage);
        setCurrentPage(result.pagination.currentPage);

        return result.pagination.currentPage;
      } catch (err) {
        setError(err.message);
        setPrograms([]);
        setTotalRecords(0);
        setTotalPages(0);
        setHasPrevPage(false);
        setHasNextPage(false);
        return determinedPage;
      } finally {
        setLoading(false);
      }
      return determinedPage;
    },
    [
      debouncedSearchTerm,
      selectedUniversity,
      selectedCollege,
      selectedDepartment,
      itemsPerPage,
      isDepartmentUser,
      isCollegeUser,
      isUniversityFixed,
      user,
    ]
  );

  // Handle page changes from the pagination component
  const handlePageChange = (pageNumber) => {
    const numericPageNumber = Number(pageNumber);
    if (
      numericPageNumber >= 1 &&
      numericPageNumber <= totalPages &&
      numericPageNumber !== currentPage
    ) {
      setCurrentPage(numericPageNumber);
    }
  };

  // Effect to fetch programs when the page changes or itemsPerPage changes
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      await fetchProgramsData(currentPage);
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, fetchProgramsData]);

  // Handle filter reset
  const handleReset = () => {
    setSearchTerm("");
    // Only reset filters if not fixed by role
    if (!isUniversityFixed && !isCollegeUser && !isDepartmentUser) {
      setSelectedUniversity("");
      setSelectedCollege("");
      setSelectedDepartment("");
    }
    if (isUniversityFixed && !isCollegeUser && !isDepartmentUser) {
      setSelectedCollege("");
      setSelectedDepartment("");
    }
    if (isCollegeUser && !isDepartmentUser) {
      setSelectedDepartment("");
    }
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(Number(newSize));
    setCurrentPage(1);
  };

  // Handle changes to filters - now resets to page 1 if not already there
  useEffect(() => {
    if (
      currentPage !== 1 &&
      (debouncedSearchTerm ||
        selectedUniversity ||
        selectedCollege ||
        selectedDepartment)
    ) {
      setCurrentPage(1);
    } else if (currentPage === 1) {
      fetchProgramsData(1);
    }
  }, [
    debouncedSearchTerm,
    selectedUniversity,
    selectedCollege,
    selectedDepartment,
    fetchProgramsData,
  ]);

  const openProgramModal = (program) => {
    setCurrentProgramToEdit(program);
    setIsEditModalOpen(true);
  };

  const closeProgramModal = () => {
    setIsEditModalOpen(false);
    setCurrentProgramToEdit(null);
  };

  const openAddProgramModal = () => {
    setCurrentProgramToAdd({
      name: "",
      university_id: selectedUniversity,
      college_id: selectedCollege,
      department_id: selectedDepartment,
    });
    setIsAddModalOpen(true);
  };

  const closeAddProgramModal = () => {
    setIsAddModalOpen(false);
    setCurrentProgramToAdd(null);
  };

  const handleDeleteProgram = async (deletedProgramId) => {
    try {
      // Refresh the programs list after deletion
      await fetchProgramsData(currentPage);
      // Success message is already shown in the modal, so we don't show it again here
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      showError(translatePrograms("errors.deleteError"));
    }
  };

  const handleAddProgram = async (newData) => {
    try {
      await addProgram(newData);
      showSuccess(translatePrograms("messages.addSuccess"));
      await fetchProgramsData(currentPage);
      closeAddProgramModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      showError(`${translatePrograms("errors.createError")}: ${errorMessage}`);
    }
  };

  const handleUpdateProgram = async (updatedData) => {
    if (!currentProgramToEdit || !currentProgramToEdit.id) {
      setError("No program selected for editing");
      return;
    }
    try {
      await editProgram(updatedData);
      await fetchProgramsData(currentPage);
      closeProgramModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Determine view based on user role
  const canAdminView = [
    ROLES.ADMIN,
    ROLES.AUTHORITY,
    ROLES.UNIVERSITY,
    ROLES.COLLEGE,
    ROLES.DEPARTMENT,
  ].includes(userRole);

  // Show loading screen only on initial load
  if (loading && programs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (canAdminView) {
    return (
      <>
        <ProgramAdminView
          loading={loading}
          error={error}
          programs={programs}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          universities={universities}
          colleges={colleges}
          departments={departments}
          selectedUniversity={selectedUniversity}
          selectedCollege={selectedCollege}
          selectedDepartment={selectedDepartment}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSelectedUniversityChange={setSelectedUniversity}
          onSelectedCollegeChange={setSelectedCollege}
          onSelectedDepartmentChange={setSelectedDepartment}
          onReset={handleReset}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          onOpenProgramModal={openProgramModal}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          isUniversityFixed={isUniversityFixed}
          isCollegeUser={isCollegeUser}
          isDepartmentUser={isDepartmentUser}
          onOpenAddProgramModal={openAddProgramModal}
          userRole={userRole}
          roleWeight={roleWeight}
          roles={ROLES}
        />
        {isEditModalOpen && currentProgramToEdit && (
          <ProgramEditModal
            isOpen={isEditModalOpen}
            program={currentProgramToEdit}
            onClose={closeProgramModal}
            onUpdate={handleUpdateProgram}
            onProgramDeleted={handleDeleteProgram}
            userRole={userRole}
          />
        )}
        {isAddModalOpen && (
          <AddProgramModal
            isOpen={isAddModalOpen}
            onClose={closeAddProgramModal}
            onAddProgram={handleAddProgram}
            userRole={userRole}
            departmentId={
              isDepartmentUser ? user?.department_id : selectedDepartment
            }
            collegeId={
              isDepartmentUser
                ? user?.college_id
                : isCollegeUser
                ? user?.college_id
                : selectedCollege
            }
            universityId={
              isDepartmentUser
                ? user?.university_id
                : isCollegeUser
                ? user?.university_id
                : isUniversityFixed
                ? user?.university_id
                : selectedUniversity
            }
          />
        )}
      </>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {translatePrograms("errors.accessDenied")}
          </h2>
          <p className="text-gray-600">
            {translatePrograms("errors.noPermission")}
          </p>
        </div>
      </div>
    );
  }
};

export default Program;
