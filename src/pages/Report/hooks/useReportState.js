import { useState, useEffect } from 'react';

export const useReportState = () => {
  const [reportData, setReportData] = useState({});
  const [originalReportData, setOriginalReportData] = useState({});
  const [currentReportId, setCurrentReportId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Compare current data with original data to determine if there are unsaved changes
  const checkForUnsavedChanges = (currentData, originalData) => {
    const keys = ['result', 'weak', 'improve_weak', 'power', 'improve_power'];
    
    for (const key of keys) {
      const current = (currentData[key] || '').trim();
      const original = (originalData[key] || '').trim();
      if (current !== original) {
        return true;
      }
    }
    return false;
  };

  const handleSectionChange = (sectionKey, value) => {
    const newReportData = {
      ...reportData,
      [sectionKey]: value
    };
    
    setReportData(newReportData);
    
    // Check if current data differs from original data
    const hasChanges = checkForUnsavedChanges(newReportData, originalReportData);
    setHasUnsavedChanges(hasChanges);
  };

  const resetReportData = () => {
    const emptyData = {
      result: '',
      weak: '',
      improve_weak: '',
      power: '',
      improve_power: ''
    };
    
    setReportData(emptyData);
    setOriginalReportData(emptyData);
    setCurrentReportId(null);
    setHasUnsavedChanges(false);
    setLastSaved(null);
  };

  const setInitialReportData = (data, reportId = null) => {
    setReportData(data);
    setOriginalReportData(data); // Store original data for comparison
    setCurrentReportId(reportId);
    setHasUnsavedChanges(false);
  };

  const markAsSaved = (reportId = null) => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
    setOriginalReportData({ ...reportData }); // Update original data after save
    
    if (reportId) {
      setCurrentReportId(reportId);
    }
  };

  return {
    reportData,
    originalReportData,
    currentReportId,
    lastSaved,
    hasUnsavedChanges,
    handleSectionChange,
    resetReportData,
    setInitialReportData,
    markAsSaved
  };
};
