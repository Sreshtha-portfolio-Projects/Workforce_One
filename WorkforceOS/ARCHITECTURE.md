# WorkforceOS - Enterprise Workforce Operating System
## Product Architecture Document v1.0

---

## 1. SYSTEM OVERVIEW

WorkforceOS is a modular Enterprise Workforce Management Platform designed as a scalable operating system for workforce operations. It supports multiple organizations, dynamic role-based access control, and extensible module architecture.

### 1.1 Core Principles

- **Modular Architecture**: Clear separation of concerns with pluggable modules
- **Multi-tenancy**: Support multiple organizations in single deployment
- **Dynamic RBAC**: Configurable roles and permissions without code changes
- **API-First**: All business logic flows through backend APIs
- **Audit-Ready**: Complete trail of all business operations
- **Future-Proof**: Designed to accommodate AI, advanced workflows, and new modules

---

## 2. PHASE 1 SCOPE

### 2.1 Platform Core (Foundation Layer)
- Organization Management (multi-company support)
- Dynamic RBAC Engine
- Workflow Engine (foundation for future workflow builder)
- Notification Engine (in-app + email-ready)
- Audit & Activity Engine
- Document/File Abstraction Layer

### 2.2 Phase 1 Modules
1. **Candidate Management Portal (CMP)**
   - Public career portal
   - Candidate auth & profile completion wizard
   - Job browsing & application
   - Application tracking
   - Internal ATS for recruiters
   - Candidate-to-employee conversion

2. **Core HRMS / Employee Management**
   - Employee master data
   - Department/designation structure
   - Employment lifecycle support
   - Reporting relationships

3. **Employee Self-Service Portal (ESS)**
   - Employee dashboard
   - Profile management
   - Document access
   - Policy acknowledgment

4. **Leave Management**
   - Leave types & policies
   - Leave balance tracking
   - Leave request/approval workflow
   - Holiday calendar

5. **Document Management**
   - Centralized document metadata
   - Multi-entity document support (candidate/employee/policy)
   - Verification status tracking
   - Supabase Storage integration

6. **Policy Management**
   - Policy creation & versioning
   - Policy assignment
   - Acknowledgment tracking

7. **Dashboards & Reporting**
   - Candidate dashboard
   - Employee dashboard
   - Admin/HR dashboard
   - Basic analytics

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ Candidate      │  │ Employee       │  │ Admin/HR      │ │
│  │ Portal         │  │ Portal (ESS)   │  │ Portal        │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                        │
│              (Express.js REST API Server)                    │
│                                                               │
│  Authentication → Authorization → Rate Limiting → Logging    │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    PLATFORM CORE                     │   │
│  │  • Org Management  • RBAC  • Workflow  • Audit      │   │
│  │  • Notifications   • Documents                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Candidate │ │ Employee │ │  Leave   │ │ Policy   │      │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌───────────────────┐  ┌──────────────────────────────┐   │
│  │ Supabase Postgres │  │ Supabase Storage             │   │
│  │ (Business Data)   │  │ (Files: Resumes, Docs, etc.) │   │
│  └───────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Module Boundaries

Each module is self-contained with:
- **Routes**: API endpoint definitions
- **Controllers**: Request/response handling
- **Services**: Business logic
- **Repositories**: Data access layer
- **Validators**: Input validation schemas
- **Models**: Data structures

Modules communicate through:
- Direct service calls (same process)
- Shared core services (RBAC, audit, notifications)
- Event system (future enhancement)

---

## 4. TECHNOLOGY STACK

### 4.1 Frontend
- **Framework**: React 18+ with Vite
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: 
  - Zustand (lightweight global state)
  - TanStack Query (server state & caching)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

### 4.2 Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript
- **Architecture Pattern**: Layered architecture
- **Validation**: express-validator / Joi
- **Authentication**: JWT + Supabase Auth
- **File Upload**: Multer
- **Logging**: Winston / Morgan

### 4.3 Database & Infrastructure
- **Database**: Supabase Postgres
- **Authentication Store**: Supabase Auth
- **File Storage**: Supabase Storage
- **Migration Tool**: Supabase migrations / node-pg-migrate
- **ORM**: Raw SQL / pg library (avoiding heavy ORMs for control)

---

## 5. DATA ARCHITECTURE

### 5.1 Multi-tenancy Strategy

