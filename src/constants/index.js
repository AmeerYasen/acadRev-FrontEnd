export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      // Add other auth endpoints if needed
    },    UNIVERSITIES: {
      GET_ALL: '/universities/all',
      CREATE: '/universities/add',
      UPDATE: '/universities/update',
      DELETE: (id) => `/universities/delete/${id}`,
      GET_UNI_NAMES: '/universities/getUniNames',
      GET_BY_ID: (id) => `/universities/${id}`,
      GET_MY_UNIVERSITY: '/universities/me',
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
        GET_NAMES_BY_UNI: (universityId) => `/colleges/getNamesByUni/${universityId}`
    },
    DEPARTMENTS: {
      GET_ALL: '/departments/all',
      CREATE: '/departments/add',
      UPDATE: '/departments/update',
      DELETE: '/departments/delete',
      MY_DEPARTMENT: '/departments/me',
      BY_COLLEGE: '/departments/collegeAll',
      GET_BY_ID: (id) => `/departments/${id}`,
      PAGINATION: (page, perPage) => `/departments/query?page=${page}&perPage=${perPage}`,
      GET_NAMES_BY_COLLEGE_ID: (collegeId) => `/departments/getDepName/${collegeId}`,
  },
    PROGRAMS: {
      GET_ALL: '/programs/all',
      GET_BY_ID: (id) => `/programs/${id}`,
      CREATE: '/programs/add',
      UPDATE: (id) => `/programs/update/${id}`,
      DELETE: (id) => `/programs/delete/${id}`,
      // MY_PROGRAM: '/programs/me',
      BY_DEPARTMENT: '/programs/departmentAll',
      PAGINATION: (page, perPage) => `/programs/query?page=${page}&perPage=${perPage}`,
      GET_NAMES_BY_DEPARTMENT_ID: (departmentId) => `/programs/getProgName/${departmentId}`,
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
  GET_PROGRAM_RESPONSES: (programId) => `/qnt/responses/${programId}`,
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
  GET_DOMAINS: '/qlt/domains',
  GET_INDICATORS: (domainId) => `/qlt/indicators/${domainId}`,
  GET_RESPONSES: (programId) => `/qlt/responses/${programId}`,
  GET_UNANSWERED: (programId) => `/qlt/unanswered/${programId}`,
  GET_DOMAIN_SUMMARY: (programId) => `/qlt/summary/${programId}`,
  SUBMIT_RESPONSE: '/qlt/responses',
  REMOVE_RESPONSE: (id) => `/qlt/responses/${id}`,
  
  // Evidence Management Endpoints
  UPLOAD_EVIDENCE: '/qlt/evidence/upload',
  GET_EVIDENCE: (programId, indicatorId) => `/qlt/evidence/${programId}/${indicatorId}`,
  DELETE_EVIDENCE: (evidenceId) => `/qlt/evidence/${evidenceId}`,
  ADD_URL_EVIDENCE: '/qlt/evidence/url',
  GET_ALL_EVIDENCE: (programId) => `/qlt/evidence/program/${programId}`,
};



// الجميع يمكنهم الاطلاع
// router.get('/domains', authenticateToken, qlt.getDomains);
// router.get('/indicators/:domainId', authenticateToken, qlt.getIndicators);
// router.get('/responses/:programId', authenticateToken, qlt.getResponses);
// router.get('/unanswered/:programId', authenticateToken, qlt.getUnanswered);
// router.get('/summary/:programId', authenticateToken, qlt.getDomainSummary);

// // فقط رئيس القسم يستطيع التعديل
// router.post('/responses', authenticateToken, authorizeRole(['department']), qlt.submitResponse);
// router.delete('/responses/:id', authenticateToken, authorizeRole(['department']), qlt.removeResponse);