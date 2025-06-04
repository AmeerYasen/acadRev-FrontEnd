// src/api/universityApi.js
import { apiFetch } from './apiConfig';
import { QUANTITATIVE_ENDPOINTS } from '../constants';

/**
 * fetch areas
 * @returns {Promise<Array>} List of areas 
 */
export const fetchAreas = async () => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_AREAS);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch areas');
  }
};
/**
 * fetch Headers
 * @param {string|number} areaId - Area ID
 * @returns {Promise<Array>} List of headers
 */
export const fetchHeaders = async (areaId) => {
  try {
    if (!areaId) {
      throw new Error('Area ID is required to fetch headers');
    }
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_HEADERS(areaId));
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch headers');
  }
};
/**
 * fetch items 
 * @returns {Promise<Array>} List of items
 */
export const fetchItems = async (areaID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_ITEMS(areaID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch items');
  }
};
/**
 * fetch program Responses
 * @returns {Promise<Array>} List of program responses
 */
export const fetchProgramResponses = async (programID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_PROGRAM_RESPONSES(programID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch program responses');
  }
};
/**
 * get all responses 
 * @returns {Promise<Array>} List of all responses
 */
export const fetchAllResponses = async () => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_ALL_RESPONSES);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch all responses');
  }
};
/**
 * fetch are summary by area ID
 * @param {string|number} areaId - Area ID
 * @returns {Promise<Object>} Area summary object
 */
export const fetchAreaSummaryByAreaId = async (areaId) => {
  try {
    if (!areaId) {
      throw new Error('Area ID is required to fetch area summary');
    }
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_AREA_SUMMARY_BY_AREA_ID(areaId));
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch area summary by area ID');
  }
};
/**
 * fetch get user supmitted areas
 * @returns {Promise<Array>} List of user submitted areas   
 */
export const fetchUserSubmittedAreas = async (userId,programID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_USER_SUBMITTED_AREAS(userId, programID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user submitted areas');
  }
};
/**
 * fetch get completed areas
 * @returns {Promise<Array>} List of completed areas
 */
export const fetchCompletedAreas = async (programID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_COMPLETED_AREAS(programID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch completed areas');
  }
};

/**
 * get area progress
 */
export const fetchAreaProgress = async (programID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_AREA_PROGRESS(programID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch area progress');
  }
};
/** 
 * get missing responses
 * @returns {Promise<Array>} List of missing responses
 */
export const fetchMissingResponses = async (programID,areaID) => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_MISSING_RESPONSES(programID, areaID), {
      method: 'GET',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch missing responses');
  }
};
/**
 * fetch most skipped headers
 * @returns {Promise<Array>} List of most skipped headers
 */
export const fetchMostSkippedHeaders = async () => {
  try {
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_MOST_SKIPPED_HEADERS);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch most skipped headers');
  }
};
/**
 * fetch user programs
 * @param {string|number} userId - User ID
 * @returns {Promise<Array>} List of user programs
 */
export const fetchUserPrograms = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch user programs');
    }
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.GET_USER_PROGRAMS(userId));
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user programs');
  }
};

/**
 * submit responses
 * @param {Object} responseData - Response data to submit
 * @returns {Promise<Object>} Submitted response object
 */
export const submitResponses = async (responseData) => {
  try {
    
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.SUBMIT_RESPONSES, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit responses');
  }
};

/**
 * update responses
 * @param {Object} responseData - Response data to update
 * @returns {Promise<Object>} Updated response object
 */
export const updateResponses = async (responseData) => {
  try {
    if (!responseData || !responseData.id) {
      throw new Error('Response ID is required to update responses');
    }
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.UPDATE_RESPONSES(responseData.id), {
      method: 'PUT',
      body: JSON.stringify(responseData),
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update responses');
  }
};
/**
 * delete responses
 * @param {string|number} responseId - Response ID to delete
 * @returns {Promise<void>}
 */
export const deleteResponses = async (responseId) => {
  try {
    if (!responseId) {
      throw new Error('Response ID is required to delete responses');
    }
    const data = await apiFetch(QUANTITATIVE_ENDPOINTS.DELETE_RESPONSES(responseId), {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete responses');
  }
};