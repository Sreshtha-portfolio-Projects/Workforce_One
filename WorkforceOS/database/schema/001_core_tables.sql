-- WorkforceOS Database Schema
-- Part 1: Core Tables (Identity, Access, Organization)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. IDENTITY & ACCESS TABLES
-- =============================================================================

-- 1.1 Users table
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
CREATE INDEX idx_users_active ON users(is_active);

-- 1.2 User profiles
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

-- =============================================================================
-- 2. ORGANIZATION TABLES
-- =============================================================================

-- 2.1 Organizations
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
CREATE INDEX idx_organizations_active ON organizations(is_active);

-- 2.2 Departments
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
CREATE INDEX idx_departments_active ON departments(is_active);

-- 2.3 Designations
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
CREATE INDEX idx_designations_active ON designations(is_active);

-- 2.4 Locations
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
CREATE INDEX idx_locations_active ON locations(is_active);

-- =============================================================================
-- 3. RBAC TABLES
-- =============================================================================

-- 3.1 Roles
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
CREATE INDEX idx_roles_system ON roles(is_system_role);

-- 3.2 Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permissions_resource ON permissions(resource);

-- 3.3 Role Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- 3.4 User Roles (Many-to-Many)
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

-- =============================================================================
-- 4. AUDIT & SYSTEM TABLES
-- =============================================================================

-- 4.1 Audit Logs
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
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- 4.2 Notifications
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
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- 4.3 Notification Preferences
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

CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- =============================================================================
-- SEED DATA: System Roles
-- =============================================================================

INSERT INTO roles (name, display_name, description, is_system_role) VALUES
('super_admin', 'Super Admin', 'Full system access across all organizations', TRUE),
('admin', 'Admin', 'Organization administrator', TRUE),
('hr', 'HR', 'Human Resources personnel', TRUE),
('recruiter', 'Recruiter', 'Recruitment specialist', TRUE),
('hiring_manager', 'Hiring Manager', 'Department hiring authority', TRUE),
('manager', 'Manager', 'Team manager', TRUE),
('employee', 'Employee', 'Regular employee', TRUE),
('candidate', 'Candidate', 'Job candidate', TRUE);

-- =============================================================================
-- SEED DATA: Permissions
-- =============================================================================

INSERT INTO permissions (name, resource, action, description) VALUES
-- Dashboard
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
('jobs.close', 'jobs', 'close', 'Close jobs'),

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

-- Settings
('settings.view', 'settings', 'view', 'View organization settings'),
('settings.edit', 'settings', 'edit', 'Edit organization settings'),
('roles.manage', 'roles', 'manage', 'Manage roles and permissions'),

-- Audit
('audit.view', 'audit', 'view', 'View audit logs');

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'Core user accounts for all user types';
COMMENT ON TABLE organizations IS 'Multi-tenant organizations/companies';
COMMENT ON TABLE roles IS 'Role definitions for RBAC';
COMMENT ON TABLE permissions IS 'Permission definitions (resource.action format)';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all operations';
