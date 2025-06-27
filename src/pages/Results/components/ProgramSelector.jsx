// src/pages/Results/components/ProgramSelector.jsx
/**
 * ProgramSelector Component
 * Provides role-based program selection for Results page analysis with pagination and filtering
 * 
 * Role-based Access Control:
 * - Admin (weight 1) & Authority (weight 2): Access to ALL programs
 * - University (weight 3): Access to programs within their university
 * - College (weight 4): Access to programs within their college  
 * - Department (weight 5): Access to programs within their department
 * 
 * Features:
 * - Pagination with configurable items per page
 * - Search by program name or ID
 * - Filter by university, college, department (based on role)
 * - Selected program display with ID
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Search, BookOpen, ArrowLeft, Filter } from "lucide-react";
import { fetchProgramsWithPagination, fetchProgramById } from '../../../api/programAPI';
import { fetchUniversityNames } from '../../../api/universityApi';
import { fetchCollegeNamesByUniversity } from '../../../api/collegeApi';
import { fetchDepNamesByCollege } from '../../../api/departmentAPI';
import { useAuth } from '../../../context/AuthContext';
import { getRoleWeight } from '../../../constants';
import { useDebounce } from '../../../hooks/useDebounce';
import ProgramPagination from './ProgramPagination';
import ProgramFilterSidebar from './ProgramFilterSidebar';

const ProgramSelector = ({ 
  setProgramName,
  selectedProgramId, 
  onProgramSelect, 
  isLoading = false,
  onBack,
  showBackButton = false
}) => {
  const { user } = useAuth();
  const userRoleWeight = getRoleWeight(user?.role);

  // State for programs and pagination
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter options
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);  // Selected program details
  const [selectedProgramDetails, setSelectedProgramDetails] = useState(null);

  // Debounced search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);  // Load filter options on component mount
  useEffect(() => {
    if (user && userRoleWeight > 0) {
      loadFilterOptions();
    }
  }, [user, userRoleWeight]);

  // Load filter options based on user role
  const loadFilterOptions = async () => {
    try {
      setLoadingFilters(true);

      // Admin and Authority can see all universities
      if (userRoleWeight <= 2) {
        const universitiesData = await fetchUniversityNames();
        setUniversities(universitiesData || []);
      }

      // Load colleges based on role
      if (userRoleWeight <= 3) {
        if (userRoleWeight === 3 && user?.university_id) {
          // University role - load colleges for their university
          const collegesData = await fetchCollegeNamesByUniversity(user.university_id);
          setColleges(collegesData || []);
        } else if (userRoleWeight <= 2) {
          // Admin/Authority - will load colleges when universities are selected
        }
      }

      // Load departments based on role
      if (userRoleWeight <= 4) {
        if (userRoleWeight === 4 && user?.college_id) {
          // College role - load departments for their college
          const departmentsData = await fetchDepNamesByCollege(user.college_id);
          setDepartments(departmentsData || []);
        } else if (userRoleWeight <= 3) {
          // Admin/Authority/University - will load departments when colleges are selected
        }
      }
    } catch (err) {
      console.error('Error loading filter options:', err);
    } finally {
      setLoadingFilters(false);
    }
  };

  // Load colleges when universities are selected (for admin/authority)
  useEffect(() => {
    if (userRoleWeight <= 2 && selectedUniversities.length > 0) {
      loadCollegesForUniversities();
    } else if (selectedUniversities.length === 0) {
      setColleges([]);
      setSelectedColleges([]);
    }
  }, [selectedUniversities, userRoleWeight]);

  // Load departments when colleges are selected
  useEffect(() => {
    if (userRoleWeight <= 3 && selectedColleges.length > 0) {
      loadDepartmentsForColleges();
    } else if (selectedColleges.length === 0) {
      setDepartments([]);
      setSelectedDepartments([]);
    }
  }, [selectedColleges, userRoleWeight]);

  const loadCollegesForUniversities = async () => {
    try {
      const allColleges = [];
      for (const universityId of selectedUniversities) {
        const collegesData = await fetchCollegeNamesByUniversity(universityId);
        allColleges.push(...(collegesData || []));
      }
      setColleges(allColleges);
    } catch (err) {
      console.error('Error loading colleges for universities:', err);
    }
  };

  const loadDepartmentsForColleges = async () => {
    try {
      const allDepartments = [];
      for (const collegeId of selectedColleges) {
        const departmentsData = await fetchDepNamesByCollege(collegeId);
        allDepartments.push(...(departmentsData || []));
      }
      setDepartments(allDepartments);
    } catch (err) {
      console.error('Error loading departments for colleges:', err);
    }
  };

  // Load programs with pagination and filters
  const loadPrograms = useCallback(async (pageToFetch = 1) => {
    try {
      setLoadingPrograms(true);
      setError(null);
      
      const options = {};
      
      // Add search term if provided
      if (debouncedSearchTerm) {
        options.search = debouncedSearchTerm;
      }

      // Add role-based filters first
      if (userRoleWeight === 3 && user?.university_id) {
        options.university_id = user.university_id;
      } else if (userRoleWeight === 4 && user?.college_id) {
        options.college_id = user.college_id;
      } else if (userRoleWeight === 5 && user?.department_id) {
        options.department_id = user.department_id;
      }      // Add user-selected filters (only for roles that can see them)
      if (userRoleWeight <= 2 && selectedUniversities.length > 0) {
        options.university_id = selectedUniversities[0]; // Use first (and only) selected university
      }
      if (userRoleWeight <= 3 && selectedColleges.length > 0) {
        options.college_id = selectedColleges[0]; // Use first (and only) selected college
      }
      if (userRoleWeight <= 4 && selectedDepartments.length > 0) {
        options.department_id = selectedDepartments[0]; // Use first (and only) selected department
      }
        
      console.log('Fetching programs with options:', options);
      const response = await fetchProgramsWithPagination(pageToFetch, itemsPerPage, options);
      console.log('Programs response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setPrograms(response.data);
        setCurrentPage(response.pagination?.currentPage || pageToFetch);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalRecords(response.pagination?.totalRecords || response.data.length);
        setHasPrevPage(response.pagination?.hasPrevPage || false);
        setHasNextPage(response.pagination?.hasNextPage || false);
      } else {
        throw new Error('Invalid response format from programs endpoint');
      }
      
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('فشل في تحميل البرامج');
      setPrograms([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoadingPrograms(false);
    }
  }, [debouncedSearchTerm, selectedUniversities, selectedColleges, selectedDepartments, itemsPerPage, user, userRoleWeight]);

  // Load selected program details
  useEffect(() => {
    if (selectedProgramId) {
      loadSelectedProgramDetails();
    } else {
      setSelectedProgramDetails(null);
    }
  }, [selectedProgramId]);

  const loadSelectedProgramDetails = async () => {
    try {
      const programDetails = await fetchProgramById(selectedProgramId);
      setSelectedProgramDetails(programDetails);
    } catch (err) {
      console.error('Error loading selected program details:', err);
    }
  };  // Load programs when page, filters, or itemsPerPage changes
  useEffect(() => {
    if (user && userRoleWeight > 0) {
      loadPrograms(currentPage);
    }
  }, [loadPrograms, user, userRoleWeight, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadPrograms(1);
    }
  }, [debouncedSearchTerm, selectedUniversities, selectedColleges, selectedDepartments, itemsPerPage]);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle filter changes
  const handleUniversityChange = (universities) => {
    setSelectedUniversities(universities);
    setSelectedColleges([]); // Reset dependent filters
    setSelectedDepartments([]);
  };

  const handleCollegeChange = (colleges) => {
    setSelectedColleges(colleges);
    setSelectedDepartments([]); // Reset dependent filters
  };

  const handleDepartmentChange = (departments) => {
    setSelectedDepartments(departments);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedUniversities([]);
    setSelectedColleges([]);
    setSelectedDepartments([]);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleProgramClick = (programId) => {
    if (programId !== selectedProgramId) {
      onProgramSelect(programId);
    }
  };  return (
    <div className="space-y-8 mb-8">
      {/* Selected Program Display */}
      {selectedProgramId && selectedProgramDetails && (
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardContent className="p-6">            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg">
                    Selected Program: {selectedProgramDetails.name || `Program ${selectedProgramId}`}
                  </h3>
                  <p className="text-sm text-blue-700 font-medium">ID: {selectedProgramId}</p>                  {selectedProgramDetails.department_name && (
                    <p className="text-sm text-blue-600 mt-1">📚 Department: {selectedProgramDetails.department_name}</p>
                  )}
                  {selectedProgramDetails.college_name && (
                    <p className="text-sm text-blue-600 mt-1">🏫 College: {selectedProgramDetails.college_name}</p>
                  )}
                  {selectedProgramDetails.university_name && (
                    <p className="text-sm text-blue-600 mt-1">🏛️ University: {selectedProgramDetails.university_name}</p>
                  )}
                </div>
              </div>              <Button
                variant="outline"
                size="sm"
                onClick={() => onProgramSelect(null)}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Change Selection
              </Button>
            </div>            {isLoading && (
              <div className="mt-4 text-sm text-blue-600 flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Loading results...
              </div>
            )}            <div className="mt-4 text-xs text-blue-700 bg-blue-100 p-3 rounded">
              💡 Click "Change Selection" to choose a different program for analysis
            </div>
          </CardContent>
        </Card>      )}      {/* No Selection State */}
      {!selectedProgramId && (
        <Card className="border-orange-200 bg-orange-50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">
                  No Program Selected
                </h3>
                <p className="text-sm text-orange-700">
                  Please select a program below to view its analysis results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program Selection Interface - Only show when no program is selected */}
      {!selectedProgramId && (
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {showBackButton && onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <BookOpen className="h-5 w-5 text-blue-600" />
              اختيار البرنامج للتحليل
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4" />
              </Button>
              {!loadingPrograms && totalRecords > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({totalRecords} برنامج متاح)
                </span>
              )}
            </div>
          </div>
          
          {/* Role-based access indicator */}
          {user && (
            <div className="text-sm text-gray-600 mt-2">
              {userRoleWeight <= 2 
                ? 'يمكنك الوصول إلى جميع البرامج في النظام'
                : userRoleWeight === 3 
                  ? `يمكنك الوصول إلى برامج الجامعة (${user.university_name || 'جامعتك'})`
                  : userRoleWeight === 4 
                    ? `يمكنك الوصول إلى برامج الكلية (${user.college_name || 'كليتك'})`
                    : `يمكنك الوصول إلى برامج القسم (${user.department_name || 'قسمك'})`
              }
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
              <ProgramFilterSidebar
                universities={universities}
                colleges={colleges}
                departments={departments}
                selectedUniversities={selectedUniversities}
                selectedColleges={selectedColleges}
                selectedDepartments={selectedDepartments}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onUniversityChange={handleUniversityChange}
                onCollegeChange={handleCollegeChange}
                onDepartmentChange={handleDepartmentChange}
                onReset={handleReset}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                userRoleWeight={userRoleWeight}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Quick search */}
              <div className="md:hidden mb-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث عن برنامج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loadingPrograms && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <span className="text-gray-600">جاري تحميل البرامج...</span>
                </div>
              )}              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPrograms(currentPage)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    إعادة المحاولة
                  </Button>
                </div>
              )}

              {/* Programs Grid */}
              {!loadingPrograms && !error && (
                <>
                  {programs.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {programs.map((program) => (
                          <div
                            key={program.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedProgramId === program.id.toString()
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleProgramClick(program.id.toString())}
                          >
                            <div className="font-medium mb-2">
                              {program.program_name || `برنامج ${program.id}`}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              رقم البرنامج: {program.id}
                            </div>
                            {/* Show hierarchy information based on user role */}
                            <div className="text-xs space-y-1">
                              {userRoleWeight <= 3 && program.university_name && (
                                <div className="text-purple-600">🏛️ {program.university_name}</div>
                              )}
                              {userRoleWeight <= 4 && program.college_name && (
                                <div className="text-blue-600">🏫 {program.college_name}</div>
                              )}
                              {program.department_name && (
                                <div className="text-green-600">📚 {program.department_name}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      <ProgramPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalRecords={totalRecords}
                        hasPrevPage={hasPrevPage}
                        hasNextPage={hasNextPage}
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      {debouncedSearchTerm || selectedUniversities.length > 0 || selectedColleges.length > 0 || selectedDepartments.length > 0 ? (
                        <div>
                          <p className="text-gray-600 mb-2">لا توجد برامج تطابق الفلاتر المحددة</p>
                          <p className="text-sm text-gray-500">جرب تعديل الفلاتر أو البحث</p>                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleReset}
                            className="mt-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            مسح الفلاتر
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-4">لا توجد برامج متاحة</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default ProgramSelector;
