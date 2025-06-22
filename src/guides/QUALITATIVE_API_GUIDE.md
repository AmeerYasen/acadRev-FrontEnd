# Qualitative Evaluation API Guide

This guide provides detailed documentation for all qualitative evaluation endpoints in the acadRev system.

## Base URL
All endpoints are prefixed with `/api/qual`

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Authorization Levels
- **Read Operations**: All authenticated users can view data
- **Write Operations**: Only users with `department` role can create, update, or delete responses

---

## Endpoints Overview

### 1. Get All Domains
**Endpoint:** `GET /api/qual/domains`

**Description:** Retrieves all evaluation domains (المجالات) available in the system.

**Authorization:** All authenticated users

**Request:**
```http
GET /api/qual/domains
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "domain_ar": "أهداف البرنامج ومخرجات التعلم",
    "domain_en": null
  },
  {
    "id": 2,
    "domain_ar": "المنهاج الدراسي",
    "domain_en": null
  },
  {
    "id": 3,
    "domain_ar": "التعليم والتعلم",
    "domain_en": null
  }
]
```

**Response Fields:**
- `id` (integer): Unique domain identifier
- `domain_ar` (string): Domain name in Arabic
- `domain_en` (string|null): Domain name in English (currently null)

---

### 2. Get Indicators by Domain
**Endpoint:** `GET /api/qual/indicators/:domainId`

**Description:** Retrieves all indicators (المؤشرات) for a specific domain.

**Authorization:** All authenticated users

**Parameters:**
- `domainId` (integer, required): The ID of the domain

**Request:**
```http
GET /api/qual/indicators/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "domain": 1,
    "text": "يتوفر في البرنامج الأكاديمي أهداف واضحة ومحددة."
  },
  {
    "id": 2,
    "domain": 1,
    "text": "تم ترجمة رسالة البرنامج الأكاديمي إلى أهداف إجرائية قابلة للقياس."
  }
]
```

**Response Fields:**
- `id` (integer): Unique indicator identifier
- `domain` (integer): Domain ID this indicator belongs to
- `text` (string): The indicator statement/question in Arabic

---

### 3. Get Responses by Program
**Endpoint:** `GET /api/qual/responses/:programId`

**Description:** Retrieves all qualitative responses for a specific program.

**Authorization:** All authenticated users

**Parameters:**
- `programId` (integer, required): The ID of the program

**Request:**
```http
GET /api/qual/responses/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "indicator_id": 1,
    "domain_id": 1,
    "program_id": 1,
    "university_id": 2,
    "college_id": 1,
    "department_id": 1,
    "response": "نعم، يتوفر في البرنامج أهداف واضحة ومحددة تم إعدادها وفقاً للمعايير الأكاديمية المعتمدة.",
    "comment": "تم مراجعة الأهداف من قبل لجنة المناهج وتم اعتمادها من مجلس القسم.",
    "reviewer_comment": null,
    "created_at": "2025-05-15T10:30:00.000Z"
  }
]
```

**Response Fields:**
- `id` (integer): Unique response identifier
- `indicator_id` (integer): The indicator this response addresses
- `domain_id` (integer): The domain this response belongs to
- `program_id` (integer): The program being evaluated
- `university_id` (integer): University ID
- `college_id` (integer): College ID
- `department_id` (integer): Department ID
- `response` (string): The actual response text
- `comment` (string|null): Additional comments from the evaluator
- `reviewer_comment` (string|null): Comments from external reviewers
- `created_at` (datetime): Response creation timestamp

---

### 4. Submit/Update Response
**Endpoint:** `POST /api/qual/responses`

**Description:** Creates a new response or updates an existing one. If a response exists for the same indicator, program, and user, it will be updated; otherwise, a new response will be created.

**Authorization:** Only users with `department` role

**Request Body:**
```json
{
  "indicator_id": 1,
  "domain_id": 1,
  "program_id": 1,
  "response": "نعم، يتوفر في البرنامج أهداف واضحة ومحددة تم إعدادها وفقاً للمعايير الأكاديمية المعتمدة.",
  "comment": "تم مراجعة الأهداف من قبل لجنة المناهج وتم اعتمادها من مجلس القسم."
}
```

**Request:**
```http
POST /api/qual/responses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "indicator_id": 1,
  "domain_id": 1,
  "program_id": 1,
  "response": "نعم، يتوفر في البرنامج أهداف واضحة ومحددة...",
  "comment": "تم مراجعة الأهداف من قبل لجنة المناهج..."
}
```

**Request Fields:**
- `indicator_id` (integer, required): The indicator being responded to
- `domain_id` (integer, required): The domain this indicator belongs to
- `program_id` (integer, required): The program being evaluated
- `response` (string, required): The response text
- `comment` (string, optional): Additional comments

**Response (New Response):**
```json
{
  "inserted": true,
  "id": 1
}
```

**Response (Updated Response):**
```json
{
  "updated": true,
  "id": 1
}
```

**Notes:**
- The `user_id` is automatically extracted from the JWT token
- The `university_id`, `college_id`, and `department_id` are automatically fetched from the user's profile
- If a response already exists for the same indicator, program, and user, it will be updated
- The `updated_at` timestamp is automatically set for updates

---

### 5. Get Unanswered Indicators
**Endpoint:** `GET /api/qual/unanswered/:programId`

