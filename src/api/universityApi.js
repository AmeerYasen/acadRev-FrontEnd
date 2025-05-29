// src/api/universityApi.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS } from '../constants';

/**
 * Fetches all universities.
 * @returns {Promise<Array>} List of universities
 */
export const fetchUniversities = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.UNIVERSITIES.GET_ALL);
    return response; // Assumes response is an array of universities
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch universities');
  }
};

/**
 * Adds a new university.
 * @param {Object} formData - University data (e.g., { name, country, email })
 * @returns {Promise<Object>} Created university
 */
export const addUniversity = async (formData) => {
  try {
    const response = await apiFetch(ENDPOINTS.UNIVERSITIES.CREATE, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return response; // Assumes response is the created university
  } catch (error) {
    throw new Error(error.message || 'Failed to add university');
  }
};

/**
 * Edits an existing university.
 * @param {Object} formData - University data with id (e.g., { id, name, country })
 * @returns {Promise<Object>} Updated university
 */
export const editUniversity = async (formData) => {
  try {
    const response = await apiFetch(ENDPOINTS.UNIVERSITIES.UPDATE(formData.id), {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
    return response; // Assumes response is the updated university
  } catch (error) {
    throw new Error(error.message || 'Failed to update university');
  }
};

/**
 * Deletes a university by ID.
 * @param {string|number} universityId - University ID
 * @returns {Promise<void>}
 */
export const deleteUniversity = async (universityId) => {
  try {
    await apiFetch(ENDPOINTS.UNIVERSITIES.GET_BY_ID(universityId), {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to delete university');
  }
};

/**
 * Fetches university names.
 * @returns {Promise<Array>} List of university names
 */
export const fetchUniversityNames = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.UNIVERSITIES.GET_UNI_NAMES);
    return response; // Assumes response is an array of university names
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch university names');
  }
};