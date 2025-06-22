import React from 'react';

const ReportStatusIndicators = ({ 
  currentReportId, 
  prompts, 
  hasUnsavedChanges, 
  lastSaved, 
  saving 
}) => {
  return (
    <>
      <p className="text-sm text-gray-500">
        {currentReportId ? `تحرير تقرير موجود` : 'إنشاء تقرير جديد'}
        {prompts.length > 0 && ` - المؤشر: ${prompts[0]?.id || 'غير محدد'}`}
      </p>
      
      {lastSaved && (
        <p className="text-xs text-green-600">
          آخر حفظ: {lastSaved.toLocaleTimeString('ar-SA')}
        </p>
      )}
      
      {saving && (
        <span className="text-sm text-blue-600 flex items-center gap-1">
          <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
          جاري الحفظ...
        </span>
      )}
      
      {!saving && hasUnsavedChanges && (
        <span className="text-sm text-orange-600 flex items-center gap-1">
          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          تغييرات غير محفوظة
        </span>
      )}
      
      {!saving && !hasUnsavedChanges && lastSaved && (
        <span className="text-sm text-green-600 flex items-center gap-1">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          محفوظ
        </span>
      )}
    </>
  );
};

export default ReportStatusIndicators;
