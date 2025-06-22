import React from "react";

export const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  disabled = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };
    const sizes = {
    sm: "px-3 py-2 text-sm h-8",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
