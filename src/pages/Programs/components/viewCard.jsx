import React from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const ProgramDisplayCard = ({ 
  item, // Expects a program object
  parentCode, // e.g., department code
  onClick, 
}) => {
  const { translatePrograms } = useNamespacedTranslation();

  // Program-specific details
  const programName = item.program_name || translatePrograms('viewCard.unnamedProgram');
  //TODO: Uncomment and adjust the date formatting 
  // if (item.created_at) {
  //   try {
  //     establishedDisplay = new Date(item.created_at).toLocaleDateString(undefined, {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //     });
  //   } catch (e) {
  //     console.error("Error formatting date:", item.created_at, e);
  //   }
  // }
  
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 group border border-gray-100 flex flex-col h-full"
      onClick={() => onClick(item)}
    >
      <div className="h-2 bg-primary w-full group-hover:bg-primary-dark transition-colors duration-300"></div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-primary-dark font-semibold text-lg group-hover:text-primary transition-colors duration-300 flex-1 mr-2">
              {programName}
            </h3>
            {parentCode && (
              <span className="text-xs font-mono px-2 py-0.5 bg-secondary/10 text-secondary rounded-md whitespace-nowrap">
                {parentCode}
              </span>
            )}
          </div>          
          
          
          {item.department_name && (
             <div className="text-sm text-gray-600">
               <span className="font-medium text-gray-500">{translatePrograms('viewCard.department')}:</span> {item.department_name}
             </div>
          )}
          
          {item.college_name && (
             <div className="text-sm text-gray-600">
               <span className="font-medium text-gray-500">{translatePrograms('viewCard.college')}:</span> {item.college_name}
             </div>
          )}
          
          {item.university_name && (
             <div className="text-sm text-gray-600">
               <span className="font-medium text-gray-500">{translatePrograms('viewCard.university')}:</span> {item.university_name}
             </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-primary-dark font-medium">{translatePrograms('viewCard.type')}</div>
        
        </div>
      </div>
    </div>
  );
};

export default ProgramDisplayCard;
