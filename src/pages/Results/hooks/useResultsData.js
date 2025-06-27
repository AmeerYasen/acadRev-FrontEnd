// src/pages/Results/hooks/useResultsData.js
import { useState, useEffect } from 'react';
import { 
  fetchDomainWeights, 
  fetchDomainScores, 
  fetchWeightedResults,
  fetchCompleteQualitativeAnalysis 
} from '../../../api/resultsAPI';
import { fetchProgramById } from '../../../api/programAPI';
import { useToast } from '../../../context/ToastContext';

/**
 * Custom hook for managing Results page data
 * Handles loading domain weights, scores, and weighted results
 * @param {string|number} programId - Program ID
 * @returns {Object} Results data and loading states
 */
export const useResultsData = (programId) => {
  // State management
  const [loading, setLoading] = useState({
    initial: true,
    weights: false,
    scores: false,
    weighted: false,
    complete: false,
    program: false
  });
  
  const [data, setData] = useState({
    weights: [],
    scores: [],
    weightedResults: null,
    completeAnalysis: null,
    programInfo: null
  });
  
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  /**
   * Load domain weights (Wi)
   */
  const loadDomainWeights = async () => {
    try {
      setLoading(prev => ({ ...prev, weights: true }));
      setError(null);
      
      const weights = await fetchDomainWeights();
      setData(prev => ({ ...prev, weights }));
      
      console.log('useResultsData - Domain weights loaded:', weights);
      return weights;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load domain weights';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('useResultsData - Error loading domain weights:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, weights: false }));
    }
  };

  /**
   * Load domain scores (Si) for specific program
   */
  const loadDomainScores = async (targetProgramId = programId) => {
    if (!targetProgramId) {
      throw new Error('Program ID is required to load domain scores');
    }
    
    try {
      setLoading(prev => ({ ...prev, scores: true }));
      setError(null);
      
      const scores = await fetchDomainScores(targetProgramId);
      setData(prev => ({ ...prev, scores }));
      
      console.log('useResultsData - Domain scores loaded for program:', targetProgramId, scores);
      return scores;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load domain scores';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('useResultsData - Error loading domain scores:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, scores: false }));
    }
  };

  /**
   * Load weighted results (Wi×Si) for specific program
   */
  const loadWeightedResults = async (targetProgramId = programId) => {
    if (!targetProgramId) {
      throw new Error('Program ID is required to load weighted results');
    }
    
    try {
      setLoading(prev => ({ ...prev, weighted: true }));
      setError(null);
      
      const weightedResults = await fetchWeightedResults(targetProgramId);
      setData(prev => ({ ...prev, weightedResults }));
      
      console.log('useResultsData - Weighted results loaded for program:', targetProgramId, weightedResults);
      return weightedResults;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load weighted results';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('useResultsData - Error loading weighted results:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, weighted: false }));
    }
  };
  /**
   * Load complete analysis (all endpoints combined)
   */
  const loadCompleteAnalysis = async (targetProgramId = programId) => {
    if (!targetProgramId) {
      throw new Error('Program ID is required to load complete analysis');
    }
    
    try {
      setLoading(prev => ({ ...prev, complete: true }));
      setError(null);
      
      // Load both complete analysis and program info
      const [completeAnalysis, programInfo] = await Promise.all([
        fetchCompleteQualitativeAnalysis(targetProgramId),
        fetchProgramById(targetProgramId)
      ]);
      
      // Update all data at once
      setData({
        weights: completeAnalysis.weights,
        scores: completeAnalysis.scores,
        weightedResults: completeAnalysis.weightedResults,
        completeAnalysis,
        programInfo
      });
      
      console.log('useResultsData - Complete analysis loaded for program:', targetProgramId, completeAnalysis);
      console.log('useResultsData - Program info loaded:', programInfo);
      return completeAnalysis;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load complete analysis';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('useResultsData - Error loading complete analysis:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, complete: false }));
    }
  };

  /**
   * Load program information by ID
   */
  const loadProgramInfo = async (targetProgramId = programId) => {
    if (!targetProgramId) {
      throw new Error('Program ID is required to load program information');
    }
    
    try {
      setLoading(prev => ({ ...prev, program: true }));
      setError(null);
      
      const programInfo = await fetchProgramById(targetProgramId);
      setData(prev => ({ ...prev, programInfo }));
      
      console.log('useResultsData - Program info loaded for program:', targetProgramId, programInfo);
      return programInfo;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load program information';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('useResultsData - Error loading program info:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, program: false }));
    }
  };

  /**
   * Refresh all data
   */
  const refreshData = async () => {
    if (programId) {
      await loadCompleteAnalysis(programId);
    }
  };
  /**
   * Reset all data
   */
  const resetData = () => {
    setData({
      weights: [],
      scores: [],
      weightedResults: null,
      completeAnalysis: null,
      programInfo: null
    });
    setError(null);
  };

  // Auto-load data when programId changes
  useEffect(() => {
    const initializeData = async () => {
      if (programId) {
        try {
          setLoading(prev => ({ ...prev, initial: true }));
          await loadCompleteAnalysis(programId);
        } catch (err) {
          console.error('useResultsData - Failed to initialize data:', err);
        } finally {
          setLoading(prev => ({ ...prev, initial: false }));
        }
      } else {
        // Load domain weights even without programId
        try {
          setLoading(prev => ({ ...prev, initial: true }));
          await loadDomainWeights();
        } catch (err) {
          console.error('useResultsData - Failed to load domain weights:', err);
        } finally {
          setLoading(prev => ({ ...prev, initial: false }));
        }
      }
    };

    initializeData();
  }, [programId]);
  // Computed values
  const hasData = data.weights.length > 0;
  const hasProgramData = programId && data.weightedResults;
  const isLoading = Object.values(loading).some(Boolean);
  const finalScore = data.weightedResults?.final_program_score || 0;
  const totalDomains = data.completeAnalysis?.summary?.totalDomains || 0;
  const totalIndicators = data.completeAnalysis?.summary?.totalIndicators || 0;
  const programName = data.programInfo?.name || '';
  const programInfo = data.programInfo;

  return {
    // Data
    data,
    error,
    
    // Loading states
    loading,
    isLoading,
      // Computed values
    hasData,
    hasProgramData,
    finalScore,
    totalDomains,
    totalIndicators,
    programName,
    programInfo,
    
    // Actions
    loadDomainWeights,
    loadDomainScores,
    loadWeightedResults,
    loadCompleteAnalysis,
    loadProgramInfo,
    refreshData,
    resetData
  };
};
