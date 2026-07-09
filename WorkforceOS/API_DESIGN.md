# WorkforceOS - API Design Document
## REST API Specification v1.0

---

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.workforceos.com/api/v1
```

---

## Authentication

All authenticated endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token contains:
- user_id
- organization_id
- roles
- permissions (cached)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... } | [ ... ],
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [ ... ]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 1. AUTHENTICATION ENDPOINTS

### POST /auth/register/candidate
Register new candidate account

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "userType": "candidate"
    },
    "token": "jwt_token"
  },
  "message": "Registration successful"
}
```

### POST /auth/login
Login (candidate, employee, admin)

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "userType": "candidate",
      "fullName": "John Doe",
      "roles": ["candidate"],
      "organizationId": "uuid"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/logout
Logout (invalidate token)

### GET /auth/me
Get current user profile

### POST /auth/forgot-password
Request password reset

### POST /auth/reset-password
Reset password with token

### POST /auth/refresh-token
Refresh JWT token

---

## 2. CANDIDATE PROFILE ENDPOINTS

### GET /candidate/profile
Get candidate profile (current user)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "candidateCode": "CAND-2024-001",
    "status": "active",
    "isProfileComplete": false,
    "profileCompletionPercentage": 45,
    "profile": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "dateOfBirth": "1995-06-15",
      "gender": "male",
      ...
    },
    "education": [ ... ],
    "skills": [ ... ],
    "employmentHistory": [ ... ],
    "bankDetails": { ... }
  }
}
```

### PUT /candidate/profile/personal
Update personal information

**Request:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1995-06-15",
  "gender": "male",
  "bloodGroup": "O+",
  "maritalStatus": "single",
  "phone": "+919876543210",
  "alternatePhone": "+919876543211",
  "currentAddress": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "postalCode": "400001"
  },
  "permanentAddress": { ... }
}
```

### PUT /candidate/profile/education
Update education information

**Request:**
```json
{
  "education": [
    {
      "qualification": "B.Tech",
      "institution": "IIT Mumbai",
      "boardOrUniversity": "Mumbai University",
      "specialization": "Computer Science",
      "yearOfPassing": 2018,
      "percentageOrCgpa": "8.5"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### PUT /candidate/profile/additional
Update additional information (bank, employment, compensation)

**Request:**
```json
{
  "bankDetails": {
    "accountHolderName": "John Doe",
    "bankName": "HDFC Bank",
    "accountNumber": "12345678901234",
    "ifscCode": "HDFC0001234",
    "branchName": "Mumbai Main",
    "accountType": "savings"
  },
  "employmentHistory": [
    {
      "companyName": "Tech Corp",
      "designation": "Software Engineer",
      "employmentType": "full_time",
      "fromDate": "2018-07-01",
      "toDate": "2022-12-31",
      "isCurrent": false,
      "reasonForLeaving": "Better opportunity"
    }
  ],
  "compensation": {
    "currentCtc": 800000,
    "expectedCtc": 1200000,
    "noticePeriodDays": 30,
    "availableFrom": "2024-08-01",
    "preferredLocations": ["Mumbai", "Pune"],
    "employmentTypePreference": "full_time",
    "willingToRelocate": true,
    "willingToTravel": false
  },
  "additionalNotes": "Looking for product-based company"
}
```

### POST /candidate/profile/resume
Upload resume

**Request:** Multipart form-data
```
file: <resume.pdf>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "fileName": "resume.pdf",
    "fileSize": 245678,
    "uploadedAt": "2024-07-08T10:30:00Z"
  }
}
```

### GET /candidate/profile/review
Get complete profile for review before submission

### POST /candidate/profile/submit
Mark profile as complete and submit for review

---

## 3. JOB & APPLICATION ENDPOINTS (Candidate)

### GET /candidate/jobs
Browse public job listings

**Query Params:**
- page (default: 1)
- limit (default: 20)
- search (keyword search)
- department
- location
- employmentType
- experienceMin
- experienceMax

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "jobCode": "JOB-2024-001",
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "location": "Mumbai",
      "employmentType": "full_time",
      "experienceMin": 3,
      "experienceMax": 5,
      "salaryRange": "10-15 LPA",
      "skillsRequired": ["React", "Node.js", "PostgreSQL"],
      "vacancies": 2,
      "publishedAt": "2024-07-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /candidate/jobs/:jobId
Get job details

### POST /candidate/jobs/:jobId/apply
Apply for a job

**Request:**
```json
{
  "coverLetter": "I am interested in this position because..."
}
```

### GET /candidate/applications
Get candidate's applications

**Query Params:**
- status (applied, screening, interviewing, selected, etc.)
- page, limit

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicationCode": "APP-2024-001",
      "job": {
        "id": "uuid",
        "title": "Senior Software Engineer",
        "jobCode": "JOB-2024-001"
      },
      "status": "screening",
      "appliedAt": "2024-07-05T10:00:00Z",
      "timeline": [
        {
          "stage": "applied",
          "timestamp": "2024-07-05T10:00:00Z"
        },
        {
          "stage": "screening",
          "timestamp": "2024-07-06T14:30:00Z"
        }
      ]
    }
  ]
}
```

