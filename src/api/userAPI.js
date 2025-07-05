// src/api/userAPI.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS } from '../constants';

/**
 * Get list of all users
 * @returns {Promise<Array>} - Array of user objects
 */
export const getUsers = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.LIST, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

/**
 * Get current user profile by ID
 * @param {number|string} id - User ID
 * @returns {Promise<Object>} - User profile object
 */
export const getUserProfile = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.GET_PROFILE(), {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user information
 * @param {number|string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user object
 */
export const updateUser = async (userData) => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.UPDATE(), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

/**
 * Patch user information (partial update)
 * @param {Object} userData - Partial user data to update
 * @returns {Promise<Object>} - Updated user object
 */
export const patchUser = async (userData) => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.UPDATE(), {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Patch user error:', error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {number|string} id - User ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.delete(id), {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - New user data
 * @returns {Promise<Object>} - Created user object
 */
export const createUser = async (userData) => {
  try {
    const response = await apiFetch(ENDPOINTS.USERS.ADD, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};