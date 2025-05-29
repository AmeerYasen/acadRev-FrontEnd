// src/api/collegeApi.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS, STORAGE_KEYS } from '../constants';

/**
 * Fetches all colleges.
 * @returns {Promise<Array>} List of colleges
 */
export const fetchColleges = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.GET_ALL);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for colleges list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch colleges');
  }
};

/**
 * Adds a new college.
 * @param {Object} collegeData - College data (e.g., { name, universityId })
 * @returns {Promise<Object>} Created college
 */
export const addCollege = async (collegeData) => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.CREATE, {
      method: 'POST',
      body: JSON.stringify(collegeData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add college');
  }
};

/**
 * Edits an existing college.
 * @param {Object} collegeData - College data with id (e.g., { id, name, universityId })
 * @returns {Promise<Object>} Updated college
 */
export const editCollege = async (collegeData) => {
  try {
    if (!collegeData.id) {
      throw new Error('College ID is required for editing');
    }
    const response = await apiFetch(ENDPOINTS.COLLEGES.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(collegeData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update college');
  }
};

/**
 * Deletes a college by ID.
 * @param {string|number} collegeId - College ID
 * @returns {Promise<void>}
 */
export const deleteCollege = async (collegeId) => {
  try {
    await apiFetch(ENDPOINTS.COLLEGES.DELETE(collegeId), {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to delete college');
  }
};

/**
 * Fetches a single college by ID.
 * @param {string|number} collegeId - College ID
 * @returns {Promise<Object>} College object
 */
export const fetchCollegeById = async (collegeId) => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.GET_BY_ID(collegeId));
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch college');
  }
};

/**
 * Fetches the current user's college.
 * @returns {Promise<Object>} User's college object
 */
export const fetchMyCollege = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.MY_COLLEGE);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch your college');
  }
};

/**
 * Fetches colleges for a specific university ID.
 * @param {string|number} universityId - University ID
 * @returns {Promise<Array>} List of colleges
 */
export const fetchCollegesByUniversity = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.BY_UNIVERSITY);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for university colleges list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch university colleges');
  }
};

/**
 * Fetches college names for a specific university ID.
 * @param {string|number} universityId - University ID
 * @returns {Promise<Array>} List of college names
 */
export const fetchCollegeNamesByUniversity = async (university_id) => {
  try {
    const response = await apiFetch(ENDPOINTS.COLLEGES.GET_NAMES_BY_UNI(university_id), {
      method: 'GET',
    });
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for college names');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch college names by university');
  }
};