import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ 
  size = "default", 
  message = "Loading...", 
  fullScreen = true,
  className = "",
  variant = "default" 
}) => {
  // Size configurations
  const sizeConfig = {
    small: { spinner: "h-4 w-4", text: "text-sm" },
    default: { spinner: "h-8 w-8", text: "text-base" },
    large: { spinner: "h-12 w-12", text: "text-lg" },
    xlarge: { spinner: "h-16 w-16", text: "text-xl" }
  };

  // Variant configurations
  const variantConfig = {
    default: "text-blue-600",
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };

  const config = sizeConfig[size] || sizeConfig.default;
  const colorClass = variantConfig[variant] || variantConfig.default;

  // Content
  const spinnerContent = (
    <div className={`text-center ${className}`}>
      <Loader2 className={`${config.spinner} ${colorClass} animate-spin mx-auto`} />
      {message && (
        <p className={`mt-3 text-gray-600 ${config.text}`}>
          {message}
        </p>
      )}
    </div>
  );

  // Return full screen or inline version
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
