import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle, Info, AlertCircle, X } from "lucide-react";

const NotificationBar = ({ 
  type = "info", 
  message, 
  onDismiss, 
  className = "",
  showIcon = true,
  dismissible = true
}) => {
  if (!message) return null;

  // Configuration for different notification types
  const typeConfig = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      iconColor: "text-green-400",
      buttonColor: "text-green-400 hover:text-green-600",
      icon: CheckCircle
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-400", 
      textColor: "text-red-700",
      iconColor: "text-red-400",
      buttonColor: "text-red-400 hover:text-red-600",
      icon: AlertTriangle
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-700", 
      iconColor: "text-yellow-400",
      buttonColor: "text-yellow-400 hover:text-yellow-600",
      icon: AlertCircle
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
      iconColor: "text-blue-400", 
      buttonColor: "text-blue-400 hover:text-blue-600",
      icon: Info
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`max-w-7xl mx-auto px-4 py-2 ${className}`}>
      <div className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-r-md shadow-sm`}>
        <div className="flex items-start">
          {showIcon && (
            <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
          )}
          <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
            <p className={`text-sm ${config.textColor} leading-relaxed`}>
              {message}
            </p>
          </div>
          {dismissible && onDismiss && (
            <button 
              onClick={onDismiss} 
              className={`ml-auto ${config.buttonColor} text-lg font-bold hover:scale-110 transition-all duration-200 flex-shrink-0`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
