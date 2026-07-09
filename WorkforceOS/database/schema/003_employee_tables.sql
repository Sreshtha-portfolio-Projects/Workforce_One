-- WorkforceOS Database Schema
-- Part 3: Employee Management Tables

-- =============================================================================
-- EMPLOYEE MANAGEMENT TABLES
-- =============================================================================

-- 3.1 Employees (Master Table)
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
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_active ON employees(is_active);

-- 3.2 Employee Profiles (Extended Information)
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

-- 3.3 Employee Education
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

-- 3.4 Employee Skills
CREATE TABLE employee_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience DECIMAL(4,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_skills_employee ON employee_skills(employee_id);
CREATE INDEX idx_employee_skills_name ON employee_skills(skill_name);

-- 3.5 Employee Bank Details
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
CREATE INDEX idx_employee_bank_verified ON employee_bank_details(is_verified);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE employees IS 'Employee master records';
COMMENT ON TABLE employee_profiles IS 'Detailed employee profile information';
COMMENT ON TABLE employee_education IS 'Educational qualifications of employees';
COMMENT ON TABLE employee_skills IS 'Skills of employees';
COMMENT ON TABLE employee_bank_details IS 'Bank information for payroll';
