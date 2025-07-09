import React from "react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

// Renamed from CollegeCard to DepartmentDisplayCard and made specific to departments
const DepartmentDisplayCard = ({
  item, // Expects a department object
  parentCode, // e.g., department code
  onClick,
}) => {
  const { translateDepartment } = useNamespacedTranslation("pages.department");

  // console.log('DepartmentDisplayCard data:', item); // For debugging if needed

  // Department-specific details
  const departmentName = item.name || translateDepartment("viewCard.unnamed");

  let establishedDisplay = translateDepartment("viewCard.notAvailable");
  if (item.created_at) {
    try {
      establishedDisplay = new Date(item.created_at).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch (e) {
      console.error("Error formatting date:", item.created_at, e);
      // establishedDisplay remains 'N/A' or you could set it to item.created_at if preferred on error
    }
  }

  const departmentHead = item.department_head_name; // Assuming chair_name might also be used
  const programCount = item.programs_count || 0;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 group border border-gray-100 flex flex-col h-full" // Added h-full for consistent height
      onClick={() => onClick(item)}
    >
      <div className="h-2 bg-primary w-full group-hover:bg-primary-dark transition-colors duration-300"></div>

      <div className="p-5 flex flex-col flex-grow">
        {" "}
        {/* Use flex-grow to make content area fill height */}
        <div className="flex-grow space-y-2">
          {" "}
          {/* Added space-y for consistent spacing */}
          <div className="flex justify-between items-start mb-3">
            {" "}
            {/* Increased bottom margin */}
            <h3 className="text-primary-dark font-semibold text-lg group-hover:text-primary transition-colors duration-300 flex-1 mr-2">
              {departmentName}
            </h3>
            {parentCode && (
              <span className="text-xs font-mono px-2 py-0.5 bg-secondary/10 text-secondary rounded-md whitespace-nowrap">
                {parentCode}
              </span>
            )}
          </div>
          {departmentHead && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-500">
                {translateDepartment("viewCard.chair")}:
              </span>{" "}
              {departmentHead}
            </div>
          )}
          {/* You can add other department-specific fields here if needed */}
          {/* For example, display college or university if available in 'item' */}
          {item.college_name && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-500">
                {translateDepartment("viewCard.college")}:
              </span>{" "}
              {item.college_name}
            </div>
          )}
          {item.university_name && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-500">
                {translateDepartment("viewCard.university")}:
              </span>{" "}
              {item.university_name}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          {" "}
          {/* Added more top margin and padding */}
          <div className="text-xs text-primary-dark font-medium">
            {translateDepartment("viewCard.type")}
          </div>{" "}
          {/* Static type display */}
          <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
            {" "}
            {/* Enhanced styling for count */}
            {translateDepartment("viewCard.programCount", {
              count: programCount,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDisplayCard;
