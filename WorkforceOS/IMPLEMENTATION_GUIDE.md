# WorkforceOS - Implementation Guide & Next Steps

## 🎉 What Has Been Built

A solid, production-ready foundation for the WorkforceOS platform has been created with:

### ✅ Complete Backend Infrastructure
- Express.js server with modular architecture
- JWT authentication with refresh tokens
- Dynamic RBAC with permission caching
- Comprehensive error handling
- File upload system (Supabase Storage integration)
- Request logging and audit trails
- Rate limiting
- Input validation
- Database connection pooling
- Graceful shutdown handling

### ✅ Complete Database Schema Design
All 5 SQL schema files created:
1. **001_core_tables.sql** - Identity, RBAC, Organization, Audit, Notifications
2. **002_candidate_tables.sql** - Candidate management, Jobs, Applications
3. **003_employee_tables.sql** - Employee management
4. **004_leave_tables.sql** - Leave management & holidays
5. **005_policy_tables.sql** - Policy management & workflow engine

### ✅ Working Authentication Module
Complete auth flow with:
- Candidate registration
- Login/logout
- Password reset
- Token refresh
- Change password

### ✅ Comprehensive Documentation
- ARCHITECTURE.md
- PROJECT_STRUCTURE.md
- DATABASE_SCHEMA.md
- API_DESIGN.md
- BUILD_STATUS.md
- IMPLEMENTATION_GUIDE.md (this file)

---

## 🚀 Quick Start Guide

### 1. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Edit .env.local with your configuration:
# - DATABASE_URL (Supabase Postgres connection string)
# - SUPABASE_URL (your Supabase project URL)
# - SUPABASE_SERVICE_KEY (service role key)
# - JWT_SECRET (generate strong secret)
# - FRONTEND_URL (for CORS)
```

### 2. Initialize Database

Execute SQL files in your Supabase SQL Editor in order:

```sql
-- Run in order:
database/schema/001_core_tables.sql
database/schema/002_candidate_tables.sql
database/schema/003_employee_tables.sql
database/schema/004_leave_tables.sql
database/schema/005_policy_tables.sql
```

This will create:
- All tables with proper indexes
- System roles (Super Admin, Admin, HR, Recruiter, Manager, Employee, Candidate)
- Permissions (dashboard, employees, candidates, jobs, leave, documents, policies, etc.)

### 3. Start Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

Test health endpoint:
```bash
curl http://localhost:5000/health
```

### 4. Test Authentication

**Register Candidate:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register/candidate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "phone": "+919876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

You'll receive a JWT token. Use it for authenticated requests:

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Implementation Roadmap

### Phase 1: Complete Backend Modules (Current Priority)

#### A. Candidate Management Module
**Priority**: HIGH  
**Estimated Time**: 2-3 days

Files to create:
```
src/modules/candidate/
├── profile/
│   ├── profile.routes.js
│   ├── profile.controller.js
│   ├── profile.service.js
│   ├── profile.repository.js
│   └── profile.validator.js
├── application/
│   ├── application.routes.js
│   ├── application.controller.js
│   ├── application.service.js
│   └── application.repository.js
├── job/
│   ├── job.routes.js
│   ├── job.controller.js
│   ├── job.service.js
│   └── job.repository.js
└── admin/
    ├── candidateAdmin.routes.js
    ├── candidateAdmin.controller.js
    ├── candidateAdmin.service.js
    └── conversion.service.js
