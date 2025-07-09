// src/api/resultsAPI.js
import { apiFetch } from './apiConfig';
import { QUALITATIVE_ENDPOINTS } from '../constants/index.js';

/**
 * ========================================
 * RESULTS API - QUALITATIVE SCORING
 * API functions for the Results page
 * ========================================
 */

/**
 * Get domain weights (Wi) - Weight of each domain based on indicator count
 * @returns {Promise<Array>} List of domains with their weights
 * @example
 * [
 *   {
 *     domain_id: 1,
 *     domain_name: "المجال الأول",
 *     indicator_count: 15,
 *     domain_weight: 25.42
 *   }
 * ]
 */
export const fetchDomainWeights = async () => {
  try {
    console.log('Results API - fetchDomainWeights: Making API call to', QUALITATIVE_ENDPOINTS.GET_DOMAIN_WEIGHTS);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAIN_WEIGHTS);
    console.log('Results API - fetchDomainWeights: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from domain weights endpoint');
    }
    
    // Validate required fields
    data.forEach((domain, index) => {
      if (!domain.domain_id || !domain.domain_ar || !domain.domain_en ||typeof domain.domain_weight !== 'number') {
        throw new Error(`Invalid domain weight data at index ${index}`);
      }
    });
    
    return data;
  } catch (error) {
    console.error('Results API - fetchDomainWeights: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch domain weights');
  }
};

/**
 * Get domain scores (Si) for a specific program - Score based on responses
 * @param {string|number} programId - Program ID
 * @returns {Promise<Array>} List of domains with their scores
 * @example
 * [
 *   {
 *     domain_id: 1,
 *     domain_name: "المجال الأول",
 *     indicator_count: 15,
 *     domain_score: 85.33
 *   }
 * ]
 */
export const fetchDomainScores = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch domain scores');
    }
    
    console.log('Results API - fetchDomainScores: Making API call for program:', programId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAIN_SCORES(programId));
    console.log('Results API - fetchDomainScores: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from domain scores endpoint');
    }
    
    // Validate required fields
    data.forEach((domain, index) => {
      if (!domain.domain_id || !domain.domain_ar || !domain.domain_en|| typeof domain.domain_score !== 'number') {
        throw new Error(`Invalid domain score data at index ${index}`);
      }
    });
    
    return data;
  } catch (error) {
    console.error('Results API - fetchDomainScores: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch domain scores');
  }
};

/**
 * Get weighted results (Wi×Si) for a specific program - Complete analysis
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} Complete weighted analysis with final score
 * @example
 * {
 *   program_id: "123",
 *   result_by_domain: [
 *     {
 *       domain_id: 1,
 *       domain_name: "المجال الأول",
 *       indicator_count: 15,
 *       domain_weight: 25.42,
 *       domain_score: 85.33,
 *       domain_weighted_score: 21.691486
 *     }
 *   ],
 *   final_program_score: 84.85
 * }
 */
export const fetchWeightedResults = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch weighted results');
    }
    
    console.log('Results API - fetchWeightedResults: Making API call for program:', programId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_WEIGHTED_RESULTS(programId));
    console.log('Results API - fetchWeightedResults: Received data:', data);
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from weighted results endpoint');
    }
    
    // Validate required fields
    if (!data.program_id || !Array.isArray(data.result_by_domain) || typeof data.final_program_score !== 'number') {
      throw new Error('Missing required fields in weighted results response');
    }
    
    
    return data;
  } catch (error) {
    console.error('Results API - fetchWeightedResults: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch weighted results');
  }
};

/**
 * Get complete qualitative analysis for a program
 * Combines all three scoring endpoints for comprehensive analysis
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} Complete analysis with weights, scores, and weighted results
 * @example
 * {
 *   weights: [...],
 *   scores: [...],
 *   weightedResults: {...},
 *   programId: "123",
 *   summary: {
 *     totalDomains: 3,
 *     totalIndicators: 59,
 *     finalScore: 84.85,
 *     scoringBreakdown: {
 *       excellent: 1, // domains with 90%+ score
 *       good: 1,      // domains with 75-89% score
 *       acceptable: 1, // domains with 60-74% score
 *       poor: 0       // domains with <60% score
 *     }
 *   }
 * }
 */
