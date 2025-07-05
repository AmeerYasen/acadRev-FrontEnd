import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, ArrowUpDown, Loader2, AlertCircle } from 'lucide-react';
import { fetchUniversities, addUniversity, editUniversity, deleteUniversity } from '../../api/universityApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import { ROUTES, ROLES } from '../../constants';
import { lazy, Suspense } from 'react';
// import UniversityTable from './components/UniversityTable';
// import UniversityModalManager from './components/UniversityModalManager';
// import UniversityStaffView from './components/UniversityStaffView';

const UniversityTable = lazy(() => import('./components/UniversityTable'));
const UniversityModalManager = lazy(() => import('./components/UniversityModalManager'));
const UniversityStaffView = lazy(() => import('./components/UniversityStaffView'));


// Custom Debounce Hook for Search Optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function University() {
  const { user, isLoggedIn } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const { translateUniversity } = useNamespacedTranslation();
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // view, add, edit
  });
  const [sortColumn, setSortColumn] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Check if user is admin or authority
  const isAdminOrAuthority = user && (user.role === ROLES.ADMIN || user.role === ROLES.AUTHORITY);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN);
    }
  }, [isLoggedIn, navigate]);

  // Load universities for admin/authority
  useEffect(() => {
    if (isLoggedIn && isAdminOrAuthority) {
      loadUniversities();
    } else {
      setLoading(false); // No need to load universities list for staff
    }
  }, [isLoggedIn, isAdminOrAuthority]);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const data = await fetchUniversities();
      setUniversities(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || translateUniversity('errorLoadingUniversities');
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredUniversities = universities.filter((university) =>
    university.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleOpenModal = (mode, university = null) => {
    setSelectedUniversity(university);
    setModalState({
      isOpen: true,
      mode,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  };

  const handleSaveUniversity = async (formData, isEditing) => {
    try {
      let savedUniversity;
      if (isEditing) {
        savedUniversity = await editUniversity(formData);
        setUniversities((prev) =>
          prev.map((uni) => (uni.id === savedUniversity.id ? savedUniversity : uni))
        );
        showSuccess(translateUniversity('universityUpdated'));
      } else {
        savedUniversity = await addUniversity(formData);
        setUniversities((prev) => [...prev, savedUniversity]);
        showSuccess(translateUniversity('universityAdded'));
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.message || (isEditing ? 
        translateUniversity('errorUpdatingUniversity') : 
        translateUniversity('errorAddingUniversity'));
      showError(errorMessage);
    }
  };

  const handleDeleteUniversity = async (universityId) => {
    if (!window.confirm(translateUniversity('confirmDelete'))) {
      return;
    }

    try {
      await deleteUniversity(universityId);
      setUniversities((prev) => prev.filter((uni) => uni.id !== universityId));
      showSuccess(translateUniversity('universityDeleted'));
    } catch (err) {
      const errorMessage = err.message || translateUniversity('errorDeletingUniversity');
      showError(errorMessage);
    }
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortAsc(column === sortColumn ? !sortAsc : true);
  };

  const sortedUniversities = useMemo(() => {
    const sorted = [...filteredUniversities];
    sorted.sort((a, b) => {
      const valA = a[sortColumn] ?? '';
      const valB = b[sortColumn] ?? '';
      const comparison =
        typeof valA === 'number' && typeof valB === 'number'
          ? valA - valB
          : String(valA).localeCompare(String(valB));
      return sortAsc ? comparison : -comparison;
    });
    return sorted;
  }, [filteredUniversities, sortColumn, sortAsc]);

  const renderSortableHeader = (label, columnKey) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortColumn === columnKey && (
          <ArrowUpDown size={14} className={sortAsc ? '' : 'transform rotate-180'} />
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-700">{translateUniversity('loadingUniversities')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-100 rounded-lg mt-8">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">An error occurred</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminOrAuthority) {
    return <UniversityStaffView />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{translateUniversity('title')}</h1>

      {/* Search and Add University Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={translateUniversity('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {user && user.role === ROLES.AUTHORITY && (
          <button
            onClick={() => handleOpenModal('add')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            <span>{translateUniversity('addUniversity')}</span>
          </button>
        )}
      </div>

      <UniversityTable
        universities={sortedUniversities}
        onView={(uni) => handleOpenModal('view', uni)}
        onEdit={(uni) => handleOpenModal('edit', uni)}
        onDelete={handleDeleteUniversity}
        renderSortableHeader={renderSortableHeader}
      />

      <UniversityModalManager
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUniversity}
        universityData={selectedUniversity}
        mode={modalState.mode}
        userRole={user?.role}
      />
    </div>
  );
}

export default University;