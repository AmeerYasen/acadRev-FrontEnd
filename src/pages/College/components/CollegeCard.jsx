import React from "react";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";

const CollegeCard = ({ college, universityCode, onClick }) => {
  const { translateCollege } = useNamespacedTranslation();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 group border border-gray-100 flex flex-col" // Added flex flex-col
      onClick={() => onClick(college)}
    >
      <div className="h-2 bg-primary w-full group-hover:bg-primary-dark transition-colors duration-300"></div>
      <div className="p-5 flex flex-col flex-grow">
        {/* Added flex flex-col flex-grow */}
        <div className="flex-grow">
          {/* This div will take up available space */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-primary-dark font-semibold text-lg group-hover:text-primary transition-colors duration-300 flex-1 mr-2">
              {college.name}
            </h3>
            {universityCode && (
              <span className="text-xs font-mono px-2 py-0.5 bg-secondary/10 text-secondary rounded-md whitespace-nowrap">
                {universityCode}
              </span>
            )}
          </div>
          <div className="text-sm text-text-muted mb-1">
            {translateCollege("card.established")}:{" "}
            {new Date(college.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) || translateCollege("card.notAvailable")}
          </div>
          {college.head_name && (
            <div className="text-sm text-text-muted mb-2">
              {translateCollege("card.head")}: {college.head_name}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          {/* Placeholder for other info or actions if needed */}
          <div></div>{" "}
          {/* Empty div to push departments count to the right if no other info */}
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-text-muted">
            {college.department_count || 0}{" "}
            {translateCollege("card.departments")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