```

**API Endpoints to implement:**
- `GET /candidate/profile` - Get own profile
- `PUT /candidate/profile/personal` - Update personal info
- `PUT /candidate/profile/education` - Update education
- `PUT /candidate/profile/additional` - Update bank/employment/compensation
- `POST /candidate/profile/resume` - Upload resume
- `POST /candidate/profile/submit` - Submit complete profile
- `GET /candidate/jobs` - Browse jobs
- `POST /candidate/jobs/:jobId/apply` - Apply for job
- `GET /candidate/applications` - Get own applications
- `GET /admin/candidates` - List all candidates
- `PATCH /admin/applications/:id/stage` - Move application stage
- `POST /admin/candidates/:id/convert-to-employee` - Convert to employee

**Key Features:**
1. Profile completion tracking with percentage
2. Resume upload to Supabase Storage
3. Multi-step profile wizard data handling
4. Job application flow
5. Candidate-to-employee conversion (transaction)
6. Admin candidate pipeline management

#### B. Employee Management Module
**Priority**: HIGH  
**Estimated Time**: 1-2 days

Files to create:
```
src/modules/employee/
├── profile/
│   ├── employeeProfile.routes.js
│   ├── employeeProfile.controller.js
│   ├── employeeProfile.service.js
│   └── employeeProfile.repository.js
└── admin/
    ├── employeeAdmin.routes.js
    ├── employeeAdmin.controller.js
    ├── employeeAdmin.service.js
    └── employeeAdmin.repository.js
```

**API Endpoints:**
- `GET /employee/profile` - Get own profile
- `PUT /employee/profile` - Update limited fields
- `GET /admin/employees` - List employees
- `POST /admin/employees` - Create employee manually
- `GET /admin/employees/:id` - Get employee details
- `PUT /admin/employees/:id` - Update employee
- `PATCH /admin/employees/:id/status` - Change status

#### C. Leave Management Module
**Priority**: MEDIUM  
**Estimated Time**: 2 days

Files to create:
```
src/modules/leave/
├── request/
│   ├── leaveRequest.routes.js
│   ├── leaveRequest.controller.js
│   ├── leaveRequest.service.js
│   ├── leaveRequest.repository.js
│   └── leaveRequest.validator.js
├── admin/
│   ├── leaveAdmin.routes.js
│   ├── leaveAdmin.controller.js
│   └── leaveAdmin.service.js
└── master/
    ├── leaveType.routes.js
    └── holiday.routes.js
```

**API Endpoints:**
- `GET /employee/leave/balance` - Get leave balances
- `POST /employee/leave/requests` - Apply for leave
- `GET /employee/leave/requests` - Get own requests
- `PATCH /admin/leave/requests/:id/approve` - Approve leave
- `PATCH /admin/leave/requests/:id/reject` - Reject leave
- `GET /admin/leave/types` - Manage leave types
- `GET /admin/holidays` - Manage holidays

**Key Features:**
1. Leave balance calculation
2. Leave approval workflow
3. Holiday calendar integration
4. Working days calculation

#### D. Policy Management Module
**Priority**: MEDIUM  
**Estimated Time**: 1-2 days

Files to create:
```
src/modules/policy/
├── policy.routes.js
├── policy.controller.js
├── policy.service.js
├── policy.repository.js
└── policy.validator.js
```

**API Endpoints:**
- `GET /employee/policies` - Get assigned policies
- `POST /employee/policies/:id/acknowledge` - Acknowledge policy
- `GET /admin/policies` - List all policies
- `POST /admin/policies` - Create policy
- `PATCH /admin/policies/:id/publish` - Publish policy
- `POST /admin/policies/:id/assign` - Assign to employees

#### E. Core Support Services
**Priority**: MEDIUM  
**Estimated Time**: 1-2 days

Files to create:
```
src/modules/core/
├── organization/
│   ├── organization.routes.js
│   ├── organization.controller.js
│   ├── organization.service.js
│   └── organization.repository.js
├── rbac/
│   ├── role.routes.js
│   ├── rbac.controller.js
│   ├── rbac.service.js
│   └── rbac.repository.js
├── document/
│   ├── document.routes.js
│   ├── document.controller.js
│   ├── document.service.js
│   └── document.repository.js
├── notification/
│   ├── notification.routes.js
│   ├── notification.controller.js
│   ├── notification.service.js
│   └── notification.repository.js
└── audit/
    ├── audit.routes.js
    └── audit.service.js
```

---

### Phase 2: Frontend Application

#### A. Project Setup
**Priority**: HIGH after backend complete  
**Estimated Time**: 1 day

Create:
```
frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── config/
        └── config.js
