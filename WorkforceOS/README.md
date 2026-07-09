# WorkforceOS - Enterprise Workforce Operating System

A production-grade, modular Enterprise Workforce Management Platform designed as a scalable Workforce Operating System.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Backend](https://img.shields.io/badge/Backend-Foundation%20Complete-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Not%20Started-red)
![Database](https://img.shields.io/badge/Database-Schema%20Complete-brightgreen)

---

## 📋 Overview

WorkforceOS is a comprehensive enterprise platform combining:

- **Candidate Management Portal (CMP/ATS)** - Full recruitment lifecycle
- **Career Portal** - Public-facing job listings
- **Employee Self-Service (ESS)** - Employee dashboard and profile management
- **Core HRMS** - Employee master data and lifecycle management
- **Leave Management** - Leave requests, approvals, balance tracking
- **Document Management** - Centralized document storage and verification
- **Policy Management** - Policy distribution and acknowledgment tracking
- **Reporting & Analytics** - Dashboard and insights
- **Dynamic RBAC** - Role-based access control
- **Audit Engine** - Comprehensive activity logging
- **Notification Engine** - Multi-channel notifications
- **Workflow Engine** - Approval workflows (foundation)

---

## 🏗️ Architecture

### Technology Stack

**Frontend** (Planned):
- React 18+ with Vite
- Tailwind CSS
- React Router v6
- Zustand (state management)
- TanStack Query (server state)
- React Hook Form + Zod
- Axios
- Lucide React (icons)

**Backend** (Implemented):
- Node.js 18+
- Express.js
- PostgreSQL (via Supabase)
- Supabase Storage
- JWT Authentication
- bcrypt
- Winston (logging)
- Joi (validation)

**Infrastructure**:
- Supabase (Database + Storage + Auth support)
- RESTful API architecture
- Layered backend architecture

### System Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  Candidate | Employee | Admin Portals   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         APPLICATION LAYER                │
│  ┌────────────────────────────────────┐ │
│  │      PLATFORM CORE                 │ │
│  │  Org | RBAC | Workflow | Audit    │ │
│  └────────────────────────────────────┘ │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Cand. │ │Emp.  │ │Leave │ │Policy│  │
│  │Module│ │Module│ │Module│ │Module│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           DATA LAYER                     │
│  Supabase Postgres | Supabase Storage   │
└──────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- PostgreSQL (via Supabase)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WorkforceOS
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Initialize Database**

Execute SQL files in Supabase SQL Editor (in order):
```
database/schema/001_core_tables.sql
database/schema/002_candidate_tables.sql
database/schema/003_employee_tables.sql
database/schema/004_leave_tables.sql
database/schema/005_policy_tables.sql
```

4. **Start Backend Server**
```bash
npm run dev
```

Server runs at `http://localhost:5000`

5. **Test API**
```bash
curl http://localhost:5000/health
```

---

## 📁 Project Structure

```
WorkforceOS/
├── ARCHITECTURE.md              # System architecture
├── DATABASE_SCHEMA.md           # Complete DB schema
├── API_DESIGN.md                # API specification
├── IMPLEMENTATION_GUIDE.md      # Step-by-step guide
├── BUILD_STATUS.md              # Progress tracker
├── README.md                    # This file
│
├── backend/                     # Backend API ✅
│   ├── src/
│   │   ├── config/             # Configuration
│   │   ├── middleware/         # Express middleware
│   │   ├── modules/            # Feature modules
│   │   │   └── auth/          # Auth module (complete)
│   │   ├── utils/              # Utilities
│   │   ├── app.js             # Express setup
│   │   └── server.js          # Server entry
│   ├── package.json
│   └── README.md
│
├── database/                    # Database schemas ✅
│   └── schema/
│       ├── 001_core_tables.sql
│       ├── 002_candidate_tables.sql
│       ├── 003_employee_tables.sql
│       ├── 004_leave_tables.sql
│       └── 005_policy_tables.sql
│
└── frontend/                    # Frontend app ⏳
    └── (to be implemented)
```

---

## ✅ What's Complete

### Backend Infrastructure (100%)
- ✅ Express.js server with middleware
- ✅ JWT authentication with refresh tokens
- ✅ Dynamic RBAC with permission caching
- ✅ File upload system (Supabase Storage)
- ✅ Comprehensive error handling
- ✅ Request logging & audit trails
- ✅ Rate limiting
- ✅ Input validation
- ✅ Database connection pooling
- ✅ Graceful shutdown

### Authentication Module (100%)
- ✅ Candidate registration
- ✅ Login/logout
- ✅ Password reset
- ✅ Token refresh
- ✅ Change password
- ✅ User profile management

### Database Schema (100%)
- ✅ Identity & Access Control tables
- ✅ Organization & RBAC tables
- ✅ Candidate management tables
- ✅ Employee management tables
- ✅ Leave management tables
- ✅ Policy management tables
- ✅ Document management tables
- ✅ Audit & notification tables
- ✅ Workflow engine foundation

### Documentation (100%)
- ✅ Complete architecture document
- ✅ API specification
- ✅ Database schema documentation
- ✅ Implementation guide
- ✅ Project structure guide

---

## 🚧 In Progress / Planned

### Backend Modules
- ⏳ Candidate profile management
- ⏳ Job management & applications
- ⏳ Employee management
- ⏳ Leave management
- ⏳ Policy management
- ⏳ Document service
- ⏳ Notification service
- ⏳ Organization settings
- ⏳ Reporting & analytics

### Frontend Application
- ⏳ Project setup
- ⏳ Shared components library
- ⏳ Candidate portal
- ⏳ Employee portal (ESS)
- ⏳ Admin portal
- ⏳ Responsive design
- ⏳ Authentication flows

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & design |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Complete database schema |
| [API_DESIGN.md](./API_DESIGN.md) | REST API specification |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Step-by-step implementation guide |
| [BUILD_STATUS.md](./BUILD_STATUS.md) | Current progress & status |
| [backend/README.md](./backend/README.md) | Backend setup & API docs |

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ bcrypt password hashing
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Permission-based access control
- ✅ Organization data isolation
- ✅ Audit logging

---

## 🧪 API Endpoints

### Authentication
```
POST   /api/v1/auth/register/candidate  Register candidate
POST   /api/v1/auth/login               Login
POST   /api/v1/auth/logout              Logout
GET    /api/v1/auth/me                  Get current user
POST   /api/v1/auth/forgot-password     Request password reset
POST   /api/v1/auth/reset-password      Reset password
POST   /api/v1/auth/refresh-token       Refresh JWT token
POST   /api/v1/auth/change-password     Change password
```

### Candidate Module (Planned)
```
GET    /api/v1/candidate/profile                   Get profile
PUT    /api/v1/candidate/profile/personal          Update personal info
PUT    /api/v1/candidate/profile/education         Update education
PUT    /api/v1/candidate/profile/additional        Update additional info
POST   /api/v1/candidate/profile/resume            Upload resume
GET    /api/v1/candidate/jobs                      Browse jobs
POST   /api/v1/candidate/jobs/:id/apply            Apply for job
GET    /api/v1/candidate/applications              Get applications
```

### Admin - Candidate Management (Planned)
```
GET    /api/v1/admin/candidates                    List candidates
GET    /api/v1/admin/candidates/:id                Get candidate
PATCH  /api/v1/admin/applications/:id/stage        Move stage
POST   /api/v1/admin/candidates/:id/convert        Convert to employee
```

See [API_DESIGN.md](./API_DESIGN.md) for complete API specification.

---

## 🎯 Key Features

### Multi-tenancy
- Organization-scoped data
- Complete data isolation
- Support for multiple companies

### Dynamic RBAC
- Configurable roles and permissions
- No hardcoded role checks
- Permission caching for performance

### Modular Architecture
- Feature-based modules
- Clear separation of concerns
- Easy to extend

### Audit Trail
- Complete activity logging
- Track all state changes
- User action history

### Document Management
- Centralized storage
- Verification workflow
- Version control

### Workflow Engine
- Approval workflows
- Multi-step processes
- Configurable rules (foundation)

---

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev
```

### Adding a New Module

Follow the pattern in [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md):

1. Create module folder structure
2. Implement routes, controller, service, repository
3. Add validators
4. Register routes in app.js
5. Test endpoints

### Running Tests (when implemented)

```bash
npm test
```

---

## 📊 Database

### Tables Summary

| Category | Tables |
|----------|--------|
| **Identity** | users, user_profiles, roles, permissions, user_roles, role_permissions |
| **Organization** | organizations, departments, designations, locations |
| **Candidates** | candidates, candidate_profiles, candidate_education, candidate_skills, candidate_employment_history, candidate_bank_details |
| **Jobs** | jobs, job_applications, application_stage_history, candidate_notes |
| **Employees** | employees, employee_profiles, employee_education, employee_skills, employee_bank_details |
| **Leave** | leave_types, leave_balances, leave_requests, leave_approvals, holidays |
| **Policy** | policies, policy_assignments, policy_acknowledgments |
| **Workflow** | workflow_definitions, workflow_instances, workflow_approvals |
| **System** | documents, audit_logs, notifications, notification_preferences |

### Total Tables: 37

---

## 🚀 Deployment

### Backend Deployment

**Recommended Platforms:**
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2/ECS

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=<production_db>
SUPABASE_URL=<supabase_url>
SUPABASE_SERVICE_KEY=<service_key>
JWT_SECRET=<strong_secret>
FRONTEND_URL=<frontend_domain>
```

### Frontend Deployment (Planned)

**Recommended Platforms:**
- Vercel
- Netlify
- Cloudflare Pages

---

## 📈 Roadmap

### Phase 1: Backend Core (Current)
- [x] Authentication
- [ ] Candidate management
- [ ] Employee management  
- [ ] Leave management
- [ ] Policy management
- [ ] Core services

### Phase 2: Frontend Foundation
- [ ] Project setup
- [ ] Component library
- [ ] Authentication UI
- [ ] Candidate portal
- [ ] Employee portal
- [ ] Admin portal

### Phase 3: Advanced Features
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Workflow builder UI
- [ ] AI assistant integration
- [ ] Mobile app

### Phase 4: Extended Modules
- [ ] Payroll integration
- [ ] Performance management
- [ ] Asset management
- [ ] Offboarding
- [ ] Business development module

---

## 🤝 Contributing

1. Follow the established module pattern
2. Write tests for new features
3. Update API documentation
4. Follow code style guidelines
5. Create meaningful commit messages

---

## 📄 License

MIT License

---

## 👥 Team

- Product Architect
- Senior Full-Stack Engineer
- Enterprise SaaS System Designer

---

## 📞 Support

For questions or issues:
- Check documentation in `/docs`
- Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Check [BUILD_STATUS.md](./BUILD_STATUS.md) for current progress

---

## 🎉 Achievements

- ✅ Production-ready backend infrastructure
- ✅ Complete authentication system
- ✅ Comprehensive database schema
- ✅ Security best practices implemented
- ✅ Detailed documentation
- ✅ Scalable architecture
- ✅ Multi-tenancy support
- ✅ Dynamic RBAC system

---

**Version**: 1.0.0  
**Status**: Backend Foundation Complete, Ready for Module Implementation  
**Last Updated**: 2026-07-08

---

## 🚀 Next Steps

1. **Implement Candidate Management Module**
   - Profile management CRUD
   - Job browsing & application
   - Admin candidate management
   - Candidate-to-employee conversion

2. **Implement Employee Management Module**
   - Employee CRUD operations
   - Profile management
   - Status lifecycle

3. **Implement Leave Management Module**
   - Leave request flow
   - Approval workflow
   - Balance calculation

4. **Start Frontend Development**
   - Project setup
   - Component library
   - Candidate portal UI

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed next steps.

---

**Built with ❤️ for Enterprise Workforce Management**