Every major business entity includes:
```sql
organization_id UUID NOT NULL REFERENCES organizations(id)
created_by UUID REFERENCES users(id)
updated_by UUID REFERENCES users(id)
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

Row-level security (RLS) is NOT enforced at Supabase level since all access goes through backend APIs.

### 5.2 Entity Groups

1. **Identity & Access**: users, roles, permissions, user_roles, role_permissions
2. **Organization**: organizations, departments, designations, locations
3. **Candidate**: candidates, candidate_profiles, applications, jobs
4. **Employee**: employees, employee_profiles
5. **Leave**: leave_types, leave_balances, leave_requests, holidays
6. **Document**: documents (shared)
7. **Policy**: policies, policy_assignments, policy_acknowledgements
8. **Audit**: audit_logs, notifications

### 5.3 Key Design Patterns

- **Soft Deletes**: Most entities use `is_deleted` flag
- **Status Tracking**: Enums for lifecycle states
- **Audit Trail**: All state changes logged
- **Document Ownership**: Polymorphic document relationships via `owner_type` + `owner_id`

---

## 6. SECURITY ARCHITECTURE

### 6.1 Authentication Flow

1. User credentials sent to `/auth/login`
2. Backend validates against Supabase Auth
3. JWT token generated with user_id, org_id, roles
4. Token stored in httpOnly cookie / localStorage
5. All subsequent requests include token in Authorization header

### 6.2 Authorization Flow

1. Request arrives with JWT
2. Auth middleware validates token
3. User context extracted (user_id, org_id, roles)
4. Permission middleware checks required permission
5. If authorized, request proceeds to business logic
6. All data queries filtered by organization_id

### 6.3 RBAC Model

```
User → UserRoles → Roles → RolePermissions → Permissions
```

Permissions are resource-action pairs:
- Format: `resource.action`
- Examples: `employees.view`, `candidates.edit`, `leave.approve`

Middleware example:
```javascript
requirePermission('employees.edit')
```

---

## 7. API DESIGN PRINCIPLES

### 7.1 RESTful Conventions

- **GET**: Read operations (list, detail)
- **POST**: Create operations
- **PUT/PATCH**: Update operations
- **DELETE**: Delete operations (usually soft delete)

### 7.2 URL Structure

```
/api/v1/{portal}/{module}/{resource}/{action}

Examples:
- /api/v1/candidate/profile
- /api/v1/candidate/applications
- /api/v1/admin/candidates
- /api/v1/admin/employees
- /api/v1/employee/leave/requests
```

### 7.3 Response Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [ ... ]
  }
}
```

Pagination:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 8. FRONTEND ARCHITECTURE

### 8.1 Application Structure

```
frontend/
├── src/
│   ├── features/          # Feature-based modules
│   │   ├── candidate/
│   │   ├── employee/
│   │   ├── admin/
│   │   └── common/
│   ├── layouts/           # Layout components
│   ├── components/        # Shared components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utilities
│   └── App.jsx
```

### 8.2 Routing Strategy

Three main portal areas:
1. **Public/Candidate Portal**: `/candidate/*`
2. **Employee Portal**: `/employee/*`
3. **Admin/HR Portal**: `/admin/*`

Each portal has:
- Dedicated layout
- Auth guards
- Role-based navigation
- Portal-specific state

### 8.3 Component Patterns

- **Page Components**: Top-level route components
- **Feature Components**: Business logic components
- **Shared Components**: Reusable UI components (Button, Table, Modal, Form fields)
- **Layout Components**: Shell components (Header, Sidebar, Footer)

---

## 9. WORKFLOW ENGINE (Foundation)

Phase 1 includes workflow foundation for future extensibility.

### 9.1 Workflow Concepts

- **Workflow Definition**: Template for approval flow
- **Workflow Instance**: Active workflow for specific entity
- **Workflow Steps**: Stages in approval chain
- **Approvals**: Individual approval actions

### 9.2 Phase 1 Workflows

1. Leave approval workflow (manager → HR)
2. Candidate stage progression
3. Policy acknowledgment workflow
4. Document verification workflow (future)

### 9.3 Database Foundation

```sql
workflow_definitions (id, name, type, steps_config)
workflow_instances (id, definition_id, entity_type, entity_id, status)
workflow_approvals (id, instance_id, step_number, approver_id, status)
```

---

## 10. NOTIFICATION ENGINE (Foundation)

### 10.1 Notification Channels

