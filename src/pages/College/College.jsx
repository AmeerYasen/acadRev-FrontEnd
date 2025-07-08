import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchColleges, editCollege, fetchMyCollege, fetchCollegesByUniversity } from '../../api/collegeApi';
import { fetchUniversities } from '../../api/universityApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import { ROUTES, ROLES, getRoleWeight } from '../../constants';
import CollegeAdminView from './CollegeAdminView';
import CollegeStaffView from './CollegeStaffView';
import CollegePopup from './components/CollegeModal';

// Custom Debounce Hook for Search Optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const College = () => {
  const { user, isLoggedIn } = useAuth();
  const { showError, showSuccess } = useToast();
  const { translateCollege } = useNamespacedTranslation();
  const navigate = useNavigate();
  const userRole = user?.role;
  const userRoleWeight = getRoleWeight(userRole);

  const [universitiesList, setUniversitiesList] = useState([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);
  const [universitiesError, setUniversitiesError] = useState(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [currentColleges, setCurrentColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const loadUniversitiesData = async () => {
      if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
        try {
          setUniversitiesLoading(true);
          setUniversitiesError(null);
          const data = await fetchUniversities();
          setUniversitiesList(data);
        } catch (err) {        setUniversitiesError(err.message || translateCollege('errors.fetchUniversitiesFailed'));
        setUniversitiesList([]);
        showError(err.message || translateCollege('errors.fetchUniversitiesFailed'));
        } finally {
          setUniversitiesLoading(false);
        }
      } else {
        setUniversitiesList([]);
        setUniversitiesLoading(false);
        setUniversitiesError(null);
      }
    };
    loadUniversitiesData();
  }, [userRole, showError]);

  useEffect(() => {
    const loadCollegesData = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        if (userRole === ROLES.UNIVERSITY) {
          data = await fetchCollegesByUniversity();
        } else if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
          const params = selectedUniversityId ? { universityId: selectedUniversityId } : {};
          data = await fetchColleges(params);
        } else if (userRole === ROLES.COLLEGE || userRole === ROLES.DEPARTMENT) {
          const myCollegeData = await fetchMyCollege();
          data = myCollegeData ? [myCollegeData] : [];
        } else {
          showError(translateCollege('errors.noFetchLogicForRole', { role: userRole }));
          data = await fetchColleges({});
        }

        setCurrentColleges(Array.isArray(data) ? data : (data ? [data] : []));
      } catch (err) {
        setError(err.message || 'Failed to fetch colleges.');
        setCurrentColleges([]);
        showError(err.message || 'Failed to fetch colleges.');
      } finally {
        setLoading(false);
      }
    };

    if (userRole && isLoggedIn) {
      loadCollegesData();
    } else {
      setLoading(false);
      setCurrentColleges([]);
    }
  }, [userRole, selectedUniversityId, user?.universityId, user, isLoggedIn, showError]);

  

  const selectedUniversityForContext = useMemo(() => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
      return universitiesList.find(uni => uni.id === selectedUniversityId);
    }
    return null;
  }, [selectedUniversityId, universitiesList, userRole]);

  const filteredColleges = useMemo(() => {
    let collegesToProcess = [...currentColleges];

    if ((userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) && selectedUniversityId) {
      collegesToProcess = collegesToProcess.filter(college => college.university_id === selectedUniversityId);
    }

    let results = collegesToProcess;

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase().trim();
    if (lowerSearchTerm) {
      results = results.filter(college =>
        (college.name && college.name.toLowerCase().includes(lowerSearchTerm)) ||
        (college.code && college.code.toLowerCase().includes(lowerSearchTerm)) ||
        (college.description && college.description.toLowerCase().includes(lowerSearchTerm)) ||
        (college.head_name && college.head_name.toLowerCase().includes(lowerSearchTerm))
      );
    }
    return results;
  }, [currentColleges, debouncedSearchTerm, selectedUniversityId, userRole]);

  const pageTitle = useMemo(() => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
      return selectedUniversityForContext ? `${selectedUniversityForContext.name} Colleges` : 'All Colleges';
    }
    return user?.universityName || 'Colleges';
  }, [selectedUniversityForContext, userRole, user]);

  const countMessage = useMemo(() => {
    const baseCountText = `${filteredColleges.length} ${filteredColleges.length === 1 ? translateCollege('countMessage.college') : translateCollege('countMessage.colleges')}`;
    if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
      const locationText = selectedUniversityForContext ? translateCollege('countMessage.inUniversity', { university: selectedUniversityForContext.name }) : translateCollege('countMessage.acrossAllUniversities');
      return debouncedSearchTerm.trim()
        ? translateCollege('countMessage.resultsFound', { count: filteredColleges.length, location: locationText })
        : `${baseCountText} ${locationText}`;
    }
    return debouncedSearchTerm.trim()
      ? translateCollege('countMessage.resultsFound', { count: filteredColleges.length, location: '' })
      : baseCountText;
  }, [filteredColleges.length, debouncedSearchTerm, selectedUniversityForContext, userRole, translateCollege]);

  const searchPlaceholderText = useMemo(() => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
      return selectedUniversityForContext ? translateCollege('searchPlaceholder.inUniversity', { university: selectedUniversityForContext.name }) : translateCollege('searchPlaceholder.allColleges');
    }
    return translateCollege('searchPlaceholder.colleges');
  }, [selectedUniversityForContext, userRole, translateCollege]);

  const handleUniversitySelect = (universityId) => {
    setSelectedUniversityId(universityId);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openPopup = (college) => {
    setSelectedCollege(college);
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = '';
    setSelectedCollege(null);
  };

  const handleUpdateCollege = async (updatedCollegeData) => {
    try {
      const savedCollege = await editCollege(updatedCollegeData);
      
      // Refetch the college data for college users to ensure fresh data
      if (userRole === ROLES.COLLEGE || userRole === ROLES.DEPARTMENT) {
        const myCollegeData = await fetchMyCollege();
        setCurrentColleges(myCollegeData ? [myCollegeData] : []);
      } else {
        // For other roles, update the local state
        setCurrentColleges(prevColleges =>
          prevColleges.map(college =>
            college.id === savedCollege.id ? savedCollege : college
          )
        );
      }
      
      closePopup();
      showSuccess(translateCollege('messages.collegeUpdatedSuccess'));
    } catch (err) {
      showError(translateCollege('errors.updateCollegeFailed', { message: err.message }));
    }
  };

  const handleCollegeAdded = () => {
    const loadCollegesData = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (userRole === ROLES.UNIVERSITY && user.universityId) {
          data = await fetchCollegesByUniversity(user.universityId);
        } else if (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY) {
          const params = selectedUniversityId ? { universityId: selectedUniversityId } : {};
          data = await fetchColleges(params);
        } else {
          data = await fetchColleges({});
        }
        setCurrentColleges(Array.isArray(data) ? data : (data ? [data] : []));
      } catch (err) {
        setError(err.message || 'Failed to fetch colleges.');
        setCurrentColleges([]);
        showError(err.message || 'Failed to fetch colleges.');
      } finally {
        setLoading(false);
      }
    };
    loadCollegesData();
  };

  const handleCollegeDeleted = (deletedCollegeId) => {
    // Remove the deleted college from the current colleges list
    setCurrentColleges(prevColleges =>
      prevColleges.filter(college => college.id !== deletedCollegeId)
    );
    showSuccess(translateCollege('messages.collegeDeletedSuccess'));
  };

  const isOverallLoading = (userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY)
    ? universitiesLoading || loading
    : loading;

  if (isOverallLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-text-muted">{translateCollege('loading.loadingData')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-light">
      {userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY || userRole === ROLES.UNIVERSITY ? (
        <CollegeAdminView
          user={user}
          universitiesList={universitiesList}
          selectedUniversityId={selectedUniversityId}
          handleUniversitySelect={handleUniversitySelect}
          universitiesLoading={universitiesLoading}
          universitiesError={universitiesError}
          pageTitle={pageTitle}
          countMessage={countMessage}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          clearSearch={() => setSearchTerm('')}
          searchPlaceholderText={searchPlaceholderText}
          collegeError={error}
          collegesLoading={loading}
          filteredColleges={filteredColleges}
          openCollegePopup={openPopup}
          onCollegeAdded={handleCollegeAdded}
        />
      ) : userRole === ROLES.COLLEGE || userRole === ROLES.DEPARTMENT ? (
        <CollegeStaffView
          user={user}
          colleges={currentColleges}
          onUpdateCollege={handleUpdateCollege}
          openCollegePopup={openPopup}
        />
      ) : (
        <main className="flex-grow p-6 md:p-8 overflow-y-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-text-dark mb-1">{pageTitle}</h1>
              <p className="text-text-muted text-sm">{countMessage}</p>
            </div>
            {userRoleWeight <= 3 && (
  <div className="relative mt-4 sm:mt-0 w-full sm:w-72">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
      </svg>
    </div>
    <input
      type="text"
      placeholder={searchPlaceholderText}
      value={searchTerm}
      onChange={handleSearchChange}
      className="py-2 pl-10 pr-10 block w-full border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
    />
    {searchTerm && (
      <button
        onClick={() => setSearchTerm('')}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"                    aria-label={translateCollege('actions.clearSearch')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
)}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              <p>{translateCollege('errors.errorLabel')}: {error}</p>
            </div>
          )}

          {!loading && !error && filteredColleges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-center text-text-muted text-lg">
                {debouncedSearchTerm ? translateCollege('emptyStates.noCollegesMatchingSearch') : translateCollege('emptyStates.noCollegesAvailable')}
              </p>
              {debouncedSearchTerm && (
                <button onClick={() => setSearchTerm('')} className="mt-4 text-primary hover:text-primary-dark font-medium">
                  {translateCollege('actions.clearSearch')}
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredColleges.length > 0 && (
            <CollegeStaffView
              user={user}
              colleges={filteredColleges}
              onUpdateCollege={handleUpdateCollege}
              openCollegePopup={openPopup}
            />
          )}
        </main>
      )}

      {isPopupOpen && selectedCollege && (
        <CollegePopup
          college={selectedCollege}
          onClose={closePopup}
          onUpdate={handleUpdateCollege}
          userRole={userRole}
          loggedInUser={user}
          onCollegeDeleted={handleCollegeDeleted}
        />
      )}
    </div>
  );
};

export default College;