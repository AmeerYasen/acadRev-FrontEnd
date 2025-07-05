import { useState, useEffect, useContext } from 'react';
import { fetchAllReports, saveAndUpdateReport } from '../../../api/reportsAPI';
import  {useToast}  from '../../../context/ToastContext';
import { t } from 'i18next';

export const useReportSave = (
  programId, 
  currentDomain, 
  prompts, 
  reportData, 
  reportState
) => {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  // Load existing reports when dependencies change
  useEffect(() => {
    const loadExistingReport = async () => {
      if (programId && currentDomain && prompts.length > 0) {
        try {
          const reportsData = await fetchAllReports(programId);
          console.log('Existing reports:', reportsData);
          
          const currentIndicatorId = prompts[0]?.id;
          
          const existingReport = Array.isArray(reportsData) 
            ? reportsData.find(report => 
                report.ind === currentIndicatorId && 
                report.program === parseInt(programId)
              )
            : null;
            
          if (existingReport) {
            const loadedData = {
              result: existingReport.result || '',
              weak: existingReport.weak || '',
              improve_weak: existingReport.improve_weak || '',
              power: existingReport.power || '',
              improve_power: existingReport.improve_power || ''
            };
            
            reportState.setInitialReportData(loadedData, existingReport.id);
          } else {
            reportState.resetReportData();
          }
        } catch (error) {
          console.error('Error loading existing reports:', error);
          reportState.resetReportData();
        }
      }
    };    loadExistingReport();
  }, [programId, currentDomain?.id, prompts[0]?.id]);

  const handleSaveReport = async () => {
    if (!currentDomain?.id) {
      showToast(t('report:error.selectDomainFirst', 'Please select a domain first'), 'error');
      return;
    }

    if (!programId) {
      showToast(t('report:error.programIdRequired', 'Program ID is required'), 'error');
      return;
    }

    const currentIndicatorId = prompts.length > 0 ? prompts[0]?.id : null;
    if (!currentIndicatorId) {
      showToast(t('report:error.validIndicatorRequired', 'Please ensure a valid indicator exists'), 'error');
      return;
    }

    const editorSections = [
      { key: 'result' },
      { key: 'power' },
      { key: 'weak' },
      { key: 'improve_power' },
      { key: 'improve_weak' }
    ];

    const hasContent = editorSections.some(section => 
      reportData[section.key] && reportData[section.key].trim() !== ''
    );
    
    if (!hasContent) {
      showToast(t('report:error.contentRequired', 'Please enter content in at least one section'), 'error');
      return;
    }

    try {
      setSaving(true);
      
      const reportToSave = {
        ind: currentIndicatorId,
        domain: currentDomain.id,
        program: parseInt(programId),
        result: reportData.result || '',
        weak: reportData.weak || '',
        improve_weak: reportData.improve_weak || '',
        power: reportData.power || '',
        improve_power: reportData.improve_power || ''
      };
      
      console.log('Saving report:', reportToSave);
      
      const response = await saveAndUpdateReport(reportToSave);
      console.log('Save response:', response);
      
      const newReportId = response?.inserted && response?.id ? response.id : reportState.currentReportId;
      reportState.markAsSaved(newReportId);
      
      const message = response?.updated 
        ? t('report:success.reportUpdated', 'Report updated successfully') 
        : t('report:success.reportSaved', 'Report saved successfully');
      showToast(message, 'success');
      
    } catch (error) {
      console.error('Error saving report:', error);
      showToast(t('report:error.saveFailed', 'An error occurred while saving the report'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (!saving && currentDomain) {
          handleSaveReport();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saving, currentDomain, reportData]);

  // Warning when leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (reportState.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = t('report:messages.beforeUnloadWarning', 'You have unsaved changes. Do you want to leave?');
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [reportState.hasUnsavedChanges]);

  return {
    saving,
    handleSaveReport
  };
};