**Description:** Retrieves all indicators that haven't been answered for a specific program.

**Authorization:** All authenticated users

**Parameters:**
- `programId` (integer, required): The ID of the program

**Request:**
```http
GET /api/qual/unanswered/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 5,
    "domain": 1,
    "text": "أهداف البرنامج الأكاديمي ومخرجات التعلم قابلة للقياس.",
    "domain_ar": "أهداف البرنامج ومخرجات التعلم"
  },
  {
    "id": 7,
    "domain": 1,
    "text": "رسالة البرنامج الأكاديمي وأهدافه ومخرجات تعلمه منشورة ومعلنة ومعروفة للمجتمع...",
    "domain_ar": "أهداف البرنامج ومخرجات التعلم"
  }
]
```

**Response Fields:**
- `id` (integer): Indicator identifier
- `domain` (integer): Domain ID
- `text` (string): The indicator statement
- `domain_ar` (string): Domain name in Arabic

---

### 6. Get Domain Summary
**Endpoint:** `GET /api/qual/summary/:programId`

**Description:** Provides a summary of evaluation progress for each domain, showing total indicators and how many have been filled.

**Authorization:** All authenticated users

**Parameters:**
- `programId` (integer, required): The ID of the program

**Request:**
```http
GET /api/qual/summary/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "domain_id": 1,
    "domain_ar": "أهداف البرنامج ومخرجات التعلم",
    "total_indicators": 13,
    "filled": 8
  },
  {
    "domain_id": 2,
    "domain_ar": "المنهاج الدراسي",
    "total_indicators": 22,
    "filled": 15
  },
  {
    "domain_id": 3,
    "domain_ar": "التعليم والتعلم",
    "total_indicators": 14,
    "filled": 0
  }
]
```

**Response Fields:**
- `domain_id` (integer): Domain identifier
- `domain_ar` (string): Domain name in Arabic
- `total_indicators` (integer): Total number of indicators in this domain
- `filled` (integer): Number of indicators that have been answered

**Calculated Fields:**
You can calculate completion percentage as: `(filled / total_indicators) * 100`

---

### 7. Delete Response
**Endpoint:** `DELETE /api/qual/responses/:id`

**Description:** Deletes a specific response.

**Authorization:** Only users with `department` role

**Parameters:**
- `id` (integer, required): The ID of the response to delete

**Request:**
```http
DELETE /api/qual/responses/1
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "deleted": true,
  "affectedRows": 1
}
```

**Response Fields:**
- `deleted` (boolean): Always true if successful
- `affectedRows` (integer): Number of rows deleted (should be 1 if successful, 0 if response not found)

---

## Error Responses

### Authentication Errors
**Status Code:** 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** 403 Forbidden
```json
{
  "error": "Access denied. Invalid token."
}
```

### Authorization Errors
**Status Code:** 403 Forbidden
```json
{
  "error": "Access denied. Insufficient permissions."
}
```

### Validation Errors
**Status Code:** 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Missing required field: indicator_id"
}
```

### Not Found Errors
**Status Code:** 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### Server Errors
**Status Code:** 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## Data Flow Example

### Complete Evaluation Process:

1. **Get all domains:**
   ```bash
   GET /api/qual/domains
   ```

2. **Get indicators for each domain:**
   ```bash
   GET /api/qual/indicators/1
   GET /api/qual/indicators/2
   # ... for each domain
   ```

3. **Check current progress:**
   ```bash
   GET /api/qual/summary/1
   ```

4. **Get unanswered indicators:**
   ```bash
   GET /api/qual/unanswered/1
   ```

5. **Submit responses:**
   ```bash
   POST /api/qual/responses
   # Submit response for each indicator
   ```

6. **Review all responses:**
   ```bash
   GET /api/qual/responses/1
   ```

---

## Best Practices

### 1. Data Validation
- Always validate `indicator_id` and `domain_id` exist before submitting
- Ensure `program_id` corresponds to a program the user has access to
- Validate response text is not empty and within reasonable length limits

### 2. Error Handling
- Always check response status codes
- Handle network errors gracefully
- Provide user-friendly error messages

### 3. Performance
- Cache domain and indicator data as they change infrequently
- Use pagination for large response datasets if needed
- Consider implementing debounced auto-save for responses

### 4. Security
- Never expose JWT tokens in logs or error messages
- Validate user permissions on the frontend before allowing actions
- Sanitize all text input to prevent XSS attacks

### 5. User Experience
- Show progress indicators using the summary endpoint
- Highlight unanswered indicators
- Auto-save responses to prevent data loss
- Provide clear feedback on save/update operations

---

## Technical Notes

### Database Schema
The qualitative evaluation system uses these main tables:
- `domanis`: Evaluation domains
- `indicators`: Specific evaluation criteria
- `qlt_responses`: User responses to indicators
- `programs`: Academic programs being evaluated
- `users`: System users with role-based access

### Data Relationships
- Each indicator belongs to one domain
- Each response links to one indicator and one program
- Responses are tied to the user who created them
- University, college, and department are auto-populated from user data

### Important Notes
⚠️ **Database Table Name Inconsistency**: There's currently an inconsistency in the codebase where some functions query `domains` table while others query `domanis`. This should be resolved to use the correct table name `domanis` consistently.
