// src/api/authApi.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS, STORAGE_KEYS } from '../constants';

/**
 * Logs in a user with the provided credentials.
 * @param {Object} credentials - { username: string, password: string }
 * @returns {Promise<Object>} - { success: boolean, user: Object, token: string, error: string }
 */
export const login = async (credentials) => {
  try {
    const response = await apiFetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.user && response.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));
      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } else {
      throw new Error(response.error || 'Login successful but no user data or token received');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed',
    };
  }
};