export const fetchCompleteQualitativeAnalysis = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required for complete analysis');
    }
    
    console.log('Results API - fetchCompleteQualitativeAnalysis: Loading complete analysis for program:', programId);
    
    // Fetch all data in parallel for better performance
    const [weights, scores, weightedResults] = await Promise.all([
      fetchDomainWeights(),
      fetchDomainScores(programId),
      fetchWeightedResults(programId)
    ]);
    
    // Generate summary statistics
    const summary = generateAnalysisSummary(weightedResults);
    
    const analysis = {
      weights,
      scores,
      weightedResults,
      programId: String(programId),
      summary
    };
    
    console.log('Results API - fetchCompleteQualitativeAnalysis: Complete analysis loaded:', analysis);
    return analysis;
  } catch (error) {
    console.error('Results API - fetchCompleteQualitativeAnalysis: Failed to load complete analysis:', error);
    throw new Error(error.message || 'Failed to load complete qualitative analysis');
  }
};

/**
 * Generate summary statistics from weighted results
 * @param {Object} weightedResults - Weighted results data
 * @returns {Object} Summary statistics
 */
const generateAnalysisSummary = (weightedResults) => {
  if (!weightedResults || !Array.isArray(weightedResults.result_by_domain)) {
    return {
      totalDomains: 0,
      totalIndicators: 0,
      finalScore: 0,
      scoringBreakdown: { excellent: 0, good: 0, acceptable: 0, poor: 0 }
    };
  }
  
  const domains = weightedResults.result_by_domain;
  const totalDomains = domains.length;
  const totalIndicators = domains.reduce((sum, domain) => sum + (domain.indicator_count || 0), 0);
  const finalScore = weightedResults.final_program_score || 0;
  
  // Categorize domains by score
  const scoringBreakdown = domains.reduce((breakdown, domain) => {
    const score = domain.domain_score || 0;
    if (score >= 90) breakdown.excellent++;
    else if (score >= 75) breakdown.good++;
    else if (score >= 60) breakdown.acceptable++;
    else breakdown.poor++;
    return breakdown;
  }, { excellent: 0, good: 0, acceptable: 0, poor: 0 });
  
  return {
    totalDomains,
    totalIndicators,
    finalScore,
    scoringBreakdown
  };
};

/**
 * Format score for display with appropriate color coding
 * @param {number} score - Score value (0-100)
 * @returns {Object} Formatted score with color class
 */
export const formatScoreDisplay = (score, language = 'en') => {
  const numericScore = Number(score) || 0;
  
  let colorClass = 'text-red-600';
  let label = language === 'ar' ? 'ضعيف' : 'Poor';
  
  if (numericScore >= 90) {
    colorClass = 'text-green-600';
    label = language === 'ar' ? 'ممتاز' : 'Excellent';
  } else if (numericScore >= 75) {
    colorClass = 'text-blue-600';
    label = language === 'ar' ? 'جيد' : 'Good';
  } else if (numericScore >= 60) {
    colorClass = 'text-yellow-600';
    label = language === 'ar' ? 'مقبول' : 'Acceptable';
  }
  
  return {
    score: numericScore.toFixed(2),
    colorClass,
    label,
    percentage: `${numericScore.toFixed(2)}%`
  };
};

/**
 * Export raw data to CSV format for analysis
 * @param {Object} analysisData - Complete analysis data
 * @returns {string} CSV formatted string
 */
export const exportAnalysisToCSV = (analysisData) => {
  if (!analysisData || !analysisData.weightedResults) {
    throw new Error('Invalid analysis data for CSV export');
  }
  
  const headers = [
    'Domain ID',
    'Domain Name (Arabic)',
    'Indicator Count',
    'Domain Weight (%)',
    'Domain Score (%)',
    'Domain Weighted Score'
  ];
  
  const rows = analysisData.weightedResults.result_by_domain.map(domain => [
    domain.domain_id,
    domain.domain_ar,
    domain.domain_en,
    domain.indicator_count,
    domain.domain_weight.toFixed(2),
    domain.domain_score.toFixed(2),
    domain.domain_weighted_score.toFixed(2)
  ]);
  
  // Add final score row
  rows.push([
    '',
    'Final Program Score',
    '',
    '',
    '',
    analysisData.weightedResults.final_program_score.toFixed(2)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
};
