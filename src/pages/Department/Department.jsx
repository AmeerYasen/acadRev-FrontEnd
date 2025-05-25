import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UniversityNav from '../../components/sharedViews/viewNav';
import CollegeCard from '../../components/sharedViews/viewCard';
import DepartmentModal from './DepartmentModal';
import AddDepartmentModal from './AddDepartmentModal';
import { ROLES, getRoleWeight } from '../../constants';
import * as departmentApi from '../../api/departmentApi';
import {fetchCollegesByUniversity,fetchColleges} from '../../api/collegeApi';
import {fetchUniversities} from '../../api/universityApi'; // Adjust the import path as needed

// // Assuming you have an API module for departments
const Department = () => {
  const { user } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const userRole = user?.role || '';
  const userRoleWeight = getRoleWeight(userRole);
  useEffect(() => {
    fetchData();
  }, [user, selectedCollegeId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (userRoleWeight <= 3) { // Admin/Authority user
        if (!selectedCollegeId) {
          // Fetch colleges for navigation
          // Assuming user.university_id is available for these roles, or user.id if it's a university entity itself
          const universityId = user?.university_id ; 
       
          if (universityId) {
            const fetchedColleges = await fetchCollegesByUniversity(universityId);
            setColleges(fetchedColleges);
            setDepartments([]); // Clear departments when no college is selected
          } else {
            // Fallback or if no specific university context, fetch all colleges (adjust as needed)
            const allColleges = await fetchColleges(); 
            setColleges(allColleges);
            setDepartments([]);
          } 
        } else {
          // Fetch departments for selected college
          const fetchedDepartments = await departmentApi.fetchDepartmentsByCollege(selectedCollegeId);
          setDepartments(fetchedDepartments);
        }
      } else if (user?.role === ROLES.COLLEGE) {
        // College user sees only their departments
        if (user.college_id) {
          const fetchedDepartments = await departmentApi.fetchDepartmentsByCollege(user.college_id);
          setDepartments(fetchedDepartments);
        } else {
          setError("College ID not found for the current user.");
          setDepartments([]);
        }
      } else if (user?.role === ROLES.DEPARTMENT) {
        // Department user sees their department info
        if (user.department_id) {
          const departmentData = await departmentApi.fetchDepartmentById(user.department_id);
          setSelectedDepartment(departmentData);
          // Optionally, set this department as the only one in the list if needed for UI consistency
          // setDepartments([departmentData]); 
          setShowDepartmentModal(true); // Or handle display directly
        } else {
          setError("Department ID not found for the current user.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeSelect = (collegeId) => {
    setSelectedCollegeId(collegeId);
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentModal(true);
  };

  const handleAddDepartment = () => {
    setShowAddDepartmentModal(true);
  };

  const handleDepartmentAdded = () => {
    fetchData(); // Refresh the data
    setShowAddDepartmentModal(false);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="p-6">Loading...</div>;
    }

    if (error) {
      return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    // University/Admin/Authority view - show colleges as cards when no college selected
    if (userRoleWeight<=3 && !selectedCollegeId) {
      return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Select a College to View Departments</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map(college => (
              <CollegeCard
                key={college.id}
                item={college}
                parentCode={college.code}
                onClick={() => handleCollegeSelect(college.id)}
                itemType="college"
              />
            ))}
          </div>
        </div>
      );
    }

    // Show departments
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-dark">
            {selectedCollegeId ? 'Departments' : 'All Departments'}
          </h1>
          {user?.role === 'college' && (
            <button
              onClick={handleAddDepartment}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add Department
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(department => (
            <CollegeCard
              key={department.id}
              item={department}
              parentCode={department.code}
              onClick={handleDepartmentClick}
              itemType="department"
            />
          ))}
        </div>
      </div>
    );
  };

  const showNavigation = (user?.role === 'university' || user?.role === 'admin' || user?.role === 'authority') && colleges.length > 0;

  return (
    <div className="flex max-h-screen bg-background-light overflow-hidden overflow-y-auto"> 
      {showNavigation && (
        <UniversityNav
          itemsList={colleges}
          selectedItemId={selectedCollegeId}
          onSelectItem={handleCollegeSelect}
          itemType="Colleges"
          loading={loading}
          error={error}
          showAllOption={false}
        />
      )}
      
      <main className={`flex-1 ${showNavigation ? 'ml-0' : 'w-full'}`}>
        {renderContent()}
      </main>

      {/* Department Modal */}
      {showDepartmentModal && selectedDepartment && (
        <DepartmentModal
          department={selectedDepartment}
          isOpen={showDepartmentModal}
          onClose={() => {
            setShowDepartmentModal(false);
            setSelectedDepartment(null);
          }}
        />
      )}

      {/* Add Department Modal */}
      {showAddDepartmentModal && (
        <AddDepartmentModal
          collegeId={user?.college_id}
          isOpen={showAddDepartmentModal}
          onClose={() => setShowAddDepartmentModal(false)}
          onDepartmentAdded={handleDepartmentAdded}
        />
      )}
    </div>
  );
};

export default Department;