import React from 'react';
import { Button } from "../../../components/ui/button";
import { Menu } from "lucide-react";
import ReportStatusIndicators from './ReportStatusIndicators';
import BackButton from './BackButton';

const ReportHeader = ({ 
  setSidebarOpen,
  programId,
  currentReportId,
  prompts,
  hasUnsavedChanges,
  lastSaved,
  saving,
  onSave
}) => {  return (
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
              <h1 className="text-2xl font-bold text-gray-900">تقرير التقويم الذاتي</h1>
              
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">
                  {programId ? `برنامج رقم: ${programId}` : 'برنامج اللغة العربية وآدابها'}
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
