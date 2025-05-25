// functions.js

// TODO: Replace with your actual API base URL
import { API_BASE_URL } from "./apiconfig"; 
import { API_Actions } from "./apiconfig"; 
// TODO: Adjust these paths to match your API endpoints


// Helper to get common headers, including Authorization
const getAuthHeaders = () => {
  const authToken = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
};

/**
 * Fetches all universities from the API.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of university objects.
 * @throws {Error} If the API request fails or returns invalid data.
 */
export const fetchUniversities = async () => {
  const response = await fetch(API_BASE_URL + API_Actions.getAll, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch universities: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid data format received from server for universities list.");
  }
  return data;
};

/**
 * Adds a new university via the API.
 * @param {Object} universityData - The data for the new university.
 * @returns {Promise<Object>} A promise that resolves to the newly added university object.
 * @throws {Error} If the API request fails.
 */
export const addUniversity = async (universityData) => {
  const response = await fetch(API_BASE_URL + API_Actions.add, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(universityData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add university: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }
  return await response.json();
};

/**
 * Edits an existing university via the API.
 * @param {Object} universityData - The data for the university to update, must include an 'id'.
 * @returns {Promise<Object>} A promise that resolves to the updated university object.
 * @throws {Error} If the API request fails or universityData.id is missing.
 */
export const editUniversity = async (universityData) => {
  if (!universityData.id) {
    throw new Error("University ID is required for editing.");
  }
  const response = await fetch(API_BASE_URL + API_Actions.edit, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(universityData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to edit university: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }
  return await response.json();
};

/**
 * Deletes a university via the API.
 * @param {string|number} universityId - The ID of the university to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 * @throws {Error} If the API request fails.
 */
export const deleteUniversity = async (universityId) => {
  const response = await fetch(API_BASE_URL + API_Actions.delete + universityId, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete university: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }
  // DELETE requests might not return a body, or might return a confirmation.
  // If your API returns a specific success message, you might want to parse and return it.
  // For now, a successful status code is sufficient.
};

/**
 * Fetches a single university by ID from the API.
 * @param {string|number} universityId - The ID of the university to fetch.
 * @returns {Promise<Object>} A promise that resolves to the university object.
 * @throws {Error} If the API request fails or returns invalid data.
 */
export const fetchUniversityById = async (universityId) => {
  const response = await fetch(`${API_BASE_URL}/universities/${universityId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch university: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Fetches the current user's university information (for university accounts).
 * This uses the /my-university endpoint that identifies the university from the auth token.
 * @returns {Promise<Object>} A promise that resolves to the user's university object.
 * @throws {Error} If the API request fails, returns invalid data, or user isn't associated with a university.
 */
export const fetchMyUniversity = async () => {
  const response = await fetch(`${API_BASE_URL}universities/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch your university: ${response.statusText} (Status: ${response.status}) - ${errorText}`);
  }

  const data = await response.json();
  return data;
};