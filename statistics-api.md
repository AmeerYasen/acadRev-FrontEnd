# Statistics API Documentation

## Overview
The Statistics API provides simplified data analytics and metrics for the Academic Review System. It offers different levels of access based on user roles and provides insights into system usage, evaluations, and organizational structure.

**Important: This API has been optimized to return only essential data - numbers (counts), IDs, and names. No detailed objects or unnecessary information is included to ensure fast performance and minimal data transfer.**

**New Features:**
- **Recent Activity**: Track activity in the last 30 days for better insights
- **Response Value Ranges**: Categorized response data (Poor/Good/Excellent) perfect for creating pie charts and bar chartsatistics API Documentation

## Overview
The Statistics API provides simplified data analytics and metrics for the Academic Review System. It offers different levels of access based on user roles and provides insights into system usage, evaluations, and organizational structure.

**Important: This API has been optimized to return only essential data - numbers (counts), IDs, and names. No detailed objects or unnecessary information is included to ensure fast performance and minimal data transfer.**

## Base URL
```
/statistics
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Admin Statistics
**GET** `/admin`

Get complete system overview statistics (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "Admin statistics retrieved successfully",
  "data": {
    "counts": {
      "authorities": 2,
      "universities": 7,
      "colleges": 19,
      "departments": 56,
      "programs": 122,
      "users": 19,
      "responses": 183
    },
    "usersByRole": {
      "admin": 3,
      "authority": 1,
      "university": 1,
      "college": 1,
      "department": 1
    },
    "recentActivity": {
      "programs_last_30_days": 5,
      "users_last_30_days": 3,
      "responses_last_30_days": 45
    },
    "responseRanges": {
      "poor": 68,
      "good": 25,
      "excellent": 85,
      "total": 178
    },
    "authorities": [
      {"id": 1, "name": "Authority 1"},
      {"id": 2, "name": "Palestine HEA"}
    ]
  }
}
```

### 2. Authority Statistics
**GET** `/authority/:authorityId`

Get statistics for a specific authority and all entities under it.

**Parameters:**
- `authorityId` (path) - Authority ID

**Access:** Admin or Authority user (own authority only)

**Response:**
```json
{
  "success": true,
  "message": "Authority statistics retrieved successfully",
  "data": {
    "authority": {
      "id": 2,
      "name": "Palestine HEA",
      "email": "contact@psauth.org",
      "website": "https://www.psauth.org",
      "description": "Official authority for PS institutions",
      "created_at": "2025-05-15T21:38:00.000Z"
    },
    "summary": {
      "universities": 6,
      "colleges": 18,
      "departments": 55,
      "programs": 121,
      "users": 15
    },
    "universities": [...],
    "colleges": [...],
    "departments": [...],
    "programs": [...],
    "users": [...]
  }
}
```

### 3. University Statistics
**GET** `/university/:universityId`

Get statistics for a specific university and all entities under it.

**Parameters:**
- `universityId` (path) - University ID

**Access:** Admin, Authority, or University user (own university only)

**Response:**
```json
{
  "success": true,
  "message": "University statistics retrieved successfully",
  "data": {
    "university": {
      "id": 17,
      "name": "AmeerUniversity",
      "email": "ameryasen45@gmail.com",
      "address": "Ameer street",
      "phone": "123",
      "head_name": "Ameer Yasen 3",
      "created_at": "2025-05-19T20:53:28.000Z",
      "authority_name": "Palestine HEA"
    },
    "summary": {
      "colleges": 1,
      "departments": 1,
      "programs": 1,
      "users": 3,
      "responses": {
        "total_responses": 178,
        "programs_with_responses": 1,
        "average_score": 1.3371
      }
    },
    "colleges": [...],
    "departments": [...],
    "programs": [...],
    "users": [...]
  }
}
```

### 4. College Statistics
**GET** `/college/:collegeId`

Get statistics for a specific college and all entities under it.

**Parameters:**
- `collegeId` (path) - College ID

**Access:** Admin, Authority, University, or College user (own college only)

### 5. Department Statistics
**GET** `/department/:departmentId`

Get statistics for a specific department and all entities under it.

**Parameters:**
- `departmentId` (path) - Department ID

**Access:** Admin, Authority, University, College, or Department user (own department only)

**Response:**
```json
{
  "success": true,
  "message": "Department statistics retrieved successfully",
  "data": {
    "department": {
      "id": 56,
      "name": "Ameer Depratment",
      "email": "ameryasen45@gmail.com",
      "head_name": "Ameer Yasen",
      "created_at": "2025-05-29T23:16:29.000Z",
      "college_name": "Ameer College",
      "university_name": "AmeerUniversity",
      "authority_name": "Palestine HEA"
    },
    "summary": {
      "programs": 1,
      "users": 1,
      "responses": {
        "total_responses": 178,
        "programs_with_responses": 1,
        "domains_evaluated": 10,
        "average_score": 1.3371,
        "excellent_responses": 85,
        "good_responses": 25,
        "poor_responses": 68
      }
    },
    "programs": [...],
    "users": [...],
    "responsesByDomain": [...],
    "recentActivity": [...]
  }
}
```

