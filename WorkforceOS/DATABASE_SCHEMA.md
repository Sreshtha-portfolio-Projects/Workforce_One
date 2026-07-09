# WorkforceOS - Database Schema Design
## Phase 1 Complete Schema

---

## Overview

This schema supports:
- Multi-tenancy (organization-scoped data)
- Dynamic RBAC
- Candidate management & ATS
- Employee management
- Leave management
- Policy management
- Document management
- Audit trail
- Notifications

All tables use UUIDs for primary keys for better distributed system support.

---

## 1. CORE TABLES - Identity & Access

### 1.1 users
Core user accounts (used for candidate login, employee login, admin login)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('candidate', 'employee', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
```

### 1.2 user_profiles
Extended profile info for all users

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    profile_picture_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
```

### 1.3 roles
Role definitions

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, organization_id)
);

CREATE INDEX idx_roles_org ON roles(organization_id);
```

### 1.4 permissions
Permission definitions (resource.action format)

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permissions_resource ON permissions(resource);
```

### 1.5 role_permissions
Many-to-many: roles and permissions

```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
```

### 1.6 user_roles
Many-to-many: users and roles

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id, organization_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id);
```

---

## 2. CORE TABLES - Organization

### 2.1 organizations
Companies/tenants in the system

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_name ON organizations(name);
```

### 2.2 departments
Organizational departments

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    parent_department_id UUID REFERENCES departments(id),
    head_employee_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_departments_parent ON departments(parent_department_id);
```

### 2.3 designations
Job titles/positions

```sql
CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    level INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE INDEX idx_designations_org ON designations(organization_id);
```

### 2.4 locations
Office locations

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    is_headquarters BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE INDEX idx_locations_org ON locations(organization_id);
```

---

## 3. CANDIDATE MANAGEMENT

### 3.1 candidates
Candidate master records

```sql
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    candidate_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'applied', 'screening', 'interviewing', 
        'selected', 'offered', 'onboarded', 'rejected', 'withdrawn'
    )),
    source VARCHAR(50),
    referred_by VARCHAR(255),
    is_profile_complete BOOLEAN DEFAULT FALSE,
    profile_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_candidates_user ON candidates(user_id);
CREATE INDEX idx_candidates_org ON candidates(organization_id);
CREATE INDEX idx_candidates_status ON candidates(status);
```

### 3.2 candidate_profiles
Detailed candidate profile information

```sql
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    
    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    marital_status VARCHAR(20),
    religion VARCHAR(50),
    marriage_anniversary DATE,
    
    -- Address
    current_address_line1 VARCHAR(255),
    current_address_line2 VARCHAR(255),
    current_city VARCHAR(100),
    current_state VARCHAR(100),
    current_country VARCHAR(100),
    current_postal_code VARCHAR(20),
    
    permanent_address_line1 VARCHAR(255),
    permanent_address_line2 VARCHAR(255),
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    permanent_country VARCHAR(100),
    permanent_postal_code VARCHAR(20),
    
    -- Professional Info
    current_ctc DECIMAL(12,2),
    expected_ctc DECIMAL(12,2),
    notice_period_days INTEGER,
    available_from DATE,
    preferred_locations TEXT[],
    employment_type_preference VARCHAR(50),
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    willing_to_travel BOOLEAN DEFAULT FALSE,
    
    -- Additional Info
    additional_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id)
);

CREATE INDEX idx_candidate_profiles_candidate ON candidate_profiles(candidate_id);
```

### 3.3 candidate_education
Educational qualifications

```sql
CREATE TABLE candidate_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    qualification VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    board_or_university VARCHAR(255),
    specialization VARCHAR(255),
    year_of_passing INTEGER,
    percentage_or_cgpa VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidate_education_candidate ON candidate_education(candidate_id);
```

### 3.4 candidate_skills
Skills tagged by candidate

```sql
CREATE TABLE candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience DECIMAL(4,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidate_skills_candidate ON candidate_skills(candidate_id);
```

### 3.5 candidate_employment_history
Previous employment records

```sql
CREATE TABLE candidate_employment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50),
    from_date DATE NOT NULL,
    to_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    reason_for_leaving TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidate_employment_candidate ON candidate_employment_history(candidate_id);
```

### 3.6 candidate_bank_details
Bank information for offer/payroll

```sql
CREATE TABLE candidate_bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    branch_name VARCHAR(255),
    account_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id)
);

CREATE INDEX idx_candidate_bank_candidate ON candidate_bank_details(candidate_id);
```

