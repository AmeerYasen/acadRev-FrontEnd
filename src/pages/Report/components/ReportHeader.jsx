import React from 'react';
import { Button } from "../../../components/ui/button";
import { Menu } from "lucide-react";
import ReportStatusIndicators from './ReportStatusIndicators';
import BackButton from './BackButton';
import { useNamespacedTranslation } from '../../../hooks/useNamespacedTranslation';

const ReportHeader = ({ 
  setSidebarOpen,
  programId,
  currentReportId,
  prompts,
  hasUnsavedChanges,
  lastSaved,
  saving,
  onSave
}) => {
  const { translateReport } = useNamespacedTranslation();  return (
    <div className="mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{translateReport('title')}</h1>
              
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">
                  {programId ? translateReport('programNumber', { programId }) : translateReport('defaultProgramName')}
                </p>
                
                <ReportStatusIndicators
                  currentReportId={currentReportId}
                  prompts={prompts}
                  hasUnsavedChanges={hasUnsavedChanges}
                  lastSaved={lastSaved}
                  saving={saving}
                />
              </div>
            </div>
          </div>

          <BackButton 
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={onSave}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
