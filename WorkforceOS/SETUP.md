# WorkforceOS — Setup & Testing Guide

End-to-end guide to run **backend + frontend** and verify the app works.

**Stack note:** Use **Supabase only** for database and storage. No local PostgreSQL. No `DATABASE_URL`.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|--------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Supabase account | — | [supabase.com](https://supabase.com) |
| Browser | Chrome / Edge | — |

Optional: Postman or Thunder Client for API testing.

---

## 1. Supabase project

1. Create a project at [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (backend only — never expose in frontend)

3. (Optional) Create a Storage bucket named `workforceos-documents` under **Storage**.

---

## 2. Create database tables

In **Supabase → SQL Editor**, run these files **in order** (from the repo):

1. `database/schema/001_core_tables.sql`
2. `database/schema/002_candidate_tables.sql`
3. `database/schema/003_employee_tables.sql`
4. `database/schema/004_leave_tables.sql`
5. `database/schema/005_policy_tables.sql`

After running, confirm tables exist under **Table Editor** (e.g. `users`, `candidates`, `roles`).

Also run the auth upgrade migration:

6. `database/schema/006_auth_oauth_reset.sql`

This adds password-reset tokens and OAuth provider fields on `users`.

---

## 3. Backend setup

```powershell
cd E:\WorkforceOS\backend
npm install
copy .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=workforceos-documents

JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Start backend:

```powershell
npm run dev
```

Expected:

```text
✅ Supabase connection established
🚀 WorkforceOS Backend Server running on port 5000
```

### Backend smoke tests

```powershell
# Health
curl http://localhost:5000/health

# API index
curl http://localhost:5000/api/v1
```

Register a candidate:

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register/candidate `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"candidate@test.com\",\"password\":\"Test1234!\",\"fullName\":\"Test Candidate\",\"phone\":\"+919876543210\"}"
```

Login:

```powershell
curl -X POST http://localhost:5000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"candidate@test.com\",\"password\":\"Test1234!\"}"
```

Save the `token` from the response, then:

```powershell
curl http://localhost:5000/api/v1/auth/me `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Auth endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register/candidate` | No |
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/auth/me` | Bearer token |
| POST | `/api/v1/auth/logout` | Bearer token |
| POST | `/api/v1/auth/forgot-password` | No |
| POST | `/api/v1/auth/reset-password` | No |
| POST | `/api/v1/auth/refresh-token` | No |
| POST | `/api/v1/auth/change-password` | Bearer token |

---

## 4. Frontend setup

Open a **second** terminal:

```powershell
cd E:\WorkforceOS\frontend
npm install
copy .env.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> Frontend must **not** use the service role key. Business data goes through the Node API only.

Start frontend:

```powershell
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## 5. Run both together

| Service | Command | URL |
|---------|---------|-----|
| Backend | `cd backend` → `npm run dev` | http://localhost:5000 |
| Frontend | `cd frontend` → `npm run dev` | http://localhost:5173 |

Keep both terminals running while testing.

---

## 6. Frontend testing checklist

### Login page

1. Open http://localhost:5173 → should redirect to `/login`.
2. Confirm login UI loads (split layout, form, Google/LinkedIn buttons).
3. Click **Sign Up** → full register form.

### Register flow

1. Go to http://localhost:5173/register
2. Fill: Full Name, Email, Phone, Password, Confirm Password, accept terms
3. Submit → should create account and redirect to `/candidate`
4. Confirm user appears in Supabase **Table Editor → users**

### Email/password login

1. Logout from candidate portal
2. Login with the same email/password
3. Should land on `/candidate` without page refresh loops
4. Wrong password should show an error (no full-page refresh)

### Forgot / reset password

1. Go to `/forgot-password`
2. Enter registered email → success message
3. In development, a reset link/token is shown on screen
4. Open `/reset-password?token=...`, set a new password
5. Login with the new password

### Google / LinkedIn login

1. In Supabase Dashboard → **Authentication → Providers**:
   - Enable **Google**
   - Enable **LinkedIn (OIDC)**
2. Add redirect URL:
   - `http://localhost:5173/auth/callback`
3. On login/register page, click **Continue with Google** or **LinkedIn**
4. Complete provider consent → returns to `/auth/callback` → redirects to `/candidate`

> If a provider is not enabled, the UI shows a clear error instead of failing silently.

### Candidate portal navigation

Visit these routes (placeholders until pages are fully built):

| Route | Expected |
|-------|----------|
| `/candidate` | Dashboard placeholder |
| `/candidate/profile/wizard` | Profile wizard placeholder |
| `/candidate/jobs` | Browse jobs placeholder |
| `/candidate/applications` | Applications placeholder |
| `/candidate/documents` | Documents placeholder |

### Logout

Use Logout in the candidate sidebar → should return to `/login`.
---

## 7. Common issues

| Problem | Fix |
|---------|-----|
| `Supabase tables are missing` | Run SQL files 001–005 in Supabase SQL Editor |
| `Missing Supabase configuration` | Set `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` in `backend/.env` |
| Backend port in use | Change `PORT` in `.env` or stop the other process |
| Frontend can’t reach API | Backend must be running; check `VITE_API_URL` |
| CORS error | Ensure `ALLOWED_ORIGINS` includes `http://localhost:5173` |
| Login fails after register | Confirm user exists in Supabase **Table Editor → users** |
| `Route /api/v1 not found` | Use `/api/v1/auth/login` or `/health`, not bare `/api` |

---

## 8. Quick verification script

With backend running:

```powershell
# 1) Health
curl http://localhost:5000/health

# 2) Register
curl -X POST http://localhost:5000/api/v1/auth/register/candidate `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"demo$(Get-Random)@test.com\",\"password\":\"Test1234!\",\"fullName\":\"Demo User\",\"phone\":\"+919999999999\"}"

# 3) Open UI
start http://localhost:5173/login
```

---

## 9. Project layout (what you use daily)

```text
WorkforceOS/
├── SETUP.md                 ← this file
├── backend/                 ← API (port 5000)
│   ├── .env                 ← your secrets (not committed)
│   └── src/
├── frontend/                ← React app (port 5173)
│   ├── .env.local
│   └── src/
└── database/schema/         ← run in Supabase SQL Editor
```

---

## 10. What’s ready vs next

| Area | Status |
|------|--------|
| Backend auth APIs | Ready to test |
| Supabase-only data access | Ready |
| Frontend login page | Ready to test |
| Candidate layout + routes | Ready (many pages are placeholders) |
| Profile wizard / jobs / admin UI | Next to build |
| Candidate/employee/leave APIs | Next to build |

---

**Done when:** backend shows Supabase connected, `/health` returns success, frontend login page opens, and you can register + login via API (and login via UI once a user exists).
