import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  CheckCircle, 
  Clock, 
  FileText 
} from "lucide-react";
import {
  fetchDomains,
  fetchIndicators,
  fetchResponses,
  fetchDomainSummary,
  submitResponse,
  removeResponse,
} from "../../../api/qualitativeAPI";
import { useToast } from "../../../context/ToastContext";

export const useQualitative = (programId) => {  // State management (domains are like areas, indicators are like items)
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null); // Stores selected domainId
  const [indicators, setIndicators] = useState({}); // Stores indicators per domainId: { [domainId]: [...] }
  const [responses, setResponses] = useState({}); // Stores responses: { "domainId-indicatorId": value }
  const [unsavedChanges, setUnsavedChanges] = useState({}); // Tracks unsaved changes: { "domainId-indicatorId": value }
  const [progress, setProgress] = useState({}); // Stores progress per domainId: { [domainId]: percentage }
  const [completedDomains, setCompletedDomains] = useState([]); // Array of completed domainIds
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    initial: true,
    indicators: false,
    saving: false,
  });
  const [error, setError] = useState(null);

  // Toast context
  const { showSuccess, showError } = useToast();
  // Load domain-specific data (indicators)
  const loadDomainData = useCallback(async (domainId) => {
    if (typeof domainId === 'undefined' || domainId === null) {
      console.warn("loadDomainData called with invalid domainId:", domainId);
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, indicators: true }));
      const indicatorsData = await fetchIndicators(domainId);
      
      setIndicators((prev) => ({ ...prev, [domainId]: indicatorsData || [] }));
    } catch (err) {
      console.error("Error loading domain data for domainId:", domainId, err);
      showError(`Failed to load indicators for domain ${domainId}`);
    } finally {
      setLoading((prev) => ({ ...prev, indicators: false }));
    }
  }, [showError]);
  // Load initial data for the qualitative page
  const loadInitialData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, initial: true }));
      setError(null);

      // Load domains, responses, and domain summary
      const [domainsData, responsesData, summaryData] = await Promise.all([
        fetchDomains(),
        fetchResponses(programId),
        fetchDomainSummary(programId)
      ]);

      setDomains(domainsData || []);
      setResponses(responsesData || {});
      console.log("Responses loaded:", responsesData);

      // Process domain summary to calculate progress
      const progressMap = {};
      const completed = [];
      
      if (summaryData && Array.isArray(summaryData)) {
        summaryData.forEach(domain => {
          progressMap[domain.domain_id] = domain.percentage;
          if (domain.percentage === 100) {
            completed.push(domain.domain_id);
          }
        });
      }
      
      setProgress(progressMap);
      setCompletedDomains(completed);

      // Auto-select first domain and load its specific data
      if (domainsData && domainsData.length > 0 && domainsData[0] && typeof domainsData[0].id !== 'undefined') {
        const firstDomainId = domainsData[0].id;
        setSelectedDomain(firstDomainId);
        await loadDomainData(firstDomainId);
      } else {
        setSelectedDomain(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load initial data");
      showError(err.message || "Failed to load initial data");
      console.error("Error loading initial data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, [programId, showError, loadDomainData]);

  // Handle domain selection
  const handleDomainSelect = useCallback((domainId) => {
    setSelectedDomain(domainId);
    loadDomainData(domainId);
  }, [loadDomainData]);
  // Handle response changes (local state only)
  const handleResponseChange = useCallback((domainId, indicatorId, evaluation, notes = '') => {
    const key = `${domainId}-${indicatorId}`;
    
    // Update local state for immediate UI feedback
    setResponses((prev) => ({
      ...prev,
      [key]: { evaluation, notes }
    }));

    // Track as unsaved change
    setUnsavedChanges((prev) => ({
      ...prev,
      [key]: { evaluation, notes, domainId, indicatorId }
    }));
  }, []);
  // Save all unsaved changes to backend
  const handleSaveResponses = useCallback(async () => {
    const unsavedKeys = Object.keys(unsavedChanges);
    
    if (unsavedKeys.length === 0) {
      showSuccess("No changes to save.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, saving: true }));

      // Submit all unsaved responses
      const promises = unsavedKeys.map(async (key) => {
        const change = unsavedChanges[key];
        return await submitResponse({
          programId: programId,
          indicatorId: change.indicatorId,
          domainId: change.domainId,
          evaluation: change.evaluation,
          notes: change.notes
        });
      });

      const results = await Promise.all(promises);

      // Update responses with backend IDs
      const updatedResponses = { ...responses };
      results.forEach((result, index) => {
        const key = unsavedKeys[index];
        const change = unsavedChanges[key];
        updatedResponses[key] = {
          evaluation: change.evaluation,
          notes: change.notes,
          id: result.id || result.insertId
        };
      });
      setResponses(updatedResponses);

      // Clear unsaved changes
      setUnsavedChanges({});

      // Refresh domain summary to get updated progress
      try {
        const summaryData = await fetchDomainSummary(programId);
        const progressMap = {};
        const completed = [];
        
        if (summaryData && Array.isArray(summaryData)) {
          summaryData.forEach(domain => {
            progressMap[domain.domain_id] = domain.percentage;
            if (domain.percentage === 100) {
              completed.push(domain.domain_id);
            }
          });
        }
        
        setProgress(progressMap);
        setCompletedDomains(completed);
      } catch (summaryError) {
        console.warn("Failed to refresh domain summary:", summaryError);
      }

      showSuccess(`Successfully saved ${unsavedKeys.length} response(s)!`);
    } catch (err) {
      console.error("Error saving responses:", err);
      showError("Failed to save responses. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  }, [unsavedChanges, responses, programId, showSuccess, showError]);
  // Remove response
  const handleRemoveResponse = useCallback(async (domainId, indicatorId) => {
    const key = `${domainId}-${indicatorId}`;
    const existingResponse = responses[key];
    
    if (!existingResponse || !existingResponse.id) {
      // Just remove from local state if no backend ID
      setResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[key];
        return newResponses;
      });
      
      // Also remove from unsaved changes
      setUnsavedChanges((prev) => {
        const newUnsaved = { ...prev };
        delete newUnsaved[key];
        return newUnsaved;
      });
      
      showSuccess("Response removed successfully!");
      return;
    }

    try {
      await removeResponse(existingResponse.id);
      
      setResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[key];
        return newResponses;
      });

      // Remove from unsaved changes as well
      setUnsavedChanges((prev) => {
        const newUnsaved = { ...prev };
        delete newUnsaved[key];
        return newUnsaved;
      });

      // Refresh domain summary to get updated progress
      try {
        const summaryData = await fetchDomainSummary(programId);
        const progressMap = {};
        const completed = [];
        
        if (summaryData && Array.isArray(summaryData)) {
          summaryData.forEach(domain => {
            progressMap[domain.domain_id] = domain.percentage;
            if (domain.percentage === 100) {
              completed.push(domain.domain_id);
            }
          });
        }
        
        setProgress(progressMap);
        setCompletedDomains(completed);
      } catch (summaryError) {
        console.warn("Failed to refresh domain summary:", summaryError);
      }

      showSuccess("Response removed successfully!");
    } catch (err) {
      console.error("Error removing response:", err);
      showError("Failed to remove response. Please try again.");
    }
  }, [responses, programId, showSuccess, showError]);

  // Get domain status (completed, in-progress, not-started)
  const getDomainStatus = useCallback((domainId) => {
    if (completedDomains.includes(domainId)) {
      return { 
        status: "completed", 
        color: "text-green-600", 
        bg: "bg-green-50 border-green-200", 
        icon: CheckCircle, 
        badge: "bg-green-100 text-green-800" 
      };
    }
    
    const domainCompletionPercent = progress[domainId];
    if (domainCompletionPercent && domainCompletionPercent > 0) {
      return { 
        status: "in-progress", 
        color: "text-blue-600", 
        bg: "bg-blue-50 border-blue-200", 
        icon: Clock, 
        badge: "bg-blue-100 text-blue-800" 
      };
    }

    return { 
      status: "not-started", 
      color: "text-gray-500", 
      bg: "bg-gray-50 border-gray-200", 
      icon: FileText, 
      badge: "bg-gray-100 text-gray-800" 
    };
  }, [completedDomains, progress]);

  // Calculate overall progress percentage
  const overallProgress = useMemo(() => {
    if (!domains || domains.length === 0) return 0;
    
    if (typeof progress !== 'object' || progress === null || Object.keys(progress).length === 0) {
      return 0;
    }
    
    let totalPercentageSum = 0;
    domains.forEach(domain => {
      if (Object.prototype.hasOwnProperty.call(progress, domain.id)) {
        totalPercentageSum += (Number.parseFloat(progress[domain.id]) || 0);
      }
    });
    
    return Math.round(totalPercentageSum / domains.length);
  }, [domains, progress]);

  // Load initial data on mount and when programId changes
  useEffect(() => {
    if (programId) {
      loadInitialData();
    }
  }, [programId, loadInitialData]);
  return {
    // State
    domains,
    selectedDomain,
    indicators, // Access per domain: indicators[selectedDomain]
    responses,
    unsavedChanges,
    progress, // Access per domain: progress[domainId]
    completedDomains,
    isEvaluationModalOpen,
    loading,
    error,
    // Actions
    handleDomainSelect,
    handleResponseChange,
    handleSaveResponses,
    handleRemoveResponse,
    setIsEvaluationModalOpen,
    setError,
    // Utils
    getDomainStatus,
    OverallProgress: overallProgress,
  };
};
