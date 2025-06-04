// src/api/programAPI.js
import { apiFetch } from './apiConfig';
import { ENDPOINTS } from '../constants';

/**
 * Fetches all programs.
 * @returns {Promise<Array>} List of programs
 */
export const fetchPrograms = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.PROGRAMS.GET_ALL);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for programs list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch programs');
  }
};

/**
 * Adds a new program.
 * @param {Object} programData - Program data (e.g., { name, departmentId })
 * @returns {Promise<Object>} Created program
 */
export const addProgram = async (programData) => {
  try {
    const response = await apiFetch(ENDPOINTS.PROGRAMS.CREATE, {
      method: 'POST',
      body: JSON.stringify(programData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add program');
  }
};

/**
 * Edits an existing program.
 * @param {Object} programData - Program data with id (e.g., { id, name, departmentId })
 * @returns {Promise<Object>} Updated program
 */
export const editProgram = async (programData) => {
  try {
    if (!programData || !programData.id) {
      throw new Error('Program ID is required for editing');
    }
    const response = await apiFetch(ENDPOINTS.PROGRAMS.UPDATE(programData.id), {
      method: 'PUT',
      body: JSON.stringify(programData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update program');
  }
};

/**
 * Deletes a program by ID.
 * @param {string|number} programId - Program ID
 * @returns {Promise<void>}
 */
export const deleteProgram = async (programId) => {
  try {
    await apiFetch(ENDPOINTS.PROGRAMS.DELETE(programId), {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to delete program');
  }
};

/**
 * Fetches a single program by ID.
 * @param {string|number} programId - Program ID
 * @returns {Promise<Object>} Program object
 */
export const fetchProgramById = async (programId) => {
  try {
    const response = await apiFetch(ENDPOINTS.PROGRAMS.GET_BY_ID(programId));
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch program');
  }
};

/**
 * Fetches the current user's program.
 * @returns {Promise<Object>} User's program object
 */
export const fetchMyProgram = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.PROGRAMS.MY_PROGRAM);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch your program');
  }
};

/**
 * Fetches programs for a specific department.
 * @returns {Promise<Array>} List of programs
 */
export const fetchProgramsByDepartment = async () => {
  try {
    const response = await apiFetch(ENDPOINTS.PROGRAMS.BY_DEPARTMENT);
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for department programs list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch department programs');
  }
};

/**
 * Fetches program names by department ID.
 * @param {string|number} departmentId - Department ID
 * @returns {Promise<Array>} List of program names
 */
export const fetchProgramNamesByDepartment = async (departmentId) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required to fetch programs');
    }
    const response = await apiFetch(ENDPOINTS.PROGRAMS.GET_NAMES_BY_DEPARTMENT_ID(departmentId));
    if (!Array.isArray(response)) {
      throw new Error('Invalid data format received from server for program names list');
    }
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch program names by department ID');
  }
};

/**
 * Fetches programs with pagination.
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 20)
 * @param {Object} options - Additional query options
 * @returns {Promise<Object>} Paginated programs response
 */
export const fetchProgramsWithPagination = async (page = 1, perPage = 20, options = {}) => {
  try {
    let endpoint = ENDPOINTS.PROGRAMS.PAGINATION(page, perPage);
    const queryParams = new URLSearchParams();
    
    if (options.department_id) {
      queryParams.append('department_id', options.department_id);
    }
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
    
    console.log(`Fetching paginated programs from endpoint: ${endpoint}`);
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
      console.warn('Paginated programs response structure was unexpected or request failed:', response);
      // Throw an error or return a default structure
      throw new Error(response?.message || 'Invalid data format received from server for paginated programs');
    }
  } catch (error) {
    // Ensure the error message is propagated
    throw new Error(error.message || 'Failed to fetch paginated programs');
  }
};