### GET /candidate/applications/:applicationId
Get application details with timeline

---

## 4. CANDIDATE DOCUMENTS ENDPOINTS

### GET /candidate/documents
Get candidate's documents

### POST /candidate/documents
Upload document

**Request:** Multipart form-data
```
file: <document>
documentType: "resume" | "education_certificate" | "experience_letter" | etc.
category: string
```

### DELETE /candidate/documents/:documentId
Delete document

---

## 5. ADMIN - CANDIDATE MANAGEMENT ENDPOINTS

### GET /admin/candidates
List all candidates (with filters)

**Query Params:**
- page, limit
- search
- status
- source
- dateFrom, dateTo

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "candidateCode": "CAND-2024-001",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "status": "active",
      "isProfileComplete": true,
      "applicationsCount": 2,
      "createdAt": "2024-07-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /admin/candidates/:candidateId
Get candidate details

### PATCH /admin/candidates/:candidateId
Update candidate info (admin only)

### GET /admin/candidates/:candidateId/documents
Get candidate documents

### POST /admin/candidates/:candidateId/notes
Add internal note about candidate

### GET /admin/candidates/:candidateId/notes
Get candidate notes

---

## 6. ADMIN - JOB MANAGEMENT ENDPOINTS

### GET /admin/jobs
List jobs (all statuses)

### POST /admin/jobs
Create job posting

**Request:**
```json
{
  "title": "Senior Software Engineer",
  "departmentId": "uuid",
  "designationId": "uuid",
  "locationId": "uuid",
  "employmentType": "full_time",
  "experienceMin": 3,
  "experienceMax": 5,
  "salaryMin": 1000000,
  "salaryMax": 1500000,
  "currency": "INR",
  "description": "Full job description...",
  "requirements": "Required qualifications...",
  "responsibilities": "Key responsibilities...",
  "skillsRequired": ["React", "Node.js"],
  "vacancies": 2
}
```

### PUT /admin/jobs/:jobId
Update job

### PATCH /admin/jobs/:jobId/publish
Publish job

### PATCH /admin/jobs/:jobId/close
Close job

### GET /admin/jobs/:jobId/applications
Get applications for job

---

## 7. ADMIN - APPLICATION MANAGEMENT ENDPOINTS

### GET /admin/applications
List all applications

**Query Params:**
- jobId
- status
- candidateId
- page, limit

### GET /admin/applications/:applicationId
Get application details

### PATCH /admin/applications/:applicationId/stage
Move application to different stage

**Request:**
```json
{
  "toStage": "round_1",
  "notes": "Moving to technical round"
}
```

### POST /admin/applications/:applicationId/reject
Reject application

**Request:**
```json
{
  "reason": "Skills don't match requirements"
}
```

### POST /admin/candidates/:candidateId/convert-to-employee
Convert selected candidate to employee

**Request:**
```json
{
  "employeeCode": "EMP-2024-001",
  "departmentId": "uuid",
  "designationId": "uuid",
  "locationId": "uuid",
  "managerId": "uuid",
  "employmentType": "full_time",
  "joiningDate": "2024-08-01",
  "workEmail": "john.doe@company.com"
}
```

---

## 8. ADMIN - EMPLOYEE MANAGEMENT ENDPOINTS

### GET /admin/employees
List employees

**Query Params:**
- page, limit
- search
- departmentId
- designationId
- locationId
- status
- employmentType

### POST /admin/employees
Create employee (manual)

### GET /admin/employees/:employeeId
Get employee details

### PUT /admin/employees/:employeeId
Update employee

### PATCH /admin/employees/:employeeId/status
Update employee status

**Request:**
```json
{
  "status": "confirmed",
  "confirmationDate": "2024-11-01",
  "notes": "Probation successfully completed"
}
```

### GET /admin/employees/:employeeId/documents
Get employee documents

---

## 9. EMPLOYEE - SELF SERVICE ENDPOINTS

### GET /employee/profile
Get own profile

### PUT /employee/profile
Update own profile (limited fields)

### GET /employee/documents
Get own documents

### POST /employee/documents
Upload document

---

## 10. LEAVE MANAGEMENT ENDPOINTS