### 3.7 jobs
Job postings

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    location_id UUID REFERENCES locations(id),
    employment_type VARCHAR(50) NOT NULL,
    experience_min INTEGER,
    experience_max INTEGER,
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'INR',
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,
    skills_required TEXT[],
    vacancies INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'published', 'closed', 'on_hold', 'cancelled'
    )),
    published_at TIMESTAMPTZ,
    closes_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_org ON jobs(organization_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_published_at ON jobs(published_at);
```

### 3.8 job_applications
Candidate applications to jobs

```sql
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    application_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN (
        'applied', 'screening', 'shortlisted', 'round_1', 'round_2', 
        'round_3', 'final_round', 'selected', 'offered', 'offer_accepted', 
        'offer_rejected', 'onboarded', 'rejected', 'withdrawn'
    )),
    cover_letter TEXT,
    source VARCHAR(50),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    screening_notes TEXT,
    rejection_reason TEXT,
    rejected_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_candidate ON job_applications(candidate_id);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_applications_org ON job_applications(organization_id);
```

### 3.9 application_stage_history
Track stage progression

```sql
CREATE TABLE application_stage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stage_history_application ON application_stage_history(application_id);
```

### 3.10 candidate_notes
Internal notes about candidates

```sql
CREATE TABLE candidate_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    application_id UUID REFERENCES job_applications(id),
    note_text TEXT NOT NULL,
    note_type VARCHAR(50),
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidate_notes_candidate ON candidate_notes(candidate_id);
CREATE INDEX idx_candidate_notes_application ON candidate_notes(application_id);
```

---

## 4. EMPLOYEE MANAGEMENT

### 4.1 employees
Employee master records

```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id),
    
    employee_code VARCHAR(50) NOT NULL,
    
    -- Work Info
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    location_id UUID REFERENCES locations(id),
    manager_id UUID REFERENCES employees(id),
    
    work_email VARCHAR(255) NOT NULL,
    work_phone VARCHAR(20),
    
    -- Employment
    employment_type VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    confirmation_date DATE,
    resignation_date DATE,
    last_working_date DATE,
    
    status VARCHAR(50) DEFAULT 'probation' CHECK (status IN (
        'probation', 'confirmed', 'notice_period', 'resigned', 
        'terminated', 'retired', 'deceased', 'inactive'
    )),
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organization_id, employee_code),
    UNIQUE(user_id)
);

CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_org ON employees(organization_id);
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);
```

### 4.2 employee_profiles
Extended employee profile info

```sql
CREATE TABLE employee_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    marital_status VARCHAR(20),
    marriage_anniversary DATE,
    
    -- Address
    current_address_line1 VARCHAR(255),
    current_address_line2 VARCHAR(255),
    current_city VARCHAR(100),
    current_state VARCHAR(100),
    current_country VARCHAR(100),
    current_postal_code VARCHAR(20),
    
    permanent_address_line1 VARCHAR(255),
    permanent_address_line2 VARCHAR(255),
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    permanent_country VARCHAR(100),
    permanent_postal_code VARCHAR(20),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_relationship VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    
    -- IDs
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    passport_number VARCHAR(20),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id)
);

CREATE INDEX idx_employee_profiles_employee ON employee_profiles(employee_id);
```

### 4.3 employee_education
Educational records for employees

```sql
CREATE TABLE employee_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    qualification VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    board_or_university VARCHAR(255),
    specialization VARCHAR(255),
    year_of_passing INTEGER,
    percentage_or_cgpa VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_education_employee ON employee_education(employee_id);
```

### 4.4 employee_skills
Skills for employees

```sql
CREATE TABLE employee_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience DECIMAL(4,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_skills_employee ON employee_skills(employee_id);
```

### 4.5 employee_bank_details
Bank info for payroll

```sql
CREATE TABLE employee_bank_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    branch_name VARCHAR(255),
    account_type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id)
);

CREATE INDEX idx_employee_bank_employee ON employee_bank_details(employee_id);
```

---

## 5. DOCUMENT MANAGEMENT

### 5.1 documents
Centralized document metadata (polymorphic ownership)

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    
    -- Polymorphic ownership
    owner_type VARCHAR(50) NOT NULL CHECK (owner_type IN (
        'candidate', 'employee', 'policy', 'job', 'organization', 'system'
    )),
    owner_id UUID NOT NULL,
    
    document_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Verification
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN (
        'pending', 'verified', 'rejected', 'expired'
    )),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    
    -- Version control
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_owner ON documents(owner_type, owner_id);
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(verification_status);
```

---

## 6. LEAVE MANAGEMENT

### 6.1 leave_types
Leave type definitions

