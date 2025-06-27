import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from "../../components/LoadingSpinner";
import ReportSidebar from './components/ReportSidebar';
import ReportHeader from './components/ReportHeader';
import ReportPromptCard from './components/ReportPromptCard';
import ReportEditorSection from './components/ReportEditorSection';
import ReportPagination from './components/ReportPagination';
import ReportSaveButton from './components/ReportSaveButton';

import { useReportData } from './hooks/useReportData';
import { useReportState } from './hooks/useReportState';
import { useReportSave } from './hooks/useReportSave';
import { editorSections } from './utils/reportHelpers';

const ReportMain = () => {
  const { programId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Custom hooks for managing state and data
  const {
    domains,
    currentDomain,
    prompts,
    promptsPagination,
    loading,
    handleDomainChange,
    handlePromptsPageChange
  } = useReportData(programId);

  const reportState = useReportState();
  
  const { saving, handleSaveReport } = useReportSave(
    programId,
    currentDomain,
    prompts,
    reportState.reportData,
    reportState
  );

  // Handle domain change with state reset
  const handleDomainChangeWithReset = (domain) => {
    handleDomainChange(domain);
    if (currentDomain?.id !== domain.id) {
      reportState.resetReportData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <ReportSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            domains={domains}
            currentDomain={currentDomain}
            handleDomainChange={handleDomainChangeWithReset}
          />

          <div className="flex-1">            <ReportHeader
              setSidebarOpen={setSidebarOpen}
              programId={programId}
              currentReportId={reportState.currentReportId}
              prompts={prompts}
              hasUnsavedChanges={reportState.hasUnsavedChanges}
              lastSaved={reportState.lastSaved}
              saving={saving}
              onSave={handleSaveReport}
            />

            <ReportPromptCard
              currentDomain={currentDomain}
              prompts={prompts}
            />

            {/* Editor Sections */}
            <div className="space-y-6 mt-6">
              {editorSections.map((section, index) => (
                <ReportEditorSection
                  key={section.key}
                  section={section}
                  value={reportState.reportData[section.key]}
                  onChange={reportState.handleSectionChange}
                  index={index}
                />
              ))}
            </div>

            <ReportPagination
              pagination={promptsPagination}
              onPageChange={handlePromptsPageChange}
            />

            <ReportSaveButton
              onSave={handleSaveReport}
              saving={saving}
              disabled={saving || !currentDomain || !prompts.length}
              hasUnsavedChanges={reportState.hasUnsavedChanges}
              currentReportId={reportState.currentReportId}
              showNoIndicatorsMessage={!prompts.length && currentDomain}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportMain;
