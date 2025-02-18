/* Database Schema for the Manual J Calculator Workflow */

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create ENUM type for project status
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'error');
    END IF;
END$$;

-- Projects Table: Core project information and results
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Project Metadata
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    status project_status NOT NULL DEFAULT 'pending',
    pdf_url TEXT,

    -- AI Processing Results
    static_data JSONB NOT NULL,
    dynamic_assumptions JSONB NOT NULL,
    manual_j_results TEXT NOT NULL,

    -- Visualization Data
    chart_data TEXT NOT NULL,
    csv_data TEXT NOT NULL,

    -- AI Model Tracking
    -- NOTE: These default values should remain in sync with environment variables
    -- GEMINI_REASONING_MODEL and GEMINI_VISION_MODEL defined in .env.local
    model_versions JSONB NOT NULL DEFAULT json_build_object(
        'vision_model', 'gemini-2.0-pro-exp-02-05',
        'reasoning_model', 'gemini-2.0-flash-thinking-exp-01-21'
    ),

    -- Error Handling
    error_log JSONB[] DEFAULT ARRAY[]::JSONB[],
    last_error TEXT,

    -- Soft Delete
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ
);

-- Chat Messages Table: Store conversation history
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Message Content and Sender Validation
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    message TEXT NOT NULL,

    -- Context and Metadata
    context_data JSONB,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Processing Steps Table: Track each step of the Manual J calculation pipeline
CREATE TABLE processing_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    input_data JSONB,
    output_data JSONB,
    error_details TEXT,

    model_version TEXT NOT NULL,
    processing_metadata JSONB DEFAULT '{}'::JSONB
);

-- Project Versions Table: Version control for project calculations
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    static_data JSONB NOT NULL,
    dynamic_assumptions JSONB NOT NULL,
    manual_j_results JSONB NOT NULL,
    pdf_hash TEXT,
    change_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(project_id, version_number),
    CONSTRAINT valid_static_data CHECK (jsonb_typeof(static_data) = 'object')
);

-- Climate Zones Table: Enhanced climate data management
CREATE TABLE climate_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name TEXT NOT NULL,
    geo_coordinates GEOMETRY(Point, 4326) NOT NULL,
    elevation INTEGER,
    climate_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calculation Audits Table: Audit trail system
CREATE TABLE calculation_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_id UUID REFERENCES project_versions(id),
    modification_type TEXT NOT NULL CHECK (modification_type IN ('CREATE', 'UPDATE', 'DELETE', 'VERSION')),
    previous_state JSONB,
    new_state JSONB,
    change_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    encrypted_details BYTEA
);

-- Create materialized view for version differences
CREATE MATERIALIZED VIEW version_diffs AS
SELECT 
    v1.project_id,
    v1.version_number as old_version,
    v2.version_number as new_version,
    v1.created_at as old_version_date,
    v2.created_at as new_version_date,
    jsonb_diff_val(v1.static_data, v2.static_data) as static_data_diff,
    jsonb_diff_val(v1.dynamic_assumptions, v2.dynamic_assumptions) as assumptions_diff,
    jsonb_diff_val(v1.manual_j_results, v2.manual_j_results) as results_diff
FROM project_versions v1
JOIN project_versions v2 
    ON v1.project_id = v2.project_id 
    AND v1.version_number = v2.version_number - 1
WHERE v1.is_active = true AND v2.is_active = true;

-- Indexes for Performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_location ON projects(location);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_processing_steps_project_id ON processing_steps(project_id);
CREATE INDEX idx_processing_steps_status ON processing_steps(status);

-- New indexes for version control and performance
CREATE INDEX idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX idx_project_versions_active ON project_versions(project_id, version_number) WHERE is_active = true;
CREATE INDEX idx_climate_zones_coordinates ON climate_zones USING GIST(geo_coordinates);
CREATE INDEX idx_calculation_audits_project ON calculation_audits(project_id);
CREATE INDEX idx_calculation_audits_time ON calculation_audits USING BRIN(created_at);
CREATE INDEX idx_static_data_gin ON project_versions USING GIN(static_data jsonb_path_ops);

-- Partition calculation_audits by time
CREATE TABLE calculation_audits_y2024m01 PARTITION OF calculation_audits
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE calculation_audits_y2024m02 PARTITION OF calculation_audits
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Trigger to update the updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_timestamp
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Version archival function
CREATE OR REPLACE FUNCTION archive_old_versions()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE project_versions
    SET is_active = false
    WHERE project_id = NEW.project_id
    AND version_number < NEW.version_number - 5;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_old_versions_trigger
    AFTER INSERT ON project_versions
    FOR EACH ROW
    EXECUTE FUNCTION archive_old_versions();

-- Encryption function for audit data
CREATE OR REPLACE FUNCTION encrypt_audit_data()
RETURNS TRIGGER AS $$
BEGIN
    NEW.encrypted_details = encrypt(
        NEW.previous_state::text::bytea,
        current_setting('app.encryption_key'),
        'aes'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_audit_data_trigger
    BEFORE INSERT ON calculation_audits
    FOR EACH ROW
    EXECUTE FUNCTION encrypt_audit_data();

-- Row-Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY user_project_select ON projects
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_project_insert ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_project_update ON projects
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY user_chat_select ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1
            FROM projects
            WHERE projects.id = chat_messages.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY user_chat_insert ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM projects
            WHERE projects.id = chat_messages.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- RLS Policies for processing_steps
CREATE POLICY user_steps_select ON processing_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1
            FROM projects
            WHERE projects.id = processing_steps.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- RLS for project_versions
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_versions_select ON project_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY user_versions_insert ON project_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- RLS for calculation_audits
ALTER TABLE calculation_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_audits_select ON calculation_audits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = calculation_audits.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- RLS for climate_zones (public read, admin write)
ALTER TABLE climate_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY climate_zones_select ON climate_zones
    FOR SELECT USING (true);
CREATE POLICY climate_zones_insert ON climate_zones
    FOR INSERT WITH CHECK (
        auth.jwt()->>'role' = 'admin'
    );