```

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.0",
    "axios": "^1.7.2",
    "zustand": "^4.5.4",
    "@tanstack/react-query": "^5.49.2",
    "react-hook-form": "^7.52.1",
    "zod": "^3.23.8",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^3.4.4"
  }
}
```

#### B. Shared Components Library
**Priority**: HIGH  
**Estimated Time**: 2-3 days

Create reusable UI components:
- Button, Input, Select, Textarea
- Modal, Dialog, Alert
- Table, Card, Badge, Avatar
- Tabs, Stepper
- Form field wrappers
- Loading states
- Empty states

#### C. Candidate Portal
**Priority**: HIGH  
**Estimated Time**: 4-5 days

**Pages:**
1. Candidate Login/Register
2. Profile Completion Wizard (5 steps):
   - Step 1: Resume Upload
   - Step 2: Personal Information
   - Step 3: Education & Skills
   - Step 4: Additional Information (Bank, Employment, Compensation)
   - Step 5: Review & Submit
3. Candidate Dashboard
4. Browse Jobs
5. My Applications
6. Application Details

**Key Features:**
- Step-by-step wizard with progress tracking
- Form validation
- File upload with preview
- Application status timeline
- Job search and filters

#### D. Employee Portal (ESS)
**Priority**: MEDIUM  
**Estimated Time**: 3-4 days

**Pages:**
1. Employee Dashboard
2. My Profile (view/edit)
3. Leave Management
4. My Documents
5. Policies
6. Policy Acknowledgment

#### E. Admin Portal
**Priority**: MEDIUM  
**Estimated Time**: 5-6 days

**Modules:**
1. Admin Dashboard with stats
2. Candidate Management
   - List candidates
   - View candidate details
   - Move application stages
   - Convert to employee
3. Employee Management
   - List employees
   - Create/edit employees
   - View employee details
4. Job Management
   - Create/edit jobs
   - Publish jobs
   - View applications
5. Leave Management
   - Approve/reject requests
   - View leave balances
   - Manage leave types
6. Policy Management
   - Create/edit policies
   - Assign policies
   - Track acknowledgments
7. Organization Settings
   - Departments, Designations, Locations
   - Roles & Permissions

---

## 🏗️ Implementation Pattern (Follow This)

For each new backend module, follow this exact pattern:

### 1. Routes Layer (`*.routes.js`)
```javascript
import express from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/permission.middleware.js';
import { asyncHandler } from '../../middleware/error.middleware.js';
import * as controller from './module.controller.js';
import * as validator from './module.validator.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requirePermission('resource.view'),
  asyncHandler(controller.list)
);

router.post(
  '/',
  authenticate,
  requirePermission('resource.create'),
  validator.validateCreate,
  asyncHandler(controller.create)
);

export default router;
```

### 2. Controller Layer (`*.controller.js`)
```javascript
import * as service from './module.service.js';
import { successResponse, paginatedResponse } from '../../utils/response.js';

export const list = async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const result = await service.list(filters, page, limit, req.user.organizationId);
  return paginatedResponse(res, result.data, result.pagination);
};

export const create = async (req, res) => {
  const data = await service.create(req.body, req.user);
  return successResponse(res, data, 'Created successfully');
};
```

### 3. Service Layer (`*.service.js`)
```javascript
import * as repository from './module.repository.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { getPagination } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

export const list = async (filters, page, limit, organizationId) => {
  const pagination = getPagination(page, limit);
  const data = await repository.findAll(filters, pagination, organizationId);
  const total = await repository.count(filters, organizationId);
  
  return {
    data,
    pagination: { ...pagination, total }
  };
};

export const create = async (data, user) => {
  // Business logic here
  const result = await repository.create({
    ...data,
    organization_id: user.organizationId,
    created_by: user.id
  });
  
  logger.info(`Created resource: ${result.id}`);
  return result;
};
```

### 4. Repository Layer (`*.repository.js`)
```javascript
import { query } from '../../config/database.js';

export const findAll = async (filters, pagination, organizationId) => {
  const result = await query(
    `SELECT * FROM table_name 
     WHERE organization_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [organizationId, pagination.limit, pagination.offset]
  );
  return result.rows;
};

