import { apiFetch } from "./apiConfig";
import { STATISTICS_ENDPOINTS } from "../constants";

// Get user dashboard statistics based on role
export const getDashboardStats = async () => {
  try {
    const response = await apiFetch(STATISTICS_ENDPOINTS.DASHBOARD);
    return response;
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    throw error;
  }
};

// Get admin statistics
export const getAdminStats = async () => {
  try {
    const response = await apiFetch(STATISTICS_ENDPOINTS.ADMIN);
    return response;
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    throw error;
  }
};

// Get authority statistics
export const getAuthorityStats = async (authorityId) => {
  try {
    const response = await apiFetch(
      STATISTICS_ENDPOINTS.AUTHORITY(authorityId)
    );
    return response;
  } catch (error) {
    console.error("Error fetching authority statistics:", error);
    throw error;
  }
};

// Get university statistics
export const getUniversityStats = async (universityId) => {
  try {
    const response = await apiFetch(
      STATISTICS_ENDPOINTS.UNIVERSITY(universityId)
    );
    return response;
  } catch (error) {
    console.error("Error fetching university statistics:", error);
    throw error;
  }
};

// Get college statistics
export const getCollegeStats = async (collegeId) => {
  try {
    const response = await apiFetch(STATISTICS_ENDPOINTS.COLLEGE(collegeId));
    return response;
  } catch (error) {
    console.error("Error fetching college statistics:", error);
    throw error;
  }
};

// Get department statistics
export const getDepartmentStats = async (departmentId) => {
  try {
    const response = await apiFetch(
      STATISTICS_ENDPOINTS.DEPARTMENT(departmentId)
    );
    return response;
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    throw error;
  }
};

// Get program statistics
export const getProgramStats = async (programId) => {
  try {
    const response = await apiFetch(STATISTICS_ENDPOINTS.PROGRAM(programId));
    return response;
  } catch (error) {
    console.error("Error fetching program statistics:", error);
    throw error;
  }
};
