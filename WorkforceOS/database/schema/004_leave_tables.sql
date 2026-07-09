-- WorkforceOS Database Schema
-- Part 4: Leave Management Tables

-- =============================================================================
-- LEAVE MANAGEMENT TABLES
-- =============================================================================

-- 4.1 Leave Types
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
CREATE INDEX idx_leave_types_active ON leave_types(is_active);

-- 4.2 Leave Balances
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
CREATE INDEX idx_leave_balances_year ON leave_balances(year);

-- 4.3 Leave Requests
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
CREATE INDEX idx_leave_requests_type ON leave_requests(leave_type_id);

-- 4.4 Leave Approvals
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

-- 4.5 Holidays
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

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE leave_types IS 'Leave type definitions';
COMMENT ON TABLE leave_balances IS 'Employee leave balance tracking';
COMMENT ON TABLE leave_requests IS 'Leave applications';
COMMENT ON TABLE leave_approvals IS 'Approval workflow for leave requests';
COMMENT ON TABLE holidays IS 'Holiday calendar';
