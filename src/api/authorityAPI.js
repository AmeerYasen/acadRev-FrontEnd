// src/api/authorityAPI.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS } from '../constants';

/**
 * Get list of all authorities
 * @returns {Promise<Array>} - Array of authority objects
 */
export const getAllAuthorities = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.GET_ALL, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get all authorities error:', error);
    throw error;
  }
};

/**
 * Get authority by ID
 * @param {number|string} id - Authority ID
 * @returns {Promise<Object>} - Authority object
 */
export const getAuthorityById = async (id) => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.GET_AUTHORITY_BY_ID(id), {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get authority by ID error:', error);
    throw error;
  }
};

/**
 * Get current authority profile
 * @returns {Promise<Object>} - Authority profile object
 */
export const getAuthorityProfile = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.PROFILE, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get authority profile error:', error);
    throw error;
  }
};

/**
 * Create a new authority
 * @param {Object} authorityData - New authority data
 * @returns {Promise<Object>} - Created authority object
 */
export const createAuthority = async (authorityData) => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.ADD_AUTHORITY, {
      method: 'POST',
      body: JSON.stringify(authorityData),
    });
    return response;
  } catch (error) {
    console.error('Create authority error:', error);
    throw error;
  }
};

/**
 * Update authority information
 * @param {Object} authorityData - Updated authority data
 * @returns {Promise<Object>} - Updated authority object
 */
export const updateAuthority = async (authorityData) => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.UPDATE_AUTHORITY, {
      method: 'PUT',
      body: JSON.stringify(authorityData),
    });
    return response;
  } catch (error) {
    console.error('Update authority error:', error);
    throw error;
  }
};

/**
 * Delete an authority by ID
 * @param {number|string} id - Authority ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteAuthority = async (id) => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTHORITY.DELETE_AUTHORITY(id), {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Delete authority error:', error);
    throw error;
  }
};
