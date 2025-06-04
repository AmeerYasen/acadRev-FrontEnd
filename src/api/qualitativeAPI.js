// src/api/qualitativeApi.js
import { apiFetch } from './apiConfig';
import { QUALITATIVE_ENDPOINTS } from '../constants/index.js';

/**
 * Fetch domains
 * @returns {Promise<Array>} List of domains
 */
export const fetchDomains = async () => {
  try {
    console.log('fetchDomains: Making API call to', QUALITATIVE_ENDPOINTS.GET_DOMAINS);
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAINS);
    console.log('fetchDomains: Received data:', data);
    
    // Handle case where data might be null or empty
    if (!data || !Array.isArray(data)) {
      console.warn('fetchDomains: No valid data received, using mock data');
      return [
        { id: 1, name: 'Academic Standards', nameEn: 'Academic Standards' },
        { id: 2, name: 'Faculty & Staff', nameEn: 'Faculty & Staff' },
        { id: 3, name: 'Student Support', nameEn: 'Student Support' }
      ];
    }
    
    // Transform backend response to match frontend expectations
    return data.map(domain => ({
      id: domain.id,
      name: domain.domain_ar, // Map domain_ar to name
      nameEn: domain.domain_en || null
    }));
  } catch (error) {
    console.error('fetchDomains: API call failed:', error);
    // Return mock data instead of throwing error for development
    return [
      { id: 1, name: 'Academic Standards', nameEn: 'Academic Standards' },
      { id: 2, name: 'Faculty & Staff', nameEn: 'Faculty & Staff' },
      { id: 3, name: 'Student Support', nameEn: 'Student Support' }
    ];
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
    
    // Handle case where data might be null or empty
    if (!data || !Array.isArray(data)) {
      console.warn('fetchIndicators: No valid data received, using mock data');
      return [
        { id: 1, title: 'Learning Outcomes Quality', description: 'Assessment of learning outcomes definition and measurement', domain: domainId },
        { id: 2, title: 'Curriculum Standards', description: 'Evaluation of curriculum design and implementation', domain: domainId },
        { id: 3, title: 'Assessment Methods', description: 'Review of assessment methodologies and practices', domain: domainId }
      ];
    }
    
    // Transform backend response to match frontend expectations
    return data.map(indicator => ({
      id: indicator.id,
      title: indicator.text, // Map text to title
      description: indicator.text, // Use same text for description
      domain: indicator.domain
    }));
  } catch (error) {
    console.error('fetchIndicators: API call failed:', error);
    // Return mock data instead of throwing error for development
    return [
      { id: 1, title: 'Learning Outcomes Quality', description: 'Assessment of learning outcomes definition and measurement', domain: domainId },
      { id: 2, title: 'Curriculum Standards', description: 'Evaluation of curriculum design and implementation', domain: domainId },
      { id: 3, title: 'Assessment Methods', description: 'Review of assessment methodologies and practices', domain: domainId }
    ];
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
    
    // Handle case where data might be null or empty
    if (!data || !Array.isArray(data)) {
      console.warn('fetchResponses: No valid data received, returning empty object');
      return {};
    }
    
    // Transform array of responses to object with keys like "domainId-indicatorId"
    const responsesObject = {};
    data.forEach(response => {
      const key = `${response.domain_id}-${response.indicator_id}`;
      responsesObject[key] = {
        evaluation: response.response, // Map response to evaluation
        notes: response.comment || '', // Map comment to notes
        id: response.id,
        createdAt: response.created_at,
        reviewerComment: response.reviewer_comment
      };
    });
    
    return responsesObject;
  } catch (error) {
    console.error('fetchResponses: API call failed:', error);
    // Return empty object instead of throwing error for development
    return {};
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
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_UNANSWERED(programId));
    return data;
    } catch (error) {
    throw new Error(error.message || 'Failed to fetch unanswered indicators');
  }
};
/**
 * Fetch domain summary for a specific program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} Domain summary object with domain IDs as keys
 */
export const fetchDomainSummary = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required to fetch domain summary');
    }
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_DOMAIN_SUMMARY(programId));
    
    // Transform array to object with domain IDs as keys and percentage as values
    const summaryObject = {};
    data.forEach(domain => {
      summaryObject[domain.domain_id] = domain.percentage_complete || 0;
    });
    
    return summaryObject;
  }
    catch (error) {
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
    
    // Transform frontend format to backend format
    const backendPayload = {
      indicator_id: response.indicatorId,
      domain_id: response.domainId,
      program_id: response.programId,
      response: response.evaluation, // Map evaluation to response
      comment: response.notes || null // Map notes to comment
    };
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.SUBMIT_RESPONSE, {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });
    return data;
  } catch (error) {
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
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.REMOVE_RESPONSE(id), {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to remove response');
  }
};
/**
 * Upload evidence files for an indicator
 * @param {string|number} programId - Program ID
 * @param {string|number} indicatorId - Indicator ID
 * @param {FileList|Array} files - Files to upload
 * @returns {Promise<Object>} Upload response with file metadata
 */
