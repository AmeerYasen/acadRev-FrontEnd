export const API_BASE_URL = "http://localhost:3000";
/**
 * Reusable fetch function for API requests with comprehensive error parsing.
 * @param {string} endpoint - The API endpoint (e.g., '/universities', '/auth/login').
 * @param {Object} [options={}] - Fetch options (method, body, headers, etc.).
 * @returns {Promise<Object>} - Parsed JSON response data.
 * @throws {Error} - Custom error with detailed message and status code.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Include auth token if available (e.g., for Auth, UserProfile, Users pages)
    ...(localStorage.getItem('authToken') && {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      let errorData = {};

      // Attempt to parse error response as JSON
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP error! Status: ${response.status}`;
      } catch {
        // If response is not JSON, use generic message
        errorMessage = `HTTP error! Status: ${response.status}`;
      }

      // Handle specific HTTP status codes
      switch (response.status) {
        case 400:
          throw new Error(`Bad Request: ${errorMessage}`, {
            cause: { status: 400, details: errorData },
          });
        case 401:
          localStorage.removeItem('authToken');
          throw new Error('Unauthorized: Please log in again', {
            cause: { status: 401, details: errorData },
          });
        case 403:
          throw new Error(`Forbidden: You lack permission to access this resource`, {
            cause: { status: 403, details: errorData },
          });
        case 404:
          throw new Error(`Not Found: Resource at ${endpoint} does not exist`, {
            cause: { status: 404, details: errorData },
          });
        case 429:
          throw new Error(`Too Many Requests: Please try again later`, {
            cause: { status: 429, details: errorData },
          });
        case 500:
          throw new Error(`Server Error: Something went wrong on the server`, {
            cause: { status: 500, details: errorData },
          });
        default:
          throw new Error(errorMessage, {
            cause: { status: response.status, details: errorData },
          });
      }
    }

    // Parse successful response
    const data = await response.json();
    return data;

  } catch (error) {
    // Handle network or other errors
    let customError;

    if (error.name === 'AbortError') {
      customError = new Error('Request timed out after 10 seconds', {
        cause: { status: null, details: { type: 'timeout' } },
      });
    } else if (error.message.includes('Failed to fetch')) {
      customError = new Error('Network error: Unable to connect to the server', {
        cause: { status: null, details: { type: 'network' } },
      });
    } else {
      customError = error; // Preserve original error if not network/timeout
    }

    // Log error for debugging
    console.error(`API error for ${endpoint}:`, {
      message: customError.message,
      cause: customError.cause,
    });

    throw customError; // Re-throw for components to handle
  }
};