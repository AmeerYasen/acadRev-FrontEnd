import React from 'react';

const CollegeCard = ({ 
  item, 
  parentCode, 
  onClick, 
  itemType = 'college' // 'college', 'department', 'program'
}) => {
  // Dynamic content based on item type
  const getItemContent = () => {
    switch (itemType) {
      case 'department':
        return {
          name: item.name,
          established: item.established,
          head: item.head_name || item.chair_name,
          count: item.programs?.length || 0,
          countLabel: 'Programs'
        };
      case 'program':
        return {
          name: item.name,
          established: item.established || item.start_year,
          head: item.coordinator_name || item.director_name,
          count: item.courses?.length || item.students?.length || 0,
          countLabel: item.courses ? 'Courses' : 'Students'
        };
      default: // college
        return {
          name: item.name,
          established: item.established,
          head: item.head_name,
          count: item.departments?.length || 0,
          countLabel: 'Departments'
        };
    }
  };

  const content = getItemContent();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 group border border-gray-100 flex flex-col"
      onClick={() => onClick(item)}
    >
      <div className="h-2 bg-primary w-full group-hover:bg-primary-dark transition-colors duration-300"></div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-primary-dark font-semibold text-lg group-hover:text-primary transition-colors duration-300 flex-1 mr-2">
              {content.name}
            </h3>
            {parentCode && (
              <span className="text-xs font-mono px-2 py-0.5 bg-secondary/10 text-secondary rounded-md whitespace-nowrap">
                {parentCode}
              </span>
            )}
          </div>
          <div className="text-sm text-text-muted mb-1">
            Established: {content.established || 'N/A'}
          </div>
          {content.head && (
            <div className="text-sm text-text-muted mb-2">
              {itemType === 'department' ? 'Chair' : itemType === 'program' ? 'Coordinator' : 'Head'}: {content.head}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div></div>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-text-muted">
            {content.count} {content.countLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;