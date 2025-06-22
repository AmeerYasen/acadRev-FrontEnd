// src/api/qualitativeApi.js
import { apiFetch } from './apiConfig';
import { REPORT_ENDPOINTS } from '../constants/index.js';
/**
 * Fetch all domains
 * @returns {Promise<Array>} List of domains
 */

export const fetchAllDomains = async () => {
  try {
    const response = await apiFetch(REPORT_ENDPOINTS.GET_DOMAINS);
    console.log('Fetched domains response:', response);
    
    // Ensure we return an array
    if (response) {
      return Array.isArray(response) ? response : [];
    }
    
    // If response structure is different, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching domains:', error);
    // Return empty array instead of throwing to prevent crashes
    return [];
  }
};
/**
 * Fetch prompts for a specific domain
 * @param {string|number} domainId - Domain ID
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 1)
 * @returns {Promise<Array>} List of prompts
 */
export const fetchPromptsByDomain = async (domainId, page = 1, perPage = 10) => {
  try {
    const response = await apiFetch(REPORT_ENDPOINTS.GET_PROMPTS(page, perPage, domainId));
    console.log('Fetched prompts response:', response);
    console.log('Page:', page, 'Per Page:', perPage, 'Domain ID:', domainId);
    console.log('Response data:', response?.data);
    console.log('Response pagination:', response?.pagination);
    
    // Return the response as-is from the API
    return response;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        perPage: perPage,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
};
/**
 * Fetch all reports for a specific program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Array>} List of report results
 */
export const fetchAllReports = async (programId) => {
  try {
    const response = await apiFetch(REPORT_ENDPOINTS.GET_RESULTS(programId));
    console.log('Fetched reports response:', response);
    
    // Return the data array or empty array
    return Array.isArray(response) ? response : (response?.data || []);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};
/**
 * Save or update a report according to backend function
 * @param {Object} reportData - Report data to save/update
 * @param {number} reportData.ind - Indicator ID
 * @param {number} reportData.domain - Domain ID
 * @param {number} reportData.program - Program ID
 * @param {string} reportData.result - Requirement fulfillment content
 * @param {string} reportData.weak - Weaknesses content
 * @param {string} reportData.improve_weak - Weakness improvement content
 * @param {string} reportData.power - Strengths content
 * @param {string} reportData.improve_power - Strength improvement content
 * @returns {Promise<Object>} Save result
 */
export const saveAndUpdateReport = async (reportData) => {
  try {
    console.log('Sending report data to API:', reportData);
    
    const response = await apiFetch(REPORT_ENDPOINTS.SAVE_REPORT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    
    console.log('API response:', response);
    
    // The backend function returns { updated: true } or { inserted: true, id: insertId }
    return response;
  } catch (error) {
    console.error('Error saving/updating report:', error);
    throw error;
  }
};
