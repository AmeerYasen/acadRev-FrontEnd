export const API_BASE_URL = "http://localhost:3000/"; // Or from environment variable

export const API_Actions = {
  getAll: "users/all",
  add: "users/add",
  edit: "users/update/", // Note: ID is appended later
  delete: "users/delete/", // Note: ID is appended later
  myAccount: "users/me",
};
