import React from 'react';
import { Button } from "../../../components/ui/button";

const ReportSaveButton = ({ 
  onSave, 
  saving, 
  disabled, 
  hasUnsavedChanges, 
  currentReportId,
  showNoIndicatorsMessage = false
}) => {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        onClick={onSave}
        disabled={disabled}
        className={`px-8 py-3 text-base font-semibold ${
          hasUnsavedChanges 
            ? 'bg-orange-600 hover:bg-orange-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        size="lg"
      >
        {saving ? (
          <>
            <div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full ml-2"></div>
            جاري الحفظ...
          </>
        ) : (
          <>
            {currentReportId ? 'تحديث التقرير' : 'حفظ التقرير'}
            {hasUnsavedChanges && ' *'}
          </>
        )}
      </Button>
      
      {showNoIndicatorsMessage && (
        <p className="text-sm text-gray-500 mt-2">
          لا توجد مؤشرات متاحة للحفظ
        </p>
      )}
    </div>
  );
};

export default ReportSaveButton;
