-- WorkforceOS Database Schema
-- Part 2: Candidate Management Tables

-- =============================================================================
-- CANDIDATE MANAGEMENT TABLES
-- =============================================================================

-- 2.1 Candidates (Master Table)
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
CREATE INDEX idx_candidates_code ON candidates(candidate_code);
CREATE INDEX idx_candidates_complete ON candidates(is_profile_complete);

-- 2.2 Candidate Profiles (Extended Information)
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
    
    -- Current Address
    current_address_line1 VARCHAR(255),
    current_address_line2 VARCHAR(255),
    current_city VARCHAR(100),
    current_state VARCHAR(100),
    current_country VARCHAR(100),
    current_postal_code VARCHAR(20),
    
    -- Permanent Address
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

-- 2.3 Candidate Education
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

-- 2.4 Candidate Skills
CREATE TABLE candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience DECIMAL(4,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_candidate_skills_candidate ON candidate_skills(candidate_id);
CREATE INDEX idx_candidate_skills_name ON candidate_skills(skill_name);

-- 2.5 Candidate Employment History
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
CREATE INDEX idx_candidate_employment_current ON candidate_employment_history(is_current);

-- 2.6 Candidate Bank Details
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

-- =============================================================================
-- JOB & APPLICATION TABLES
-- =============================================================================

-- 2.7 Jobs
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
CREATE INDEX idx_jobs_department ON jobs(department_id);
CREATE INDEX idx_jobs_location ON jobs(location_id);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);

-- 2.8 Job Applications
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
CREATE INDEX idx_applications_assigned ON job_applications(assigned_to);

-- 2.9 Application Stage History
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
CREATE INDEX idx_stage_history_changed_at ON application_stage_history(changed_at);

-- 2.10 Candidate Notes
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
CREATE INDEX idx_candidate_notes_created_by ON candidate_notes(created_by);

-- =============================================================================
-- DOCUMENTS TABLE (Shared across modules, polymorphic ownership)
-- =============================================================================

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
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE candidates IS 'Candidate master records';
COMMENT ON TABLE candidate_profiles IS 'Detailed candidate profile information';
COMMENT ON TABLE candidate_education IS 'Educational qualifications of candidates';
COMMENT ON TABLE candidate_skills IS 'Skills tagged by candidates';
COMMENT ON TABLE candidate_employment_history IS 'Previous employment records';
COMMENT ON TABLE candidate_bank_details IS 'Bank information for candidates';
COMMENT ON TABLE jobs IS 'Job postings';
COMMENT ON TABLE job_applications IS 'Candidate applications to jobs';
COMMENT ON TABLE application_stage_history IS 'Track application stage progression';
COMMENT ON TABLE candidate_notes IS 'Internal notes about candidates';
COMMENT ON TABLE documents IS 'Centralized document metadata with polymorphic ownership';
