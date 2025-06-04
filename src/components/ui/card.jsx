import React from "react";

export const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`p-6 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p
      className={`text-sm text-gray-600 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
