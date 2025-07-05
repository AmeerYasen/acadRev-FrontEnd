export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      // Add other auth endpoints if needed
    },
    AUTHORITY: {
     ADD_AUTHORITY: '/authority/add',
     DELETE_AUTHORITY: (id) => `/authority/delete/${id}`,
     UPDATE_AUTHORITY:  `/authority/update`,
     PROFILE:  `/authority/profile`,
     GET_ALL: '/authority/all',
     GET_AUTHORITY_BY_ID: (id) => `/authority/${id}`,
    },
    UNIVERSITIES: {
      GET_ALL: '/universities/all',
      CREATE: '/universities/add',
      UPDATE: '/universities/update',
      GET_UNI_NAMES: '/universities/getUniNames',
      GET_BY_ID: (id) => `/universities/${id}`,
      GET_MY_UNIVERSITY: '/universities/me',
      DELETE_UNIVERSITY: (id) => `/universities/delete/${id}`,
    },
    USERS: {
      LIST: '/users/all', 
      ADD: '/users/add',
      GET_PROFILE: () => `/users/me`,
      UPDATE: () => `/users/update`,
      delete: (id) => `/users/delete/${id}`,
    },
    COLLEGES: {
        GET_ALL: '/colleges/all',
        CREATE: '/colleges/add',
        UPDATE: '/colleges/update',
        MY_COLLEGE: '/colleges/me',
        BY_UNIVERSITY:'/colleges/uniAll',
        GET_NAMES_BY_UNI: (universityId) => `/colleges/getNamesByUni/${universityId}`,
        DELETE_COLLEGE: (id) => `/colleges/delete/${id}`,
    },
    DEPARTMENTS: {
      GET_ALL: '/departments/all',
      CREATE: '/departments/add',
      UPDATE: '/departments/update',
      MY_DEPARTMENT: '/departments/me',
      BY_COLLEGE: '/departments/collegeAll',
      GET_BY_ID: (id) => `/departments/${id}`,
      PAGINATION: (page, perPage) => `/departments/query?page=${page}&perPage=${perPage}`,
      GET_NAMES_BY_COLLEGE_ID: (collegeId) => `/departments/getDepName/${collegeId}`,
      DELETE_DEPARTMENT: (id) => `/departments/delete/${id}`,
  },
    PROGRAMS: {
      GET_ALL: '/programs/all',
      GET_BY_ID: (id) => `/programs/${id}`,
      CREATE: '/programs/add',
      UPDATE: (id) => `/programs/update/${id}`,
      BY_DEPARTMENT: '/programs/departmentAll',
      PAGINATION: (page, perPage) => `/programs/query?page=${page}&perPage=${perPage}`,
      GET_NAMES_BY_DEPARTMENT_ID: (departmentId) => `/programs/getProgName/${departmentId}`,
      DELETE_PROGRAM: (id) => `/programs/delete/${id}`,
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
    DEPARTMENT: 'department'
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

export const QUANTITATIVE_ENDPOINTS = {
  GET_AREAS: '/qnt/areas',
  GET_HEADERS: (areaId) => `/qnt/headers/${areaId}`,
  GET_ITEMS: (areaId) => `/qnt/items/${areaId}`, 
  GET_PROGRAM_RESPONSES: (area_id,programId) => `/qnt/responses/${programId}/area/${area_id}`,
  GET_ALL_RESPONSES: '/qnt/responses',
  GET_AREA_SUMMARY_BY_ID: (areaId) => `/qnt/summary/${areaId}`,
  GET_USER_SUBMITTED_AREAS: (userId, programId) => `/qnt/submitted/${userId}/${programId}`,
  GET_COMPLETED_AREAS: (programId) => `/qnt/completed/${programId}`,
  GET_AREA_PROGRESS: (programId) => `/qnt/progress/${programId}`,
  GET_MISSING_RESPONSES: (programId, areaId) => `/qnt/missing/${programId}/${areaId}`,
  GET_MOST_SKIPPED_HEADERS: '/qnt/skipped-headers',
  GET_USER_PROGRAMS: (userId) => `/qnt/user-programs/${userId}`,
  SUBMIT_RESPONSES: '/qnt/responses',
  UPDATE_RESPONSES: (id) => `/qnt/responses/${id}`,
  DELETE_RESPONSES: (id) => `/qnt/responses/${id}`,
};

export const QUALITATIVE_ENDPOINTS = {
  GET_DOMAINS: '/qual/domains',
  GET_INDICATORS: (domainId) => `/qual/indicators/${domainId}`,
  GET_RESPONSES: (programId) => `/qual/responses/${programId}`,
  GET_UNANSWERED: (programId) => `/qual/unanswered/${programId}`,
  GET_DOMAIN_SUMMARY: (programId) => `/qual/summary/${programId}`,
  SUBMIT_RESPONSE: '/qual/responses',
  REMOVE_RESPONSE: (id) => `/qual/responses/${id}`,
  UPLOAD_EVIDENCE: (responseId) => `/qual/responses/${responseId}/evidence`,
  GET_EVIDENCE: (responseId) => `/qual/responses/${responseId}/evidence`,
  // Scoring endpoints for Results page
  GET_DOMAIN_WEIGHTS: '/qualitative/wi',
  GET_DOMAIN_SCORES: (programId) => `/qualitative/si/${programId}`,
  GET_WEIGHTED_RESULTS: (programId) => `/qualitative/wisi/${programId}`,
};

export const REPORT_ENDPOINTS = {
  GET_DOMAINS:'/qual/domains',
  GET_PROMPTS: (page, perPage,domainId) => `/report/prompts/${domainId}?page=${page}&perPage=${perPage}`,
  GET_RESULTS: (programId) => `/report/results/${programId}`,
  SAVE_REPORT: '/report/save',
};
