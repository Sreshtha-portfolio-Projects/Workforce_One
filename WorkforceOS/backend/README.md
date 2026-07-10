# WorkforceOS Backend

Enterprise Workforce Operating System - Backend API Server

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **Authentication**: JWT
- **Language**: JavaScript (ES Modules)

## Project Structure

```
src/
├── config/           # Configuration files
├── middleware/       # Express middleware
├── modules/          # Feature modules
├── utils/            # Utility functions
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Update the following in `.env`:

- `SUPABASE_URL` — Supabase project URL (Dashboard → Settings → API)
- `SUPABASE_SERVICE_KEY` — Service role key (backend database + storage)
- `SUPABASE_ANON_KEY` — Anon key (optional for backend; used by frontend)
- `JWT_SECRET` — Strong secret for JWT signing
- `FRONTEND_URL` — Your frontend URL for CORS

**No `DATABASE_URL` or local PostgreSQL required.**

### 3. Database Setup

Run the SQL schema files in your Supabase SQL editor or PostgreSQL client:

```bash
# Execute in order:
database/schema/001_core_tables.sql
database/schema/002_candidate_tables.sql
database/schema/003_employee_tables.sql
database/schema/004_leave_tables.sql
database/schema/005_policy_tables.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Test API

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## API Documentation

Base URL: `http://localhost:5000/api/v1`

### Authentication Endpoints

- `POST /api/v1/auth/register/candidate` - Register candidate
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

See `API_DESIGN.md` for complete API documentation.

## Module Architecture

Each module follows this structure:

```
module/
├── {module}.routes.js      # Route definitions
├── {module}.controller.js  # Request/response handling
├── {module}.service.js     # Business logic
├── {module}.repository.js  # Database operations
└── {module}.validator.js   # Input validation
```

## Core Modules

### Implemented
- ✅ Authentication
- 🚧 Candidate Management (in progress)
- 🚧 Employee Management (in progress)
- 🚧 Leave Management (in progress)
- 🚧 Policy Management (in progress)

### Planned
- Organization Management
- RBAC & Permissions
- Document Management
- Notifications
- Audit Logging
- Workflow Engine

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | - |
| `SUPABASE_ANON_KEY` | Supabase anon key | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size | 5242880 (5MB) |

## Security Features

- Helmet.js for secure HTTP headers
- CORS configuration
- Rate limiting on auth endpoints
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- SQL injection prevention with parameterized queries

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

## Logging

Winston logger with:
- Console transport (colored, formatted)
- File transport (error.log, combined.log)
- Request logging with Morgan

## Database access

All data operations use the Supabase JavaScript client with the service role key (`src/config/db.js` + `src/config/supabase.js`). There is no direct PostgreSQL connection.

For multi-step operations (e.g. candidate registration), the service layer uses sequential writes with rollback on failure.

## Development Guidelines

1. Follow the module structure for new features
2. Always validate input with Joi schemas
3. Use async/await with try-catch or asyncHandler
4. Log important operations
5. Write meaningful error messages
6. Use constants from `config/constants.js`
7. Implement RBAC checks for protected routes

## Testing

Run tests (when implemented):
```bash
npm test
```

## Deployment

Production deployment checklist:
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Configure proper logging
- [ ] Set up monitoring
- [ ] Configure rate limiting

## Support

For issues or questions, contact the WorkforceOS team.

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-08
