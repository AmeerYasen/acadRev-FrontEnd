export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      // Add other auth endpoints if needed
    },
    UNIVERSITIES: {
      GET_ALL: '/universities/all',
      CREATE: '/universities/add',
      UPDATE: '/universities/update',
      DELETE: (id) => `/universities/delete/${id}`,
    },
    USERS: {
      LIST: '/users',
      GET_PROFILE: (id) => `/users/${id}`,
      UPDATE: (id) => `/users/${id}`,
    },
    COLLEGES: {
        GET_ALL: '/colleges/all',
        CREATE: '/colleges/add',
        UPDATE: '/colleges/update',
        DELETE: '/colleges/delete',
        MY_COLLEGE: '/colleges/me',
        BY_UNIVERSITY:'/colleges/uniAll',
    },
    DEPARTMENTS: {
      GWT_ALL: '/departments/all',
      CREATE: '/departments/add',
      UPDATE: '/departments/update',
      DELETE: '/departments/delete',
      MY_DEPARTMENT: '/departments/me',
      BY_COLLEGE: '/departments/collegeAll',
      GET_BY_ID: (id) => `/departments/${id}`,
      PAGINATION: (page, perPage) => `/departments/query?page=${page}&perPage=${perPage}`,
    },
    PROGRAMS: {
      LIST: '/programs',
      GET_BY_ID: (id) => `/programs/${id}`,
      CREATE: '/programs',
    },
  };
  
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    AUTH_USER: 'authUser', // Added from AuthContext.jsx
  };
  
  export const ROUTES = {
    LOGIN: '/auth',
    MAIN: '/main',
  };
  
  export const ROLES = {
    ADMIN: 'admin',
    AUTHORITY: 'authority',
    UNIVERSITY: 'university',
    COLLEGE: 'college',
    DEPARTMENT: 'department',
  };

  export const getRoleWeight = (role) => {
    const ROLE_WEIGHTS = {
      [ROLES.ADMIN]: 1,
      [ROLES.AUTHORITY]: 2,
      [ROLES.UNIVERSITY]: 3,
      [ROLES.COLLEGE]: 4,
      [ROLES.DEPARTMENT]: 5,
    };
    
    return ROLE_WEIGHTS[role] || 0; // Returns 0 if role not found
  };