### GET /employee/leave/balance
Get leave balances

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "leaveType": {
        "id": "uuid",
        "name": "Casual Leave",
        "code": "CL"
      },
      "year": 2024,
      "openingBalance": 12,
      "accrued": 0,
      "used": 3,
      "pending": 2,
      "available": 7
    }
  ]
}
```

### POST /employee/leave/requests
Apply for leave

**Request:**
```json
{
  "leaveTypeId": "uuid",
  "fromDate": "2024-08-15",
  "toDate": "2024-08-17",
  "totalDays": 3,
  "reason": "Personal work",
  "contactDuringLeave": "+919876543210"
}
```

### GET /employee/leave/requests
Get own leave requests

### GET /employee/leave/requests/:requestId
Get leave request details

### PATCH /employee/leave/requests/:requestId/cancel
Cancel pending leave request

### GET /admin/leave/requests
Get all leave requests (for admin/manager)

**Query Params:**
- status (pending, approved, rejected)
- employeeId
- page, limit

### PATCH /admin/leave/requests/:requestId/approve
Approve leave request

**Request:**
```json
{
  "comments": "Approved"
}
```

### PATCH /admin/leave/requests/:requestId/reject
Reject leave request

**Request:**
```json
{
  "comments": "Team capacity issue"
}
```

### GET /admin/leave/types
Get leave types

### POST /admin/leave/types
Create leave type

### GET /admin/holidays
Get holidays

### POST /admin/holidays
Create holiday

---

## 11. POLICY MANAGEMENT ENDPOINTS

### GET /employee/policies
Get policies assigned to employee

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Code of Conduct",
      "description": "Company code of conduct policy",
      "version": 1,
      "effectiveFrom": "2024-01-01",
      "requiresAcknowledgment": true,
      "isAcknowledged": false,
      "dueDate": "2024-07-15",
      "document": {
        "id": "uuid",
        "fileName": "code-of-conduct-v1.pdf",
        "fileSize": 524288
      }
    }
  ]
}
```

### GET /employee/policies/:policyId
Get policy details

### POST /employee/policies/:policyId/acknowledge
Acknowledge policy

**Request:**
```json
{
  "comments": "I have read and understood the policy"
}
```

### GET /admin/policies
Get all policies

### POST /admin/policies
Create policy

**Request:**
```json
{
  "title": "Work From Home Policy",
  "code": "WFH-001",
  "description": "Guidelines for remote work",
  "policyType": "operational",
  "requiresAcknowledgment": true,
  "acknowledgmentRequiredWithinDays": 7,
  "effectiveFrom": "2024-08-01"
}
```

### PUT /admin/policies/:policyId
Update policy

### PATCH /admin/policies/:policyId/publish
Publish policy

### POST /admin/policies/:policyId/assign
Assign policy to users/groups

**Request:**
```json
{
  "assignmentType": "department",
  "targetId": "uuid",
  "dueDate": "2024-08-10"
}
```

### GET /admin/policies/:policyId/acknowledgments
Get acknowledgment status

---

## 12. ORGANIZATION SETTINGS ENDPOINTS

### GET /admin/organization
Get organization details

### PUT /admin/organization
Update organization

### GET /admin/departments
List departments

### POST /admin/departments
Create department

### GET /admin/designations
List designations

### POST /admin/designations
Create designation

### GET /admin/locations
List locations

### POST /admin/locations
Create location

---

## 13. RBAC ENDPOINTS

### GET /admin/roles
List roles

### POST /admin/roles
Create role

### GET /admin/permissions
List all permissions

### POST /admin/roles/:roleId/permissions
Assign permissions to role

**Request:**
```json
{
  "permissionIds": ["uuid1", "uuid2", "uuid3"]
}
```

### GET /admin/users/:userId/roles
Get user roles

### POST /admin/users/:userId/roles
Assign roles to user

**Request:**
```json
{
  "roleIds": ["uuid1", "uuid2"]
}
```

---

## 14. NOTIFICATION ENDPOINTS

### GET /notifications
Get user notifications

**Query Params:**
- isRead (true/false)
- page, limit

### PATCH /notifications/:notificationId/read
Mark notification as read

### PATCH /notifications/read-all
Mark all as read

### GET /notifications/preferences
Get notification preferences

### PUT /notifications/preferences
Update notification preferences

---

## 15. AUDIT & REPORTING ENDPOINTS

### GET /admin/audit-logs
Get audit logs

**Query Params:**
- userId
- entityType
- entityId
- action
- dateFrom, dateTo
- page, limit

### GET /admin/reports/dashboard
Get dashboard statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": {
      "total": 245,
      "active": 189,
      "thisMonth": 34
    },
    "employees": {
      "total": 156,
      "active": 152,
      "onProbation": 12
    },
    "jobs": {
      "active": 8,
      "totalApplications": 432
    },
    "leave": {
      "pendingApprovals": 5
    },
    "policies": {
      "pendingAcknowledgments": 23
    }
  }
}
```

---

## Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Not authenticated
- `PERMISSION_DENIED` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Unique constraint violation
- `INVALID_STATE` - Operation not allowed in current state
- `FILE_UPLOAD_ERROR` - File upload failed
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- File upload endpoints: 10 requests per minute per user
- Other endpoints: 100 requests per minute per user

---

**API Version**: 1.0  
**Last Updated**: 2026-07-08

