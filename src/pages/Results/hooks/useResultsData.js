// src/pages/Results/hooks/useResultsData.js
import { useState, useEffect } from 'react';
import { 
  fetchDomainWeights, 
  fetchDomainScores, 
  fetchWeightedResults,
  fetchCompleteQualitativeAnalysis 
} from '../../../api/resultsAPI';
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
    complete: false
  });
  
  const [data, setData] = useState({
    weights: [],
    scores: [],
    weightedResults: null,
    completeAnalysis: null
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
      
      const completeAnalysis = await fetchCompleteQualitativeAnalysis(targetProgramId);
      
      // Update all data at once
      setData({
        weights: completeAnalysis.weights,
        scores: completeAnalysis.scores,
        weightedResults: completeAnalysis.weightedResults,
        completeAnalysis
      });
      
      console.log('useResultsData - Complete analysis loaded for program:', targetProgramId, completeAnalysis);
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
      completeAnalysis: null
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
    
    // Actions
    loadDomainWeights,
    loadDomainScores,
    loadWeightedResults,
    loadCompleteAnalysis,
    refreshData,
    resetData
  };
};
