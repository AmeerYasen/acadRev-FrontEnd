import { API_BASE_URL } from './apiconfig'; // Adjust the import based on your project structure
import { API_Actions } from './apiconfig'; // Adjust the import based on your project structure

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


const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}${API_Actions.getAll}`, {
    headers: getAuthHeaders(),
  }); // Assuming your GET all users endpoint
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  return response.json();
};

const addUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}users${API_Actions.add}`, { // Assuming your POST user endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to add user');
  }
  return response.json();
};

const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}users/${userId}`, { // Assuming your PUT user endpoint
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to update user');
  }
  return response.json();
};

const deleteUserApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}users/${userId}`, { // Assuming your DELETE user endpoint
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to delete user');
  }
  return response.json();
};

const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}users/me`, { // Assuming your GET current user endpoint
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch current user');
  }
  return response.json();
};

export { fetchUsers, addUser, updateUser, deleteUserApi, getCurrentUser };