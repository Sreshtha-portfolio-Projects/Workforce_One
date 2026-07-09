-- WorkforceOS Database Schema
-- Part 5: Policy Management & Workflow Tables

-- =============================================================================
-- POLICY MANAGEMENT TABLES
-- =============================================================================

-- 5.1 Policies
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
CREATE INDEX idx_policies_effective ON policies(effective_from, effective_to);

-- 5.2 Policy Assignments
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

-- 5.3 Policy Acknowledgments
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

-- =============================================================================
-- WORKFLOW ENGINE TABLES (Foundation)
-- =============================================================================

-- 5.4 Workflow Definitions
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
CREATE INDEX idx_workflow_defs_active ON workflow_definitions(is_active);

-- 5.5 Workflow Instances
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
CREATE INDEX idx_workflow_instances_definition ON workflow_instances(workflow_definition_id);

-- 5.6 Workflow Approvals
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

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE policies IS 'Policy documents and versioning';
COMMENT ON TABLE policy_assignments IS 'Assign policies to users/groups';
COMMENT ON TABLE policy_acknowledgments IS 'Track employee acknowledgments';
COMMENT ON TABLE workflow_definitions IS 'Reusable workflow templates';
COMMENT ON TABLE workflow_instances IS 'Active workflow executions';
COMMENT ON TABLE workflow_approvals IS 'Individual approval actions';
