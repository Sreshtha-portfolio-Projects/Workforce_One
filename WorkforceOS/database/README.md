# Supabase setup for WorkforceOS

WorkforceOS uses **Supabase only** for data and files. You do **not** need:

- Local PostgreSQL
- `DATABASE_URL`
- `SUPABASE_DB_PASSWORD`
- `pg` driver

## Backend configuration

Set these in `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_STORAGE_BUCKET=workforceos-documents
```

Get keys from: **Supabase Dashboard → Project Settings → API**

The backend uses `SUPABASE_SERVICE_KEY` (service role) so all business logic runs server-side with full access. The frontend never talks to Supabase tables directly.

## Create tables

Run SQL files in **Supabase → SQL Editor** (in order):

1. `schema/001_core_tables.sql`
2. `schema/002_candidate_tables.sql`
3. `schema/003_employee_tables.sql`
4. `schema/004_leave_tables.sql`
5. `schema/005_policy_tables.sql`

## How data access works

```
Frontend → Node/Express API → @supabase/supabase-js (service role) → Supabase Postgres
```

Storage uploads use the same Supabase project (`SUPABASE_STORAGE_BUCKET`).

## Optional: Row Level Security

With the **service role** key, RLS is bypassed on the backend. You can add RLS policies later for direct client access; Phase 1 keeps all reads/writes through the API.
