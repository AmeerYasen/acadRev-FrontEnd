import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  CheckCircle, 
  Clock, 
  FileText 
} from "lucide-react";
import {
  fetchAreas,
  fetchItems,
  fetchProgramResponses,
  fetchAreaProgress,
  fetchCompletedAreas,
  submitResponses,
  fetchHeaders,
} from "../../../api/quantitativeAPI";
import { useToast } from "../../../context/ToastContext";
import { useNamespacedTranslation } from "../../../hooks/useNamespacedTranslation";



export const useQuantitative = (programId) => {
const { translateQuantitative } = useNamespacedTranslation();
// State management
const [areas, setAreas] = useState([]);
const [selectedArea, setSelectedArea] = useState(null); // Stores selected areaId
const [headers, setHeaders] = useState({}); // Stores headers per areaId: { [areaId]: [...] }
const [items, setItems] = useState({});     // Stores items per areaId: { [areaId]: [...] }
const [responses, setResponses] = useState({}); // Stores responses: { "areaId-itemId-headerId": value }
const [progress, setProgress] = useState({});   // Stores progress per areaId: { [areaId]: percentage }
const [completedAreas, setCompletedAreas] = useState([]); // Array of completed areaIds
const [isTableModalOpen, setIsTableModalOpen] = useState(false);
const [loading, setLoading] = useState({
  initial: true,
  headers: false,
  items: false,
  saving: false,
});
const [error, setError] = useState(null);

// Toast context
const { showSuccess, showError } = useToast();

// Load area-specific data (headers and items)
const loadAreaData = useCallback(async (areaId) => {
  if (typeof areaId === 'undefined' || areaId === null) {
      console.warn("loadAreaData called with invalid areaId:", areaId);
      return;
  }
  try {
    setLoading((prev) => ({ ...prev, headers: true, items: true }));
    const [headersData, itemsData, areaResponses] = await Promise.all([
      fetchHeaders(areaId), 
      fetchItems(areaId), 
      fetchProgramResponses(areaId, programId)
    ]);
    setHeaders((prev) => ({ ...prev, [areaId]: headersData || [] }));
    setItems((prev) => ({ ...prev, [areaId]: itemsData || [] }));
    setResponses((prev) => ({...prev,[areaId]: areaResponses || [] }));  } catch (err) {
    console.error("Error loading area data for areaId:", areaId, err);
    showError(translateQuantitative('errors.loadAreaFailed', { area: areaId }));
  } finally {
    setLoading((prev) => ({ ...prev, headers: false, items: false }));  }
}, [programId, showError]); // Include dependencies

// Load initial data for the quantitative page
const loadInitialData = useCallback(async () => {
  try {
    setLoading((prev) => ({ ...prev, initial: true }));
    setError(null);

    const [areasData, progressData, completedData] = await Promise.all([
      fetchAreas(),
      fetchAreaProgress(programId),
      fetchCompletedAreas(programId),
    ]);

    setAreas(areasData || []);

    // Transform progress data into a map: { areaId: percentage }
    const progressMap = {};
    if (progressData && Array.isArray(progressData)) {
      progressData.forEach((item) => {
        if (item && typeof item.area_id !== 'undefined' && typeof item.completion_percent !== 'undefined') {
          progressMap[item.area_id] = Number.parseFloat(item.completion_percent) || 0;
        }
      });
    }
    setProgress(progressMap);

    setCompletedAreas(completedData || []);

    // Load responses for the first area if available
    let initialResponses = {};
    if (areasData && areasData.length > 0 && areasData[0] && typeof areasData[0].id !== 'undefined') {
      const firstAreaId = areasData[0].id;
      // Fetch initial responses for the first area
      const responsesData = await fetchProgramResponses(firstAreaId, programId); // Added await
      
      if (responsesData && Array.isArray(responsesData)) {
        responsesData.forEach((response) => {
          if (response && typeof response.areaId !== 'undefined' && 
              typeof response.itemId !== 'undefined' && 
              typeof response.headerId !== 'undefined') {
            const key = `${response.areaId}-${response.itemId}-${response.headerId}`;
            initialResponses[key] = response.value;
          }
        });
      }
      setResponses(initialResponses);

      // Auto-select first area and load its specific data (headers, items)
      setSelectedArea(firstAreaId);
      await loadAreaData(firstAreaId); // Await to ensure data is loaded or error is caught here
    } else {
      // No areas, so clear responses and selected area
      setResponses({});
      setSelectedArea(null);
    }  } catch (err) {
    showError(err.message || translateQuantitative('errors.loadFailed'));
    console.error("Error loading initial data:", err);  } finally {
    setLoading((prev) => ({ ...prev, initial: false }));
  }
}, [programId, showError, loadAreaData]); // Include showError dependency

// Handle area selection
const handleAreaSelect = useCallback((areaId) => {
  setSelectedArea(areaId);
  loadAreaData(areaId); // Load data for the newly selected area
}, [loadAreaData]);

// Handle input changes for responses - memoized with stable reference
const handleInputChange = useCallback((key, value) => {
  const parts = key.split('-'); // "areaId-itemId-headerId"
  if (parts.length === 3) {
    const [areaId, itemId, headerId] = parts;
    
    setResponses((prev) => ({
      ...prev,
      [areaId]: {
        ...prev[areaId],
        grid: {
          ...prev[areaId]?.grid,
          [headerId]: {
            ...prev[areaId]?.grid?.[headerId],
            [itemId]: value
          }
        }
      }
    }));
  } else {
    // Fallback for old flat structure
    setResponses((prev) => ({ ...prev, [key]: value }));
  }
}, []);

// Save area data
const handleSaveArea = useCallback(async (areaId) => {
  try {
    setLoading((prev) => ({ ...prev, saving: true }));
    setError(null);

    let areaResponsesToSubmit = [];

    // Handle nested grid structure
    const areaData = responses[areaId];
    if (areaData?.grid) {
      Object.entries(areaData.grid).forEach(([headerId, headerData]) => {
        Object.entries(headerData).forEach(([itemId, value]) => {
          if (value !== null && value !== undefined && String(value).trim() !== "") {
            areaResponsesToSubmit.push({
              header_id: Number.parseInt(headerId),
              item_id: Number.parseInt(itemId),
              value: String(value)
            });
          }
        });
      });
    }
    
    if (areaResponsesToSubmit.length > 0) {
      const payload = { responses: areaResponsesToSubmit, program_id: programId };
      await submitResponses(payload);
      showSuccess(translateQuantitative('success.areaSaved'));

      // Refetch progress and completed areas as they might have changed
      const updatedProgressData = await fetchAreaProgress(programId);
      console.log("Updated progress data:", updatedProgressData);
      const newProgressMap = {};
      if (updatedProgressData && Array.isArray(updatedProgressData)) {
        updatedProgressData.forEach((item) => {
           if (item && typeof item.area_id !== 'undefined' && typeof item.completion_percent !== 'undefined') {
            newProgressMap[item.area_id] = Number.parseFloat(item.completion_percent) || 0;
          }
        });
      }
      setProgress(newProgressMap);

      const updatedCompletedData = await fetchCompletedAreas(programId);
      setCompletedAreas(updatedCompletedData || []);
    } else {
      showSuccess("No changes to save for this area.");
    }
  } catch (err) {
    console.error("Error saving area data:", err);
    showError(translateQuantitative('errors.saveFailed'));
  } finally {
    setLoading((prev) => ({ ...prev, saving: false }));
  }
}, [responses, programId, showSuccess, showError]); // Dependencies for saving

// Get area status (completed, in-progress, not-started) - memoized for performance
const getAreaStatus = useCallback((areaId) => {
  if (completedAreas.includes(areaId)) {
    return { status: "completed", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle, badge: "bg-green-100 text-green-800" };
  }
  
  const areaCompletionPercent = progress[areaId]; // progress is now { areaId: percentage }
  if (areaCompletionPercent && areaCompletionPercent > 0) {
    return { status: "in-progress", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Clock, badge: "bg-blue-100 text-blue-800" };
  }

  return { status: "not-started", color: "text-gray-500", bg: "bg-gray-50 border-gray-200", icon: FileText, badge: "bg-gray-100 text-gray-800" };
}, [completedAreas, progress]);

// Calculate overall progress percentage using useMemo for memoized value
const overallProgress = useMemo(() => {
  if (!areas || areas.length === 0) return 0;
  
  // progress is expected to be an object: { areaId: percentage }
  if (typeof progress !== 'object' || progress === null || Object.keys(progress).length === 0) {
    // If no progress data yet, or not in expected format, overall progress is 0
    return 0;
  }
  // Summing up progress percentages from the 'progress' object, for areas that exist in 'areas' state
  let totalPercentageSum = 0;
  areas.forEach(area => {
      if (Object.prototype.hasOwnProperty.call(progress, area.id)) {
          totalPercentageSum += (Number.parseFloat(progress[area.id]) || 0);
      }
  });
  
  return Math.round(totalPercentageSum / areas.length);
}, [areas, progress]);



// Memoized current area responses for the selected area


// Load initial data on mount and when programId changes
useEffect(() => {
  if (programId) { // Only load if programId is available
    loadInitialData();
  }
}, [programId, loadInitialData]); // loadInitialData is memoized

return {
  // State
  areas,
  selectedArea,
  headers, // Access per area: headers[selectedArea]
  items,   // Access per area: items[selectedArea]
  responses,
  progress, // Access per area: progress[areaId] for individual, or use overallProgress
  completedAreas,
  isTableModalOpen,
  loading,
  error,
  // Actions
  handleAreaSelect,
  handleInputChange,
  handleSaveArea,
  setIsTableModalOpen,
  setError,    // Allow parent component to set error
  // Utils
  getAreaStatus,
  OverallProgress: overallProgress, // This is now a memoized value, not a function
};
};