```sql
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    default_days_per_year DECIMAL(5,2),
    max_consecutive_days INTEGER,
    is_paid BOOLEAN DEFAULT TRUE,
    is_carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward_days DECIMAL(5,2),
    requires_documentation BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE INDEX idx_leave_types_org ON leave_types(organization_id);
```

### 6.2 leave_balances
Employee leave balance tracking

```sql
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    
    opening_balance DECIMAL(5,2) DEFAULT 0,
    accrued DECIMAL(5,2) DEFAULT 0,
    used DECIMAL(5,2) DEFAULT 0,
    pending DECIMAL(5,2) DEFAULT 0,
    available DECIMAL(5,2) DEFAULT 0,
    carried_forward DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(employee_id, leave_type_id, year)
);

CREATE INDEX idx_leave_balances_employee ON leave_balances(employee_id);
CREATE INDEX idx_leave_balances_org ON leave_balances(organization_id);
```

### 6.3 leave_requests
Leave applications

```sql
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    
    request_code VARCHAR(50),
    
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    
    reason TEXT NOT NULL,
    contact_during_leave VARCHAR(100),
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'draft', 'pending', 'approved', 'rejected', 'cancelled', 'withdrawn'
    )),
    
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_org ON leave_requests(organization_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(from_date, to_date);
```

### 6.4 leave_approvals
Approval workflow for leave requests

```sql
CREATE TABLE leave_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    approver_role VARCHAR(50),
    step_number INTEGER NOT NULL,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'delegated'
    )),
    
    comments TEXT,
    actioned_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_approvals_request ON leave_approvals(leave_request_id);
CREATE INDEX idx_leave_approvals_approver ON leave_approvals(approver_id);
CREATE INDEX idx_leave_approvals_status ON leave_approvals(status);
```

### 6.5 holidays
Holiday calendar

```sql
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id),
    
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_restricted BOOLEAN DEFAULT FALSE,
    description TEXT,
    
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_holidays_org ON holidays(organization_id);
CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_holidays_location ON holidays(location_id);
```

---

## 7. POLICY MANAGEMENT

### 7.1 policies
Policy documents and versioning

```sql
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    policy_type VARCHAR(100),
    
    version INTEGER DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'published', 'archived', 'expired'
    )),
    
    effective_from DATE,
    effective_to DATE,
    
    requires_acknowledgment BOOLEAN DEFAULT TRUE,
    acknowledgment_required_within_days INTEGER,
    
    document_id UUID REFERENCES documents(id),
    
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    published_by UUID REFERENCES users(id),
    published_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_policies_org ON policies(organization_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_version ON policies(is_current_version);
```

### 7.2 policy_assignments
Assign policies to users/groups

```sql
CREATE TABLE policy_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    
    assignment_type VARCHAR(50) NOT NULL CHECK (assignment_type IN (
        'all_employees', 'department', 'designation', 'location', 'individual'
    )),
    
    target_id UUID,
    
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_policy_assignments_policy ON policy_assignments(policy_id);
CREATE INDEX idx_policy_assignments_org ON policy_assignments(organization_id);
CREATE INDEX idx_policy_assignments_target ON policy_assignments(assignment_type, target_id);
```

### 7.3 policy_acknowledgments
Track employee acknowledgments

```sql
CREATE TABLE policy_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    
    ip_address INET,
    user_agent TEXT,
    
    comments TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(policy_id, employee_id)
);

CREATE INDEX idx_policy_acks_policy ON policy_acknowledgments(policy_id);
CREATE INDEX idx_policy_acks_employee ON policy_acknowledgments(employee_id);
CREATE INDEX idx_policy_acks_status ON policy_acknowledgments(acknowledged);
```

---

## 8. WORKFLOW ENGINE (Foundation)

### 8.1 workflow_definitions
Reusable workflow templates

```sql
CREATE TABLE workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(100) NOT NULL,
    description TEXT,
    steps_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_defs_org ON workflow_definitions(organization_id);
CREATE INDEX idx_workflow_defs_type ON workflow_definitions(workflow_type);
```

### 8.2 workflow_instances
Active workflow executions

```sql
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_definition_id UUID REFERENCES workflow_definitions(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN (
        'in_progress', 'completed', 'rejected', 'cancelled'
    )),
    
    current_step INTEGER DEFAULT 1,
    
    started_by UUID REFERENCES users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_workflow_instances_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX idx_workflow_instances_org ON workflow_instances(organization_id);
CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
```

### 8.3 workflow_approvals
Individual approval actions

```sql
CREATE TABLE workflow_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES users(id),
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'delegated', 'skipped'
    )),
    
    comments TEXT,
    actioned_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_approvals_instance ON workflow_approvals(workflow_instance_id);
CREATE INDEX idx_workflow_approvals_approver ON workflow_approvals(approver_id);
CREATE INDEX idx_workflow_approvals_status ON workflow_approvals(status);
```

