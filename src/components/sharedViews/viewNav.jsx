import React from 'react';

const UniversityNav = ({
  itemsList,
  selectedItemId,
  onSelectItem,
  loading,
  error,
  itemType = 'Universities', // Default to 'Universities', can be 'Colleges', 'Departments', etc.
  showAllOption = true
}) => {
  if (loading) {
    return <p className="text-text-muted p-6">Loading {itemType.toLowerCase()}...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm p-6">Error: {error}</p>;
  }

  return (
    <aside className="flex-none w-64 p-6 bg-background-aside border-r border-gray-100 overflow-y-auto shadow-sm hidden md:block">
      <h2 className="mt-0 mb-6 text-xl font-semibold text-secondary pb-2 border-b border-gray-200">
        {itemType}
      </h2>
      <ul className="list-none p-0 m-0 space-y-2">
        {showAllOption && (
          <li
            className={`py-3 px-4 cursor-pointer rounded-lg transition duration-200 ease-in-out text-text-dark ${
              !selectedItemId
                ? 'bg-primary text-white font-medium shadow-md'
                : 'hover:bg-gray-100 border border-transparent'
            }`}
            onClick={() => onSelectItem(null)}
          >
            All {itemType}
          </li>
        )}
        {itemsList.map(item => (
          <li
            key={item.id}
            className={`py-3 px-4 cursor-pointer rounded-lg transition duration-200 ease-in-out text-text-dark ${
              selectedItemId === item.id
                ? 'bg-primary text-white font-medium shadow-md'
                : 'hover:bg-gray-100 border border-transparent'
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UniversityNav;