export const create = async (data) => {
  const result = await query(
    `INSERT INTO table_name (field1, field2, organization_id, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.field1, data.field2, data.organization_id, data.created_by]
  );
  return result.rows[0];
};

export const count = async (filters, organizationId) => {
  const result = await query(
    `SELECT COUNT(*) FROM table_name WHERE organization_id = $1`,
    [organizationId]
  );
  return parseInt(result.rows[0].count);
};
```

### 5. Validator Layer (`*.validator.js`)
```javascript
import Joi from 'joi';
import { validateBody } from '../../middleware/validation.middleware.js';

const createSchema = Joi.object({
  field1: Joi.string().required(),
  field2: Joi.string().optional(),
  field3: Joi.number().min(0).required()
});

export const validateCreate = validateBody(createSchema);
```

### 6. Register Routes in `app.js`
```javascript
import moduleRoutes from './modules/module/module.routes.js';

app.use(`/api/${API_VERSION}/module`, moduleRoutes);
```

---

## 🔐 Security Checklist

- ✅ All passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Permission checks on protected routes
- ✅ Organization-scoped data access
- ✅ Rate limiting on auth endpoints
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Helmet security headers
- ⏳ API key authentication for external integrations (future)
- ⏳ 2FA support (future)

---

## 🧪 Testing Strategy

### Backend Testing
```bash
npm install --save-dev jest supertest

# Create tests:
# - __tests__/auth.test.js
# - __tests__/candidate.test.js
# - __tests__/employee.test.js
```

### Frontend Testing
```bash
npm install --save-dev vitest @testing-library/react

# Create tests:
# - src/__tests__/components/
# - src/__tests__/pages/
```

---

## 📦 Deployment Guide

### Backend Deployment (Railway/Render/DigitalOcean)

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_db_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=strong_production_secret
FRONTEND_URL=https://your-frontend-domain.com
```

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

### Frontend Deployment (Vercel/Netlify)

**Environment Variables:**
```
VITE_API_URL=https://your-backend-api.com/api/v1
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist/
```

---

## 📊 Progress Tracking

Create issues/tasks for:
- [ ] Candidate profile management
- [ ] Job browsing and application
- [ ] Admin candidate management
- [ ] Candidate-to-employee conversion
- [ ] Employee management
- [ ] Leave management
- [ ] Policy management
- [ ] Frontend setup
- [ ] Candidate portal UI
- [ ] Employee portal UI
- [ ] Admin portal UI

---

## 🎯 Success Metrics

### Technical Metrics
- API response time < 200ms (p95)
- Page load time < 2s
- Zero authentication vulnerabilities
- 100% test coverage on critical paths

### Business Metrics
- Candidate profile completion rate > 80%
- Average time to hire < 30 days
- Leave approval turnaround < 24 hours
- Policy acknowledgment compliance > 95%

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check pool status
# Add logging in database.js
```

### JWT Token Issues
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Test token generation
node -e "console.log(require('jsonwebtoken').sign({test:1}, 'secret'))"
```

### File Upload Issues
```bash
# Check Supabase Storage bucket exists
# Verify SUPABASE_SERVICE_KEY has storage permissions
# Check file size limits
```

---

## 📚 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Best Practices](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Performance Tips](https://www.postgresql.org/docs/)

---

## 💡 Pro Tips

1. **Use transactions for multi-step operations**: Candidate-to-employee conversion, bulk updates
2. **Cache permissions**: Already implemented in permission.middleware.js
3. **Log everything important**: Use logger.info/error throughout
4. **Validate early**: Frontend + backend validation
5. **Test with real data**: Create seed scripts for development
6. **Monitor performance**: Add APM tool in production
7. **Keep dependencies updated**: Regular security updates
8. **Document as you build**: Update API_DESIGN.md with changes

---

**Last Updated**: 2026-07-08  
**Next Action**: Implement Candidate Management Module (Start with profile.service.js)