---

## 9. NOTIFICATIONS

### 9.1 notifications
User notifications (in-app)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    notification_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    entity_type VARCHAR(100),
    entity_id UUID,
    
    action_url TEXT,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

### 9.2 notification_preferences
User notification preferences

```sql
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    
    preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);
```

---

## 10. AUDIT & SYSTEM

### 10.1 audit_logs
Comprehensive audit trail

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    
    user_id UUID REFERENCES users(id),
    user_type VARCHAR(50),
    
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    
    action VARCHAR(100) NOT NULL,
    
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

## INITIALIZATION SCRIPTS

### Seed Data for System Roles

```sql
-- Insert system roles
INSERT INTO roles (name, display_name, description, is_system_role) VALUES
('super_admin', 'Super Admin', 'Full system access', TRUE),
('admin', 'Admin', 'Organization administrator', TRUE),
('hr', 'HR', 'HR personnel', TRUE),
('recruiter', 'Recruiter', 'Recruitment specialist', TRUE),
('hiring_manager', 'Hiring Manager', 'Department hiring authority', TRUE),
('manager', 'Manager', 'Team manager', TRUE),
('employee', 'Employee', 'Regular employee', TRUE);
```

### Seed Data for Core Permissions

```sql
-- Dashboard
INSERT INTO permissions (name, resource, action, description) VALUES
('dashboard.view', 'dashboard', 'view', 'View dashboard'),

-- Employees
('employees.view', 'employees', 'view', 'View employees'),
('employees.create', 'employees', 'create', 'Create employees'),
('employees.edit', 'employees', 'edit', 'Edit employees'),
('employees.delete', 'employees', 'delete', 'Delete employees'),
('employees.export', 'employees', 'export', 'Export employee data'),

-- Candidates
('candidates.view', 'candidates', 'view', 'View candidates'),
('candidates.create', 'candidates', 'create', 'Create candidates'),
('candidates.edit', 'candidates', 'edit', 'Edit candidates'),
('candidates.delete', 'candidates', 'delete', 'Delete candidates'),
('candidates.move_stage', 'candidates', 'move_stage', 'Move candidate stage'),
('candidates.convert', 'candidates', 'convert', 'Convert candidate to employee'),

-- Jobs
('jobs.view', 'jobs', 'view', 'View jobs'),
('jobs.create', 'jobs', 'create', 'Create jobs'),
('jobs.edit', 'jobs', 'edit', 'Edit jobs'),
('jobs.publish', 'jobs', 'publish', 'Publish jobs'),

-- Leave
('leave.view_own', 'leave', 'view_own', 'View own leave'),
('leave.apply', 'leave', 'apply', 'Apply for leave'),
('leave.view_all', 'leave', 'view_all', 'View all leave requests'),
('leave.approve', 'leave', 'approve', 'Approve leave'),
('leave.reject', 'leave', 'reject', 'Reject leave'),

-- Documents
('documents.view_own', 'documents', 'view_own', 'View own documents'),
('documents.upload', 'documents', 'upload', 'Upload documents'),
('documents.verify', 'documents', 'verify', 'Verify documents'),
('documents.view_all', 'documents', 'view_all', 'View all documents'),

-- Policies
('policies.view', 'policies', 'view', 'View policies'),
('policies.create', 'policies', 'create', 'Create policies'),
('policies.edit', 'policies', 'edit', 'Edit policies'),
('policies.publish', 'policies', 'publish', 'Publish policies'),
('policies.assign', 'policies', 'assign', 'Assign policies'),

-- Organization Settings
('settings.view', 'settings', 'view', 'View settings'),
('settings.edit', 'settings', 'edit', 'Edit settings'),
('roles.manage', 'roles', 'manage', 'Manage roles and permissions'),

-- Audit
('audit.view', 'audit', 'view', 'View audit logs');
```

---

## NOTES

### Multi-tenancy
- All business entities are scoped by `organization_id`
- All queries must filter by organization_id
- Backend enforces org isolation at service layer

### Soft Deletes
- Most entities should have `is_deleted` flag if soft deletes needed
- Can be added per table based on requirements

### Indexing Strategy
- Indexes added for foreign keys
- Indexes for commonly queried fields (status, dates, org_id)
- Composite indexes for common query patterns

### Future Extensibility
- JSONB fields for flexible metadata
- Polymorphic document ownership
- Generic workflow engine
- Can add new modules without schema rewrites

---

**Schema Version**: 1.0  
**Last Updated**: 2026-07-08  