Phase 1:
- In-app notifications
- Email (event hooks ready)

Future:
- SMS
- Slack/Teams integration
- Push notifications

### 10.2 Event Types

- Candidate application status change
- Interview scheduled
- Leave request approval/rejection
- Policy assignment
- Document verification
- Employee onboarding

### 10.3 Notification Flow

```
Business Event → Notification Service → Template Rendering → Channel Dispatch
```

---

## 11. FILE/DOCUMENT MANAGEMENT

### 11.1 Architecture

- **Storage**: Supabase Storage buckets
- **Metadata**: Postgres documents table
- **Access Control**: Backend-enforced via signed URLs

### 11.2 Document Types

- Candidate: resume, cover letter
- Employee: ID proof, education certificates, bank proof
- Policy: policy documents, attachments
- Offer: offer letters
- System: logos, templates

### 11.3 Upload Flow

1. Frontend requests upload URL from backend
2. Backend validates permission & generates Supabase signed upload URL
3. Frontend uploads to Supabase Storage directly
4. Frontend notifies backend of upload completion
5. Backend creates document metadata record

---

## 12. CANDIDATE-TO-EMPLOYEE CONVERSION

Critical business process for transitioning candidates to employees.

### 12.1 Conversion Flow

1. Recruiter/HR marks candidate as "selected" & "offered"
2. Candidate accepts offer
3. HR initiates conversion action
4. Backend transaction:
   - Create employee master record
   - Copy candidate profile data
   - Map documents (change ownership)
   - Link candidate_id → employee_id
   - Update candidate status
   - Log audit trail
   - Send notifications
5. New employee gets ESS access

### 12.2 Data Mapping

```
Candidate → Employee
- full_name → full_name
- email → work_email
- phone → phone
- address → current_address
- education → employee_education
- skills → employee_skills
- bank_details → employee_bank_details
- documents → remap to employee ownership
```

---

## 13. FUTURE MODULE READINESS

The architecture supports future modules without major refactoring:

### 13.1 Planned Modules (Phase 2+)

- Asset Management
- Payroll / Finance
- Performance Management (OKR/KPI tracking)
- Offboarding & Exit Management
- Advanced Workflow Builder (visual)
- Business Development Management System (BDMS)
- Advanced Analytics & Reporting
- AI Assistant Layer

### 13.2 Extensibility Mechanisms

- Shared platform core services
- Pluggable module architecture
- Extensible document system
- Generic workflow engine
- Event-driven inter-module communication (future)

---

## 14. DEPLOYMENT ARCHITECTURE

### 14.1 Environment Strategy

- **Development**: Local dev setup with local Supabase or dev project
- **Staging**: Staging Supabase project
- **Production**: Production Supabase project

### 14.2 Configuration Management

Environment variables:
```
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
JWT_SECRET
FRONTEND_URL
BACKEND_URL
```

### 14.3 Deployment Options

- **Frontend**: Vercel / Netlify / Cloudflare Pages
- **Backend**: Railway / Render / DigitalOcean / AWS EC2
- **Database**: Supabase (managed Postgres)

---

## 15. DEVELOPMENT GUIDELINES

### 15.1 Code Organization

- Feature-based folder structure
- Separation of concerns (routes/controllers/services/repositories)
- Reusable components and utilities
- Consistent naming conventions

### 15.2 Best Practices

- No business logic in frontend
- All data access through backend APIs
- Validate input at both frontend and backend
- Log all state-changing operations
- Use transactions for multi-step operations
- Handle errors gracefully
- Write meaningful commit messages

### 15.3 Testing Strategy (Future)

- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Load testing for scalability validation

---

## 16. SUCCESS METRICS

### 16.1 Technical Metrics

- API response time < 200ms (p95)
- Page load time < 2s
- Zero data loss
- 99.9% uptime
- Successful multi-org isolation

### 16.2 Business Metrics

- Time to hire (candidate to employee)
- Application completion rate
- Leave approval turnaround
- Policy acknowledgment compliance
- User adoption rate

---

## APPENDIX A: GLOSSARY

- **CMP**: Candidate Management Portal
- **ATS**: Applicant Tracking System
- **ESS**: Employee Self-Service
- **HRMS**: Human Resource Management System
- **RBAC**: Role-Based Access Control
- **EWOS**: Enterprise Workforce Operating System

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-08  
**Status**: Phase 1 Foundation  

