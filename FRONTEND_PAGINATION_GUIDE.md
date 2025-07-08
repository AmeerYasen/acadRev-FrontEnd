# Frontend Implementation Guide for Paginated Endpoints

## Overview

This guide details the new paginated endpoints for Universities and Colleges, including request parameters, response structures, and implementation examples for frontend developers.

## Table of Contents

- [Universities Endpoint](#universities-endpoint)
- [Colleges Endpoint](#colleges-endpoint)
- [Common Pagination Structure](#common-pagination-structure)
- [Frontend Implementation Examples](#frontend-implementation-examples)
- [Error Handling](#error-handling)

---

## Universities Endpoint

### Endpoint URL

```
GET /api/universities/all
```

### Authorization

- **Required**: Bearer Token
- **Roles**: `admin`, `authority`

### Query Parameters

| Parameter      | Type    | Default | Description                                  |
| -------------- | ------- | ------- | -------------------------------------------- |
| `page`         | integer | `1`     | Current page number                          |
| `perPage`      | integer | `14`    | Number of records per page                   |
| `search`       | string  | -       | Search term to filter by university name     |
| `sort_by`      | string  | `name`  | Field to sort by (see sortable fields below) |
| `sort_order`   | string  | `ASC`   | Sort direction (`ASC` or `DESC`)             |
| `authority_id` | integer | -       | Filter by specific authority ID              |

#### Sortable Fields for Universities

- `name` - University name
- `email` - University email
- `website` - University website
- `created_at` - Creation date
- `colleges_count` - Number of colleges
- `authority_name` - Authority name

### Request Example

```javascript
const params = new URLSearchParams({
  page: "1",
  perPage: "10",
  search: "Cairo",
  sort_by: "name",
  sort_order: "ASC",
});

fetch(`/api/universities/all?${params}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Response Structure

#### Success Response (200)

```typescript
interface UniversityResponse {
  success: true;
  message: string;
  data: University[];
  pagination: PaginationInfo;
}

interface University {
  id: number;
  name: string;
  email: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  phone: string | null;
  tax: string | null;
  head_name: string | null;
  authority_id: number;
  authority_name: string;
  created_at: string; // ISO date string
  colleges_count: number;
}
```

#### Example Response

```json
{
  "success": true,
  "message": "Universities retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Cairo University",
      "email": "info@cu.edu.eg",
      "website": "https://www.cu.edu.eg",
      "address": "Giza, Egypt",
      "logo": "/uploads/logos/cairo_uni.png",
      "phone": "+20123456789",
      "tax": "123456789",
      "head_name": "Prof. Ahmed Mohamed",
      "authority_id": 1,
      "authority_name": "Egyptian Higher Education Authority",
      "created_at": "2024-01-15T10:30:00.000Z",
      "colleges_count": 15
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalRecords": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

## Colleges Endpoint

### Endpoint URL

```
GET /api/colleges/all
```

### Authorization

- **Required**: Bearer Token
- **Roles**: `admin`, `authority`, `university`

### Query Parameters

| Parameter       | Type    | Default | Description                                  |
| --------------- | ------- | ------- | -------------------------------------------- |
| `page`          | integer | `1`     | Current page number                          |
| `perPage`       | integer | `14`    | Number of records per page                   |
| `search`        | string  | -       | Search term to filter by college name        |
| `sort_by`       | string  | `name`  | Field to sort by (see sortable fields below) |
| `sort_order`    | string  | `ASC`   | Sort direction (`ASC` or `DESC`)             |
| `university_id` | integer | -       | Filter by specific university ID             |

#### Sortable Fields for Colleges

- `name` - College name
- `email` - College email
- `website` - College website
- `created_at` - Creation date
- `departments_count` - Number of departments
- `university_name` - University name
- `authority_name` - Authority name

### Request Example

```javascript
const params = new URLSearchParams({
  page: "1",
  perPage: "10",
  search: "Engineering",
  sort_by: "name",
  sort_order: "ASC",
  university_id: "1",
});

fetch(`/api/colleges/all?${params}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Response Structure

#### Success Response (200)

```typescript
interface CollegeResponse {
  success: true;
  message: string;
  data: College[];
  pagination: PaginationInfo;
}

interface College {
  id: number;
  name: string;
  email: string | null;
  website: string | null;
  address: string | null;
  logo: string | null;
  head_name: string | null;
  university_id: number;
  university_name: string;
  authority_id: number;
  authority_name: string;
  created_at: string; // ISO date string
  departments_count: number;
}
```

#### Example Response

```json
{
  "success": true,
  "message": "Colleges retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Faculty of Engineering",
      "email": "engineering@cu.edu.eg",
      "website": "https://eng.cu.edu.eg",
      "address": "Giza, Egypt",
      "logo": "/uploads/logos/eng_faculty.png",
      "head_name": "Dr. Mohamed Ali",
      "university_id": 1,
      "university_name": "Cairo University",
      "authority_id": 1,
      "authority_name": "Egyptian Higher Education Authority",
      "created_at": "2024-01-20T09:15:00.000Z",
      "departments_count": 8
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalRecords": 32,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

---

## University Colleges Endpoint

### Endpoint URL

```
GET /api/colleges/uniAll
```

### Authorization

- **Required**: Bearer Token
- **Roles**: `university`

### Description

This endpoint returns paginated colleges for the logged-in university user. The `university_id` is automatically extracted from the user's token.

### Query Parameters

| Parameter    | Type    | Default | Description                           |
| ------------ | ------- | ------- | ------------------------------------- |
| `page`       | integer | `1`     | Current page number                   |
| `perPage`    | integer | `14`    | Number of records per page            |
| `search`     | string  | -       | Search term to filter by college name |
| `sort_by`    | string  | `name`  | Field to sort by                      |
| `sort_order` | string  | `ASC`   | Sort direction (`ASC` or `DESC`)      |

### Request Example

```javascript
const params = new URLSearchParams({
  page: "1",
  perPage: "10",
  search: "Science",
});

fetch(`/api/colleges/uniAll?${params}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

## Common Pagination Structure

```typescript
interface PaginationInfo {
  currentPage: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
```

---

## Frontend Implementation Examples

### React Hook for Pagination

```tsx
import { useState, useEffect } from "react";

interface UsePaginationProps {
  endpoint: string;
  initialPage?: number;
  initialPerPage?: number;
}

export const usePagination = ({
  endpoint,
  initialPage = 1,
  initialPerPage = 14,
}: UsePaginationProps) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: initialPage,
    perPage: initialPerPage,
    search: "",
    sort_by: "name",
    sort_order: "ASC",
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(
        Object.entries(filters)
          .filter(([_, value]) => value !== "" && value !== null)
          .map(([key, value]) => [key, String(value)])
      );

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change
    }));
  };

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination?.hasNextPage) {
      goToPage(pagination.nextPage);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrevPage) {
      goToPage(pagination.prevPage);
    }
  };

  return {
    data,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchData,
  };
};
```

### Usage Example

```tsx
import React from "react";
import { usePagination } from "./hooks/usePagination";

const UniversitiesList = () => {
  const {
    data: universities,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination({
    endpoint: "/api/universities/all",
    initialPerPage: 10,
  });

  const handleSearch = (search) => {
    updateFilters({ search, page: 1 });
  };

  const handleSort = (sort_by, sort_order) => {
    updateFilters({ sort_by, sort_order, page: 1 });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search universities..."
        value={filters.search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Universities List */}
      <div>
        {universities.map((university) => (
          <div key={university.id} className="university-card">
            <h3>{university.name}</h3>
            <p>Authority: {university.authority_name}</p>
            <p>Colleges: {university.colleges_count}</p>
            <p>Email: {university.email || "Not provided"}</p>
            <p>Website: {university.website || "Not provided"}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <div className="pagination">
          <button onClick={prevPage} disabled={!pagination.hasPrevPage}>
            Previous
          </button>

          <span>
            Page {pagination.currentPage} of {pagination.totalPages}({
              pagination.totalRecords
            } total records)
          </span>

          <button onClick={nextPage} disabled={!pagination.hasNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UniversitiesList;
```

### Pagination Component

```tsx
import React from "react";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  const generatePageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're at the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="pagination-btn"
      >
        Previous
      </button>

      {generatePageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="pagination-btn"
      >
        Next
      </button>

      <div className="pagination-info">
        Showing page {currentPage} of {totalPages}({pagination.totalRecords} total
        records)
      </div>
    </div>
  );
};

export default Pagination;
```

---

## Error Handling

### Error Response Structure

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}
```

### Common Error Responses

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to retrieve data",
  "error": "Database connection failed"
}
```

### Error Handling Example

```javascript
const handleApiError = (error, response) => {
  if (response.status === 401) {
    // Redirect to login
    window.location.href = "/login";
    return;
  }

  if (response.status === 403) {
    // Show permission denied message
    showNotification(
      "You do not have permission to access this resource",
      "error"
    );
    return;
  }

  // Handle other errors
  console.error("API Error:", error);
  showNotification(error.message || "An unexpected error occurred", "error");
};
```

---

## Notes

1. **Role-based Filtering**: The endpoints automatically filter results based on the user's role and permissions. For example, an authority user will only see universities under their authority.

2. **Default Values**: If no query parameters are provided, the endpoints will use default values (page=1, perPage=14, sort_by='name', sort_order='ASC').

3. **Search**: The search parameter performs a case-insensitive LIKE search on the name field.

4. **Sorting**: When sorting by related fields (e.g., 'authority_name'), the sort_by parameter should include the table alias (e.g., 'a.name'). However, for main table fields, you can use just the field name.

5. **Performance**: The pagination is implemented at the database level for optimal performance with large datasets.

6. **Backward Compatibility**: The old endpoints still exist but are deprecated. Plan to migrate all frontend code to use these new paginated endpoints.

---

## Migration Checklist

- [ ] Update API calls to use new endpoints
- [ ] Implement pagination controls in UI
- [ ] Add search functionality
- [ ] Add sorting functionality
- [ ] Update data models/interfaces
- [ ] Implement error handling for new response structure
- [ ] Test with different user roles
- [ ] Update documentation
- [ ] Remove old API calls after testing
