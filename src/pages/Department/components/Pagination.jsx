import React from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const DepartmentPagination = ({ currentPage, totalPages, onPageChange, totalRecords, hasPrevPage, hasNextPage }) => {
  const {translateDepartment} = useNamespacedTranslation('pages.department');
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last page
      const firstPage = 1;
      const lastPage = totalPages;
      
      // Calculate start and end of visible page range
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      // Add pages
      if (startPage > 1) {
        pages.push(1); // Always show first page
        if (startPage > 2) pages.push('...'); // Add ellipsis if needed
      }
      
      // Add visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...'); // Add ellipsis if needed
        pages.push(totalPages); // Always show last page
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-bottom space-y-4 mt-8 ">
      
      <div className="flex items-center space-x-1 px-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage || currentPage === 1}
          title={translateDepartment('pagination.firstPage')}
          className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L9.586 11l4.707-4.707a1 1 0 111.414 1.414L12.414 11l3.293 3.293a1 1 0 010 1.414zM6.707 15.707a1 1 0 01-1.414 0L.586 11l4.707-4.707a1 1 0 111.414 1.414L3.414 11l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          title={translateDepartment('pagination.previousPage')}
          className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-1 px-1">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                •••
              </span>
            ) : (
              <button
                key={`page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          title={translateDepartment('pagination.nextPage')}
          className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage || currentPage === totalPages}
          title={translateDepartment('pagination.lastPage')}
          className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 11 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zM13.293 15.707a1 1 0 010-1.414L17.586 11l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="text-sm text-gray-600">
        {translateDepartment('pagination.summary', { 
          totalRecords, 
          currentPage, 
          totalPages 
        })}
      </div>
    </div>
  );
};

export default DepartmentPagination;