// src/api/departmentApi.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS } from '../constants';

/**
 * Fetches all departments.
 * @returns {Promise<Array>} List of departments
 */
export const fetchDepartments = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.DEPARTMENTS.GET_ALL);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for departments list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch departments');
  }
};

/**
 * Adds a new department.
 * @param {Object} departmentData - Department data (e.g., { name, collegeId })
 * @returns {Promise<Object>} Created department
 */
export const addDepartment = async (departmentData) => {
  try {
    const response = await apiFetch(ENDPOINTS.DEPARTMENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add department');
  }
};

/**
 * Edits an existing department.
 * @param {Object} departmentData - Department data with id (e.g., { id, name, collegeId })
 * @returns {Promise<Object>} Updated department
 */
export const editDepartment = async (departmentData) => {
  try {
    if (!departmentData.id) {
      throw new Error('Department ID is required for editing');
    }
    const response = await apiFetch(ENDPOINTS.DEPARTMENTS.UPDATE, {
      method: 'PUT',
      body: JSON.stringify(departmentData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update department');
  }
};

/**
 * Deletes a department by ID.
 * @param {string|number} departmentId - Department ID
 * @returns {Promise<void>}
 */
export const deleteDepartment = async (departmentId) => {
  try {
    await apiFetch(ENDPOINTS.DEPARTMENTS.DELETE(departmentId), {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to delete department');
  }
};

/**
 * Fetches a single department by ID.
 * @param {string|number} departmentId - Department ID
 * @returns {Promise<Object>} Department object
 */
export const fetchDepartmentById = async (departmentId) => {
  try {
    const response = await apiFetch(ENDPOINTS.DEPARTMENTS.GET_BY_ID(departmentId));
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch department');
  }
};

/**
 * Fetches the current user's department.
 * @returns {Promise<Object>} User's department object
 */
export const fetchMyDepartment = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.DEPARTMENTS.MY_DEPARTMENT);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch your department');
  }
};

/**
 * Fetches departments for a specific college ID.
 * @param {string|number} collegeId - College ID
 * @returns {Promise<Array>} List of departments
 */
export const fetchDepartmentsByCollege = async () => {
  try {
    // Assuming your ENDPOINTS.DEPARTMENTS.BY_COLLEGE might take collegeId as a parameter
    // or is a dynamic route. Adjust if your endpoint structure is different.
    const endpoint =ENDPOINTS.DEPARTMENTS.BY_COLLEGE; // Or however your API expects it

    const response = await apiFetch(endpoint);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for college departments list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch college departments');
  }
};

export const fetchDepNamesByCollege = async (collegeId) => {
  try {
    if (!collegeId) {
      throw new Error('College ID is required to fetch departments');
    }
    const endpoint = `${ENDPOINTS.DEPARTMENTS.GET_NAMES_BY_COLLEGE_ID}/college_id=${collegeId}`;
    const response = await apiFetch(endpoint);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for departments Names list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch college departments by ID');
  }
};

export const fetchDepartmentsWithPagination = async (page = 1, perPage = 20, options = {}) => {
  try {
    let endpoint = ENDPOINTS.DEPARTMENTS.PAGINATION(page, perPage);
    const queryParams = new URLSearchParams();
    if (options.college_id) {
      queryParams.append('college_id', options.college_id);
    }
    if (options.university_id) {
      queryParams.append('university_id', options.university_id);
    }
    if (options.search) {
      queryParams.append('search', options.search);
    }

    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `&${queryString}`;
    }
    console.log(`Fetching paginated departments from endpoint: ${endpoint}`);
    const response = await apiFetch(endpoint);

    // Check if the response is successful and has the expected structure
    if (response && response.success && Array.isArray(response.data) && response.pagination) {
      return {
        data: response.data,
        pagination: {
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalRecords: response.pagination.totalRecords,
          nextPage: response.pagination.nextPage,
          hasNextPage: response.pagination.hasNextPage,
          hasPrevPage: response.pagination.hasPrevPage,
          prevPage: response.pagination.prevPage,
        },
      };
    } else {
      // Log the unexpected structure for debugging
      console.warn('Paginated departments response structure was unexpected or request failed:', response);
      // Throw an error or return a default structure
      throw new Error(response?.message || 'Invalid data format received from server for paginated departments');
    }
  } catch (error) {
    // Ensure the error message is propagated
    throw new Error(error.message || 'Failed to fetch paginated departments');
  }
}