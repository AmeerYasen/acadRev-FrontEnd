import { useState, useEffect, useContext } from 'react';
import { fetchAllReports, saveAndUpdateReport } from '../../../api/reportsAPI';
import  {useToast}  from '../../../context/ToastContext';

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
      showToast('يرجى اختيار مجال أولاً', 'error');
      return;
    }

    if (!programId) {
      showToast('معرف البرنامج مطلوب', 'error');
      return;
    }

    const currentIndicatorId = prompts.length > 0 ? prompts[0]?.id : null;
    if (!currentIndicatorId) {
      showToast('يرجى التأكد من وجود مؤشر صالح', 'error');
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
      showToast('يرجى إدخال محتوى في قسم واحد على الأقل', 'error');
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
      
      const message = response?.updated ? 'تم تحديث التقرير بنجاح' : 'تم حفظ التقرير بنجاح';
      showToast(message, 'success');
      
    } catch (error) {
      console.error('Error saving report:', error);
      showToast('حدث خطأ أثناء حفظ التقرير', 'error');
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
        event.returnValue = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟';
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
