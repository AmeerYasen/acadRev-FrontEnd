// src/api/qualitativeApi.js
import { apiFetch } from './apiConfig';
import { QUALITATIVE_ENDPOINTS } from '../constants/index.js';

/**
 * Fetch all domains
 * @returns {Promise<Array>} List of domains
 */
export const fetchDomains = async () => {
  try {
    console.log('fetchDomains: Making API call to', QUALITATIVE_ENDPOINTS.GET_DOMAINS);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAINS);
    console.log('fetchDomains: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from domains endpoint');
    }
    
    // Transform backend response to match frontend expectations
    return data.map(domain => ({
      id: domain.id,
      name: domain.domain_ar,
      nameEn: domain.domain_en,
      domain_ar: domain.domain_ar,
      domain_en: domain.domain_en
    }));
  } catch (error) {
    console.error('fetchDomains: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch domains');
  }
};
/**
 * Fetch indicators for a specific domain
 * @param {string|number} domainId - Domain ID
 * @returns {Promise<Array>} List of indicators
 */
export const fetchIndicators = async (domainId) => {
  try {
    if (!domainId) {
      throw new Error('Domain ID is required to fetch indicators');
    }
    
    console.log('fetchIndicators: Making API call for domain:', domainId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_INDICATORS(domainId));
    console.log('fetchIndicators: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from indicators endpoint');
    }
    
    // Transform backend response to match frontend expectations
    return data.map(indicator => ({
      id: indicator.id,
      domain: indicator.domain,
      text: indicator.text,
      title: indicator.text, // Use text as title for compatibility
      description: indicator.text // Use text as description for compatibility
    }));
  } catch (error) {
    console.error('fetchIndicators: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch indicators');
  }
};
/**
 * Fetch responses for a specific program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} Object with response keys mapped to response data
 */
export const fetchResponses = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch responses');
    }
    
    console.log('fetchResponses: Making API call for program:', programId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_RESPONSES(programId));
    console.log('fetchResponses: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      console.warn('fetchResponses: No valid data received, returning empty object');
      return {};
    }
    
    // Transform array of responses to object with keys like "domainId-indicatorId"
    const responsesObject = {};
    data.forEach(response => {
      const key = `${response.domain_id}-${response.indicator_id}`;
      responsesObject[key] = {
        id: response.id,
        evaluation: response.response,
        notes: response.comment || '',
        createdAt: response.created_at,
        reviewerComment: response.reviewer_comment,
        indicatorId: response.indicator_id,
        domainId: response.domain_id,
        programId: response.program_id
      };
    });
    
    return responsesObject;
  } catch (error) {
    console.error('fetchResponses: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch responses');
  }
};
/**
 * Fetch unanswered indicators for a specific program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Array>} List of unanswered indicators
 */
export const fetchUnanswered = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch unanswered indicators');
    }
    
    console.log('fetchUnanswered: Making API call for program:', programId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_UNANSWERED(programId));
    console.log('fetchUnanswered: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.map(indicator => ({
      id: indicator.id,
      domain: indicator.domain,
      text: indicator.text,
      domain_ar: indicator.domain_ar
    }));
  } catch (error) {
    console.error('fetchUnanswered: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch unanswered indicators');
  }
};
/**
 * Fetch domain summary for a specific program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Array>} Array of domain summary objects
 */
export const fetchDomainSummary = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch domain summary');
    }
    
    console.log('fetchDomainSummary: Making API call for program:', programId);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAIN_SUMMARY(programId));
    console.log('fetchDomainSummary: Received data:', data);
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.map(domain => ({
      domain_id: domain.domain_id,
      domain_ar: domain.domain_ar,
      total_indicators: domain.total_indicators,
      filled: domain.filled,
      percentage: Math.round((domain.filled / domain.total_indicators) * 100)
    }));
  } catch (error) {
    console.error('fetchDomainSummary: API call failed:', error);
    throw new Error(error.message || 'Failed to fetch domain summary');
  }
};
/**
 * Submit a qualitative response
 * @param {Object} response - Response object containing programId, domainId, indicatorId, evaluation, and notes
 * @returns {Promise<Object>} Submitted response
 */
export const submitResponse = async (response) => {
  try {
    if (!response || !response.programId || !response.domainId || !response.indicatorId || !response.evaluation) {
      throw new Error('Response object with programId, domainId, indicatorId, and evaluation is required');
    }
    
    // Transform frontend format to backend format according to API guide
    const backendPayload = {
      indicator_id: response.indicatorId,
      domain_id: response.domainId,
      program_id: response.programId,
      response: response.evaluation,
      comment: response.notes || null
    };
    
    console.log('submitResponse: Making API call with payload:', backendPayload);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.SUBMIT_RESPONSE, {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });
    
    console.log('submitResponse: Response received:', data);
    return data;
  } catch (error) {
    console.error('submitResponse: API call failed:', error);
    throw new Error(error.message || 'Failed to submit response');
  }
};
/**
 * Remove a qualitative response
 * @param {string|number} id - Response ID
 * @returns {Promise<Object>} Removed response confirmation
 */
export const removeResponse = async (id) => {
  try {
    if (!id) {
      throw new Error('Response ID is required to remove a response');
    }
    
    console.log('removeResponse: Making API call to delete response:', id);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.REMOVE_RESPONSE(id), {
      method: 'DELETE',
    });
    
    console.log('removeResponse: Response received:', data);
    return data;
  } catch (error) {
    console.error('removeResponse: API call failed:', error);
    throw new Error(error.message || 'Failed to remove response');
  }
};

/**
 * Upload evidence file for a response
 * @param {string|number} responseId - Response ID
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload result
 */
export const uploadEvidence = async (responseId, file) => {
  try {
    if (!responseId) {
      throw new Error('Response ID is required to upload evidence');
    }
    
    if (!file) {
      throw new Error('File is required to upload evidence');
    }
    
    console.log('uploadEvidence: Making API call for response:', responseId);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Use apiFetch but without Content-Type header to let browser set it with boundary
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.UPLOAD_EVIDENCE(responseId), {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with multipart boundary
        'Content-Type': undefined
      }
    });
    
    console.log('uploadEvidence: Response received:', data);
    return data;
  } catch (error) {
    console.error('uploadEvidence: API call failed:', error);
    throw new Error(error.message || 'Failed to upload evidence');
  }
};