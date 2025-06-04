import { useState, useEffect, useCallback } from "react";
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
import { area, u } from "framer-motion/client";

export const useQuantitative = (programId) => {
  // State management
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [headers, setHeaders] = useState({});
  const [items, setItems] = useState({});
  const [responses, setResponses] = useState({});
  const [progress, setProgress] = useState({});
  const [completedAreas, setCompletedAreas] = useState([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [loading, setLoading] = useState({
    initial: true,
    headers: false,
    items: false,
    saving: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, initial: true }));
      setError(null);

      const [areasData, progressData, completedData, responsesData] = await Promise.all([
        fetchAreas(),
        fetchAreaProgress(programId),
        fetchCompletedAreas(programId),
        fetchProgramResponses(programId),
      ]);

      setAreas(areasData || []);
      const Realprogress = Number.isInteger(progressData[0]) ? progressData[0] : -2; // Ensure progress is an object

      // // Transform progress data
      // const progressMap = {};
      // if (progressData && Array.isArray(progressData)) {
      //   progressData.forEach((item) => {
      //     progressMap[item.area_id] = Number.parseFloat(item.completion_percent) || 0;
      //   });
      // }
      setProgress(Realprogress);

      setCompletedAreas(completedData || []);

      // Transform responses
      const transformedResponses = {};
      if (responsesData && Array.isArray(responsesData)) {
        responsesData.forEach((response) => {
          const key = `${response.areaId}-${response.itemId}-${response.headerId}`;
          transformedResponses[key] = response.value;
        });
      }
      setResponses(transformedResponses);

      // Auto-select first area
      if (areasData && areasData.length > 0) {
        setSelectedArea(areasData[0].id);
        loadAreaData(areasData[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
      console.error("Error loading initial data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, [programId]);

  // Load area-specific data
  const loadAreaData = useCallback(async (areaId) => {
    try {
      setLoading((prev) => ({ ...prev, headers: true, items: true }));

      const [headersData, itemsData] = await Promise.all([fetchHeaders(areaId), fetchItems(areaId)]);

      setHeaders((prev) => ({ ...prev, [areaId]: headersData || [] }));
      setItems((prev) => ({ ...prev, [areaId]: itemsData || [] }));
    } catch (err) {
      console.error("Error loading area data:", err);
      setError("Failed to load area data");
    } finally {
      setLoading((prev) => ({ ...prev, headers: false, items: false }));
    }
  }, []);

  // Handle area selection
  const handleAreaSelect = useCallback((areaId) => {
    setSelectedArea(areaId);
    // if (!headers[areaId] || !items[areaId]) {
      loadAreaData(areaId);
    // }
  }, [headers, items, loadAreaData]);

  // Handle input changes
  const handleInputChange = useCallback((key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Save area data
  const handleSaveArea = useCallback(async (areaId) => {
    try {
      setLoading((prev) => ({ ...prev, saving: true }));
      setError(null); // Clear previous errors
      setSuccess(null); // Clear previous success messages

      // Log the entries that will be processed, similar to your original log
      console.log("Processing entries for area save. All response entries:", Object.entries(responses));      const areaResponses = Object.entries(responses)
        .reduce((acc, [key, value]) => {
          const parts = key.split('-');
          // Expect key format: "areaId-itemId-headerId"
          if (parts.length === 3) {
            const responseDbAreaId = parts[0]; // This is areaId from the key, as a string
            const responseDbItemId = parts[1]; // This is itemId from the key, as a string
            const responseDbHeaderId = parts[2]; // This is headerId from the key, as a string

            // Filter for responses belonging to the current areaId
            // Ensure consistent type for comparison (areaId is likely a number)
            if (responseDbAreaId === String(areaId)) {
              // Only include responses that have a meaningful value
              if (value !== null && value !== undefined && String(value).trim() !== "") {
                acc.push({
                  header_id: Number.parseInt(responseDbHeaderId),
                  item_id: Number.parseInt(responseDbItemId),
                  value: String(value)
                });
              }
            }
          }
          return acc;
        }, []);

        console.log("Responses after save:", areaResponses);
        if (areaResponses.length > 0) {
        const responseArray={ responses: areaResponses, program_id: programId }; // Ensure programId is passed correctly
        await submitResponses(responseArray); // Pass programId as separate parameter
        setSuccess(`Area data saved successfully!`);
        setTimeout(() => setSuccess(null), 3000);

        // Update progress by refetching
        const updatedProgressData = await fetchAreaProgress(programId);
        console.log("Updated progress data:", updatedProgressData);
        // const progressMap = {};
        // if (updatedProgressData && Array.isArray(updatedProgressData)) {
        //   updatedProgressData.forEach((item) => {
        //     progressMap[item.area_id] = Number.parseFloat(item.completion_percent) || 0;
        //   });
        // }
        setProgress(updatedProgressData || -1);

        // Optionally, refetch completed areas if saving can change completion status
        const updatedCompletedData = await fetchCompletedAreas(programId);
        setCompletedAreas(updatedCompletedData || []);
      }
    } catch (err) {
      console.error("Error saving area data:", err);
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  }, [responses, programId, progress]);

  // Get area status
  const getAreaStatus = useCallback((areaId) => {
    if (completedAreas.includes(areaId)) {
      return {
        status: "completed",
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
        icon: CheckCircle,
        badge: "bg-green-100 text-green-800",
      };
    }

    const areaProgress = progress[areaId];
    if (areaProgress && areaProgress > 0) {
      return {
        status: "in-progress",
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
        icon: Clock,
        badge: "bg-blue-100 text-blue-800",
      };
    }

    return {
      status: "not-started",
      color: "text-gray-500",
      bg: "bg-gray-50 border-gray-200",
      icon: FileText,
      badge: "bg-gray-100 text-gray-800",
    };  }, [completedAreas, progress]);

  // Calculate overall progress
  const calculateOverallProgress = useCallback(() => {
    if (!areas.length) return 0;
    const totalProgress = Object.values(progress).reduce((sum, val) => sum + val, 0);
    return Math.round(totalProgress / areas.length);
  }, [areas, progress]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    areas,
    selectedArea,
    headers,
    items,
    responses,
    progress,
    completedAreas,
    isTableModalOpen,
    loading,
    error,
    success,
    
    // Actions
    handleAreaSelect,
    handleInputChange,
    handleSaveArea,
    setIsTableModalOpen,
    setError,
    setSuccess,
      // Utils
    getAreaStatus,
    calculateOverallProgress,
  };
};