### 6. Program Evaluation Statistics
**GET** `/program/:programId`

Get detailed evaluation statistics for a specific program.

**Parameters:**
- `programId` (path) - Program ID

**Access:** All authenticated users

**Response:**
```json
{
  "success": true,
  "message": "Program evaluation statistics retrieved successfully",
  "data": {
    "program": {
      "id": 122,
      "name": "Ameer Program",
      "language": "Arabic",
      "evaluator_name": null,
      "created_at": "2025-05-30T23:22:36.000Z",
      "department_name": "Ameer Depratment",
      "college_name": "Ameer College",
      "university_name": "AmeerUniversity",
      "authority_name": "Palestine HEA"
    },
    "completion": {
      "total_indicators": 178,
      "answered_indicators": 178,
      "completion_percentage": 100.0000
    },
    "domainStatistics": [
      {
        "domain_id": 1,
        "domain_name": "Program Objectives and Learning Outcomes",
        "domain_name_ar": "أهداف البرنامج ومخرجات التعلم",
        "total_indicators": 13,
        "answered_indicators": 13,
        "average_score": 1.8462,
        "excellent_count": 12,
        "good_count": 0,
        "poor_count": 1
      },
      ...
    ]
  }
}
```

### 7. User Context Statistics
**GET** `/my-statistics`

Get statistics based on the current user's role and context.

**Access:** All authenticated users

### 8. Dashboard Statistics
**GET** `/dashboard`

Get dashboard statistics for the current user (alias for `/my-statistics`).

**Access:** All authenticated users

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Authority ID is required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. You can only access your own authority statistics."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Authority not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch admin statistics",
  "error": "Database connection failed"
}
```

## Data Models

### Summary Statistics
- **authorities**: Number of authorities in the system
- **universities**: Number of universities
- **colleges**: Number of colleges
- **departments**: Number of departments
- **programs**: Number of programs
- **users**: Number of users
- **responses**: Number of evaluation responses

### Recent Activity (Last 30 Days)
- **programs_last_30_days**: Number of programs created in the last 30 days
- **users_last_30_days**: Number of users created in the last 30 days
- **responses_last_30_days**: Number of responses submitted in the last 30 days
- **updates_last_30_days**: Number of response updates in the last 30 days (program level)

### Response Value Ranges (Perfect for Charts)
- **poor**: Number of responses with score 0 (Poor quality)
- **good**: Number of responses with score 1 (Good quality)
- **excellent**: Number of responses with score 2 (Excellent quality)
- **total**: Total number of valid responses
- **average_score**: Average score across all responses (0-2 scale)

### Response Statistics
- **total_responses**: Total number of evaluation responses
- **programs_with_responses**: Number of programs that have responses
- **domains_evaluated**: Number of evaluation domains covered
- **average_score**: Average evaluation score (0-2 scale)
- **excellent_responses**: Number of responses with score 2
- **good_responses**: Number of responses with score 1
- **poor_responses**: Number of responses with score 0

### Domain Statistics
- **domain_id**: Domain identifier
- **domain_name**: Domain name in English
- **domain_name_ar**: Domain name in Arabic
- **total_indicators**: Total indicators in the domain
- **answered_indicators**: Number of answered indicators
- **average_score**: Average score for the domain
- **excellent_count**: Count of excellent ratings
- **good_count**: Count of good ratings
- **poor_count**: Count of poor ratings

## Usage Examples

### Get Admin Overview
```javascript
const response = await fetch('/statistics/admin', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Get University Statistics
```javascript
const universityId = 17;
const response = await fetch(`/statistics/university/${universityId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Get Current User's Statistics
```javascript
const response = await fetch('/statistics/my-statistics', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

## Notes

1. **Data Optimization**: This API returns only essential data - **numbers (counts), IDs, and names**. No detailed objects or unnecessary information is included.
2. **Chart-Ready Data**: Response ranges (poor/good/excellent) and recent activity data are perfect for creating pie charts, bar charts, and time-series visualizations.
3. **Recent Activity**: All endpoints now include activity metrics for the last 30 days to track trends and engagement.
4. **Authorization**: Each endpoint checks user permissions based on their role and associated entity IDs.
5. **Performance**: Optimized queries ensure fast response times by fetching only minimal required data.
6. **Real-time Updates**: Statistics are calculated in real-time from the database.
7. **Data Integrity**: All calculations are based on active records only (e.g., `is_active = 1` for users).
8. **Minimal Response**: Each endpoint returns only the core information needed for dashboards and reports.
