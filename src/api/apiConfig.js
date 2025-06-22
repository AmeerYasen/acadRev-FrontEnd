export const API_BASE_URL = "http://localhost:3000";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  // Build headers - only include Content-Type if not undefined (for FormData)
  const defaultHeaders = {
    // Include auth token if available
    ...(localStorage.getItem('authToken') && {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }),
  };

  // Only add Content-Type if not explicitly set to null
  if (options.headers?.['Content-Type'] !== null) {
    defaultHeaders['Content-Type'] = options.headers?.['Content-Type'] || 'application/json';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const finalHeaders = {
      ...defaultHeaders,
      ...options.headers,
    };

    

    // Remove undefined headers
    Object.keys(finalHeaders).forEach(key => {
      if (finalHeaders[key] === undefined) {
        delete finalHeaders[key];
      }
    });

   
    const response = await fetch(url, {
      ...options,
      headers: finalHeaders,
      signal: controller.signal,
    });    clearTimeout(timeoutId);
    
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
      }      // Handle 401 errors by redirecting to login
      if (response.status === 401) {
        // Clear any stored auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        // Redirect to login page
        window.location.href = '/login';
        return; // Don't throw error since we're redirecting
      }

      // Throw error with details
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = errorData;
      throw error;
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