import React from 'react';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const ReportStatusIndicators = ({ 
  currentReportId, 
  prompts, 
  hasUnsavedChanges, 
  lastSaved, 
  saving 
}) => {
  const { translateReport, currentLanguage } = useNamespacedTranslation();
  
  return (
    <>
      <p className="text-sm text-gray-500">
        {currentReportId ? translateReport('status.editingExisting') : translateReport('status.creatingNew')}
        {prompts.length > 0 && ` - ${translateReport('status.indicator')}: ${prompts[0]?.id || translateReport('status.notSpecified')}`}
      </p>
      
      {lastSaved && (
        <p className="text-xs text-green-600">
          {translateReport('status.lastSaved')}: {lastSaved.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
        </p>
      )}
      
      {saving && (
        <span className="text-sm text-blue-600 flex items-center gap-1">
          <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
          {translateReport('status.saving')}
        </span>
      )}
      
      {!saving && hasUnsavedChanges && (
        <span className="text-sm text-orange-600 flex items-center gap-1">
          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          {translateReport('status.unsavedChanges')}
        </span>
      )}
      
      {!saving && !hasUnsavedChanges && lastSaved && (
        <span className="text-sm text-green-600 flex items-center gap-1">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          {translateReport('status.saved')}
        </span>
      )}
    </>
  );
};

export default ReportStatusIndicators;
