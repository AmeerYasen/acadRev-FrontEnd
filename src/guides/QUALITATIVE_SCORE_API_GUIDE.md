# Qualitative Score API Guide

This document provides a detailed guide on how to use the qualitative score API endpoints. These endpoints are used to calculate and retrieve various components of the qualitative score for academic programs.

**Base URL**: `/api/qualitative-score`

**Authentication**: All endpoints require a valid JSON Web Token (JWT) to be included in the `Authorization` header of the request.
Format: `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## 1. Get Domain Weights (`/wi`)

This endpoint retrieves the weight of each domain. The weight is calculated based on the number of indicators within each domain relative to the total number of indicators across all domains.

- **Endpoint**: `/api/qualitative-score/wi`
- **Method**: `GET`
- **Parameters**: None
- **Authentication**: Required

### Success Response (200 OK)

**Content-Type**: `application/json`

**Body**: An array of domain objects.

```json
[
  {
    "domain_id": 1,
    "domain_name": "أهداف البرنامج ومخرجات التعلم",
    "indicator_count": 5,
    "domain_weight": 12.50
  },
  {
    "domain_id": 2,
    "domain_name": "المنهاج الدراسي",
    "indicator_count": 4,
    "domain_weight": 10.00
  }
  // ... more domain objects
]
```

### Frontend Usage Example

```javascript
async function getDomainWeights(token) {
  try {
    const response = await fetch('/api/qualitative-score/wi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Domain Weights:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch domain weights:', error);
  }
}
```

---

## 2. Get Domain Scores (`/si/:programId`)

This endpoint retrieves the score for each domain for a specific program. The score is calculated based on the user responses ("Yes", "Somewhat", "No") to the indicators within each domain.

- **Endpoint**: `/api/qualitative-score/si/:programId`
- **Method**: `GET`
- **URL Parameters**:
  - `programId` (required): The ID of the program for which to calculate the scores.
- **Authentication**: Required

### Success Response (200 OK)

**Content-Type**: `application/json`

**Body**: An array of domain score objects.

```json
[
  {
    "domain_id": 1,
    "domain_name": "أهداف البرنامج ومخرجات التعلم",
    "indicator_count": 5,
    "domain_score": 85.00
  },
  {
    "domain_id": 2,
    "domain_name": "المنهاج الدراسي",
    "indicator_count": 4,
    "domain_score": 75.00
  }
  // ... more domain score objects
]
```

### Frontend Usage Example

```javascript
async function getDomainScores(programId, token) {
  try {
    const response = await fetch(`/api/qualitative-score/si/${programId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Domain Scores:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch domain scores:', error);
  }
}
```

---

## 3. Get Weighted Results and Final Score (`/wisi/:programId`)

This endpoint calculates the final qualitative score for a specific program. It combines the domain weights (`Wi`) and the domain scores (`Si`) to produce a weighted score for each domain, and then sums these up to get the total program score.

- **Endpoint**: `/api/qualitative-score/wisi/:programId`
- **Method**: `GET`
- **URL Parameters**:
  - `programId` (required): The ID of the program for which to calculate the final score.
- **Authentication**: Required

### Success Response (200 OK)

**Content-Type**: `application/json`

**Body**: An object containing the program ID, the final score, and an array of detailed results for each domain.

```json
{
  "program_id": "123",
  "result_by_domain": [
    {
      "domain_id": 1,
      "domain_name": "أهداف البرنامج ومخرجات التعلم",
      "indicator_count": 5,
      "domain_weight": 12.50,
      "domain_score": 85.00,
      "domain_weighted_score": 10.625000
    },
    {
      "domain_id": 2,
      "domain_name": "المنهاج الدراسي",
      "indicator_count": 4,
      "domain_weight": 10.00,
      "domain_score": 75.00,
      "domain_weighted_score": 7.500000
    }
    // ... more domain result objects
  ],
  "final_program_score": 81.25
}
```

### Frontend Usage Example

```javascript
async function getFinalScore(programId, token) {
  try {
    const response = await fetch(`/api/qualitative-score/wisi/${programId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Final Score and Weighted Results:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch final score:', error);
  }
}
```
