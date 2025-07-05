import React from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const UniversityNav = ({
  universitiesList,
  selectedUniversityId,
  onSelectUniversity,
  loading,
  error
}) => {
  const {translateCollege} = useNamespacedTranslation();

  if (loading) {
    return <p className="text-text-muted p-6">{translateCollege('loading.universities')}</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm p-6">{translateCollege('errors.errorLoadingUniversities', { error })}</p>;
  }

  return (
    <aside className="flex-none w-64 p-6 bg-background-aside border-r border-gray-100 overflow-y-auto shadow-sm hidden md:block">
      <h2 className="mt-0 mb-6 text-xl font-semibold text-secondary pb-2 border-b border-gray-200">
        {translateCollege('navigation.universities')}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        <li
          className={`py-3 px-4 cursor-pointer rounded-lg transition duration-200 ease-in-out text-text-dark ${
            !selectedUniversityId
              ? 'bg-primary text-white font-medium shadow-md'
              : 'hover:bg-gray-100 border border-transparent'
          }`}
          onClick={() => onSelectUniversity(null)} // Pass null for "All Universities"
        >
          {translateCollege('navigation.allUniversities')}
        </li>
        {universitiesList.map(uni => (
          <li
            key={uni.id}
            className={`py-3 px-4 cursor-pointer rounded-lg transition duration-200 ease-in-out text-text-dark ${
              selectedUniversityId === uni.id
                ? 'bg-primary text-white font-medium shadow-md'
                : 'hover:bg-gray-100 border border-transparent'
            }`}
            onClick={() => onSelectUniversity(uni.id)}
          >
            {uni.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UniversityNav;