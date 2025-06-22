import React from "react";

export const Separator = ({ 
  className = "", 
  orientation = "horizontal",
  ...props 
}) => {
  const baseClasses = "bg-gray-200";
  
  const orientationClasses = {
    horizontal: "h-px w-full",
    vertical: "w-px h-full"
  };
  
  return (
    <div
      className={`${baseClasses} ${orientationClasses[orientation]} ${className}`}
      {...props}
    />
  );
};
