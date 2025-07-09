import React, { useState } from 'react';
import { useNamespacedTranslation } from '../../hooks/useNamespacedTranslation';
import UniversityNav from './components/UniversityNav';
import CollegeCard from './components/CollegeCard';
import AddCollegeModal from './components/AddCollegeModal';

const CollegeAdminView = ({
  user,
  universitiesList,
  selectedUniversityId,
  handleUniversitySelect,
  universitiesLoading,
  universitiesError,
  pageTitle,
  countMessage,
  searchTerm,
  handleSearchChange,
  clearSearch,
  searchPlaceholderText,
  collegeError,
  collegesLoading,
  filteredColleges,
  openCollegePopup,
  onCollegeAdded,
  
}) => {
  const { translateCollege } = useNamespacedTranslation();
  const [isAddCollegeModalOpen, setIsAddCollegeModalOpen] = useState(false);

  const openAddCollegeModal = () => setIsAddCollegeModalOpen(true);
  const closeAddCollegeModal = () => setIsAddCollegeModalOpen(false);

  return (
    <>
      {(user?.role === 'admin' || user?.role === 'authority') && (
        <UniversityNav
          universitiesList={universitiesList}
          selectedUniversityId={selectedUniversityId}
          onSelectUniversity={handleUniversitySelect}
          loading={universitiesLoading}
          error={universitiesError}
        />
      )}

      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        {(user?.role === 'admin' || user?.role === 'authority') && (
          <div className="block md:hidden mb-6">
            <label htmlFor="university-selector-mobile" className="block text-sm font-medium text-text-muted mb-2">
              {translateCollege('adminView.selectUniversity')}
            </label>
            <select
              id="university-selector-mobile"
              value={selectedUniversityId || ''}
              onChange={(e) => handleUniversitySelect(e.target.value ? e.target.value : null)}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={universitiesLoading || !!universitiesError}
            >
              <option value="">{translateCollege('adminView.allUniversities')}</option>
              {universitiesList.map(uni => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
            {universitiesLoading && <p className="text-text-muted text-sm mt-1">{translateCollege('adminView.loadingUniversities')}</p>}
            {universitiesError && <p className="text-red-500 text-sm mt-1">{translateCollege('errors.errorLabel')}: {universitiesError}</p>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-text-dark mb-1">
              {pageTitle}
            </h1>
            <p className="text-text-muted text-sm">
              {countMessage}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={translateCollege('actions.clearSearch')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          
            {user?.role === 'university' && (
              <button
                onClick={openAddCollegeModal}
                className="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-150 transform  shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {translateCollege('adminView.addCollege')}
              </button>
            )}
          </div>
        </div>

        {collegeError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            <p>{translateCollege('errors.fetchCollegesError')}: {collegeError}</p>
          </div>
        )}

        {collegesLoading && !collegeError && <p className="text-text-muted">{translateCollege('loading.loadingColleges')}</p>}

        {!collegesLoading && filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredColleges.map(college => (
              <CollegeCard
                key={college.id}
                college={college}
                onClick={openCollegePopup}
              />
            ))}
          </div>
        ) : (
          !collegesLoading && !collegeError && (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-center text-text-muted text-lg">
                {searchTerm
                  ? translateCollege('emptyStates.noCollegesMatchingSearch')
                  : (user?.role === 'admin' || user?.role === 'authority') && selectedUniversityId
                    ? translateCollege('emptyStates.noCollegesForUniversity', { university: universitiesList.find(u => u.id === selectedUniversityId)?.name })
                    : (user?.role === 'admin' || user?.role === 'authority')
                        ? translateCollege('emptyStates.noCollegesAvailableOrSelect')
                        : translateCollege('emptyStates.noCollegesForYourUniversity')
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 text-primary hover:text-primary-dark font-medium"
                >
                  {translateCollege('actions.clearSearch')}
                </button>
              )}
            </div>
          )
        )}
      </main>
      
      {isAddCollegeModalOpen && user?.role === 'university' && (
        <AddCollegeModal
          isOpen={isAddCollegeModalOpen}
          onClose={closeAddCollegeModal}
          onCollegeAdded={(newCollege) => {
            onCollegeAdded(newCollege);
            closeAddCollegeModal();
          }}
        />
      )}
    </>
  );
};

export default CollegeAdminView;