export const uploadEvidence = async (programId, indicatorId, files) => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    const formData = new FormData();
    formData.append('programId', programId);
    formData.append('indicatorId', indicatorId);
    
    // Handle both FileList and Array
    const fileArray = Array.from(files);
    fileArray.forEach((file, index) => {
      formData.append(`evidence_${index}`, file);
    });

    console.log('uploadEvidence: Uploading files for indicator:', indicatorId);
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.UPLOAD_EVIDENCE, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type for FormData - browser will set it with boundary
    });
    
    console.log('uploadEvidence: Upload successful:', data);
    return data;
  } catch (error) {
    console.error('uploadEvidence: Upload failed:', error);
    throw new Error(error.message || 'Failed to upload evidence files');
  }
};
/**
 * Add URL evidence for an indicator
 * @param {string|number} programId - Program ID
 * @param {string|number} indicatorId - Indicator ID
 * @param {string} url - URL to add as evidence
 * @param {string} title - Optional title for the URL
 * @returns {Promise<Object>} Response with URL evidence metadata
 */
export const addUrlEvidence = async (programId, indicatorId, url, title = null) => {
  try {
    if (!url || !url.trim()) {
      throw new Error('URL is required');
    }

    const urlData = {
      programId,
      indicatorId,
      url: url.trim(),
      title: title || url.trim(),
    };

    console.log('addUrlEvidence: Adding URL evidence:', urlData);
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.ADD_URL_EVIDENCE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urlData),
    });
    
    console.log('addUrlEvidence: URL added successfully:', data);
    return data;
  } catch (error) {
    console.error('addUrlEvidence: Failed to add URL:', error);
    throw new Error(error.message || 'Failed to add URL evidence');
  }
};
/**
 * Fetch evidence for a specific indicator
 * @param {string|number} programId - Program ID
 * @param {string|number} indicatorId - Indicator ID
 * @returns {Promise<Object>} Evidence data including files and URLs
 */
export const fetchEvidence = async (programId, indicatorId) => {
  try {
    if (!programId || !indicatorId) {
      throw new Error('Program ID and Indicator ID are required');
    }

    console.log('fetchEvidence: Fetching evidence for indicator:', indicatorId);
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_EVIDENCE(programId, indicatorId));
    
    console.log('fetchEvidence: Evidence fetched:', data);
    
    // Return structured evidence data
    return {
      files: data.files || [],
      urls: data.urls || [],
      totalCount: (data.files?.length || 0) + (data.urls?.length || 0)
    };
  } catch (error) {
    console.error('fetchEvidence: Failed to fetch evidence:', error);
    // Return empty evidence structure instead of throwing for development
    return {
      files: [],
      urls: [],
      totalCount: 0
    };
  }
};
/**
 * Fetch all evidence for a program
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} All evidence organized by indicator
 */
export const fetchAllEvidence = async (programId) => {
  try {
    if (!programId) {
      throw new Error('Program ID is required');
    }

    console.log('fetchAllEvidence: Fetching all evidence for program:', programId);
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.GET_ALL_EVIDENCE(programId));
    
    console.log('fetchAllEvidence: All evidence fetched:', data);
    return data || {};
  } catch (error) {
    console.error('fetchAllEvidence: Failed to fetch all evidence:', error);
    // Return empty object instead of throwing for development
    return {};
  }
};
/**
 * Delete evidence item (file or URL)
 * @param {string|number} evidenceId - Evidence item ID
 * @param {string} evidenceType - Type of evidence ('file' or 'url')
 * @returns {Promise<Object>} Deletion response
 */
export const deleteEvidence = async (evidenceId, evidenceType = 'file') => {
  try {
    if (!evidenceId) {
      throw new Error('Evidence ID is required');
    }

    console.log('deleteEvidence: Deleting evidence:', evidenceId, evidenceType);
    
    const data = await apiFetch(QUALITATIVE_ENDPOINTS.DELETE_EVIDENCE(evidenceId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ evidenceType }),
    });
    
    console.log('deleteEvidence: Evidence deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('deleteEvidence: Failed to delete evidence:', error);
    throw new Error(error.message || 'Failed to delete evidence');
  }
};
/**
 * Download evidence file
 * @param {string|number} evidenceId - Evidence file ID
 * @param {string} filename - Original filename
 * @returns {Promise<Blob>} File blob for download
 */
export const downloadEvidence = async (evidenceId, filename) => {
  try {
    if (!evidenceId) {
      throw new Error('Evidence ID is required');
    }

    console.log('downloadEvidence: Downloading evidence file:', evidenceId);
    
    const response = await fetch(`${QUALITATIVE_ENDPOINTS.GET_EVIDENCE}/${evidenceId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    // Create download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'evidence-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('downloadEvidence: File downloaded successfully');
    return blob;
  } catch (error) {
    console.error('downloadEvidence: Failed to download file:', error);
    throw new Error(error.message || 'Failed to download evidence file');
  }
};