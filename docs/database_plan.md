# Manual J Calculator Database Schema Design

## Overview
This document outlines the database schema design for the Manual J Calculator application, detailing the structure and relationships between tables, security measures, and integration details with Supabase.

## Table Structures

### 1. Projects Table
```sql
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    static_data JSONB NOT NULL,
    dynamic_assumptions JSONB NOT NULL,
    manual_j_results TEXT NOT NULL,
    chart_data TEXT NOT NULL,
    csv_data TEXT NOT NULL,
    model_versions JSONB,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Key Features:
- UUID primary keys for secure identification
- JSONB columns for flexible data storage
- Model version tracking for AI components
- Soft deletion support
- Location tracking
- Required fields for core functionality
- Automatic timestamp management

### 2. Chat Messages Table
```sql
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id),
    role TEXT CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sequence_number INTEGER
);
```

#### Key Features:
- Role validation for Gemini API compatibility
- Context storage for enhanced conversation tracking
- Sequential message ordering
- Project association for organized conversations

### 3. Processing Steps Table
```sql
CREATE TABLE public.processing_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id),
    step_name TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    model_version TEXT,
    status TEXT DEFAULT 'pending',
    error_details JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration INTERVAL GENERATED ALWAYS AS (completed_at - started_at) STORED
);
```

#### Key Features:
- Detailed step tracking
- Input/output data preservation
- Error capture and logging
- Duration calculation
- Model version tracking

## Security Implementation

### Row Level Security (RLS)
```sql
-- Projects Table RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own non-deleted projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id AND (is_deleted = false OR is_deleted IS NULL));

-- Chat Messages Table RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access messages from their projects"
    ON public.chat_messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = chat_messages.project_id
        AND projects.user_id = auth.uid()
    ));

-- Processing Steps Table RLS
ALTER TABLE public.processing_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access processing steps from their projects"
    ON public.processing_steps FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = processing_steps.project_id
        AND projects.user_id = auth.uid()
    ));
```

## Performance Optimizations

### Indexes
```sql
-- Projects Table Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);

-- Chat Messages Table Indexes
CREATE INDEX idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX idx_chat_messages_sequence ON public.chat_messages(project_id, sequence_number);

-- Processing Steps Table Indexes
CREATE INDEX idx_processing_steps_project_id ON public.processing_steps(project_id);
CREATE INDEX idx_processing_steps_status ON public.processing_steps(status);
```

### Triggers
```sql
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Soft deletion trigger
CREATE OR REPLACE FUNCTION set_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_deleted = true AND OLD.is_deleted = false THEN
        NEW.deleted_at = NOW();
    ELSIF NEW.is_deleted = false THEN
        NEW.deleted_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_soft_delete
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION set_deleted_at();
```

## Supabase Integration

### Environment Variables
Required environment variables in `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Authentication
The schema leverages Supabase's built-in authentication system, utilizing the `auth.users` table for user management and authentication.

## Testing Procedures

1. Schema Verification:
   - Execute all CREATE TABLE statements
   - Verify table structures and constraints
   - Confirm RLS policies are active

2. Data Access Testing:
   - Test user data isolation
   - Verify RLS policies are working as expected
   - Confirm index effectiveness

3. Integration Testing:
   - Test Supabase client connections
   - Verify authentication flows
   - Validate API endpoints

4. Performance Testing:
   - Test query performance with indexes
   - Verify trigger functionality
   - Monitor JSONB query performance

## Maintenance and Monitoring

1. Regular Checks:
   - Monitor table sizes
   - Review index usage
   - Check error logs

2. Backup Procedures:
   - Daily automated backups
   - Point-in-time recovery capability
   - Backup verification process

## Version Control System

### Project Versions Table
```sql
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    version_number INTEGER NOT NULL,
    static_data JSONB NOT NULL,
    dynamic_assumptions JSONB NOT NULL,
    manual_j_results JSONB NOT NULL,
    pdf_hash TEXT,
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
```

#### Key Features:
- Sequential version tracking per project
- Complete state capture for each version
- PDF hash tracking for document verification
- Automatic version archival after 5 versions
- Change reasoning documentation

### Version Comparison View
```sql
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
    AND v1.version_number = v2.version_number - 1;
```

## Climate Data Management

### Climate Zones Table
```sql
CREATE TABLE climate_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name TEXT NOT NULL,
    geo_coordinates GEOMETRY(Point, 4326) NOT NULL,
    elevation INTEGER,
    climate_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Key Features:
- PostGIS integration for precise location matching
- Elevation data for accurate climate calculations
- Comprehensive climate data storage in JSONB
- Spatial indexing for efficient queries

## Audit Trail System

### Calculation Audits Table
```sql
CREATE TABLE calculation_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    version_id UUID REFERENCES project_versions(id),
    modification_type TEXT CHECK (modification_type IN ('CREATE', 'UPDATE', 'DELETE', 'VERSION')),
    previous_state JSONB,
    new_state JSONB,
    change_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    encrypted_details BYTEA
);
```

#### Key Features:
- Comprehensive change tracking
- Encrypted sensitive data storage
- Time-based partitioning for performance
- Differential storage for large JSON changes

## Performance Optimizations

### Advanced Indexing Strategy
```sql
-- Version Control Indexes
CREATE INDEX idx_project_versions_project_id ON project_versions(project_id);
CREATE INDEX idx_project_versions_active ON project_versions(project_id, version_number) WHERE is_active = true;

-- Spatial Indexes
CREATE INDEX idx_climate_zones_coordinates ON climate_zones USING GIST(geo_coordinates);

-- Audit Trail Indexes
CREATE INDEX idx_calculation_audits_project ON calculation_audits(project_id);
CREATE INDEX idx_calculation_audits_time ON calculation_audits USING BRIN(created_at);
CREATE INDEX idx_static_data_gin ON project_versions USING GIN(static_data jsonb_path_ops);
```

### Partitioning Strategy
```sql
-- Time-based partitioning for audit data
CREATE TABLE calculation_audits_y2024m01 PARTITION OF calculation_audits
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE calculation_audits_y2024m02 PARTITION OF calculation_audits
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

## Enhanced Security Measures

### Encryption Functions
```sql
-- Audit data encryption
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
```

### Additional RLS Policies
```sql
-- Version Control RLS
CREATE POLICY user_versions_select ON project_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_versions.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- Climate Data RLS
CREATE POLICY climate_zones_select ON climate_zones
    FOR SELECT USING (true);
CREATE POLICY climate_zones_insert ON climate_zones
    FOR INSERT WITH CHECK (
        auth.jwt()->>'role' = 'admin'
    );
```

## Migration Steps

1. Version Control Implementation:
   - Create new version tables
   - Initialize first version for existing projects
   - Set up archival triggers

2. Climate Data Migration:
   - Create climate zones table
   - Import existing climate data
   - Update project references

3. Audit System Setup:
   - Create audit tables with partitions
   - Set up encryption
   - Initialize tracking triggers

## Future Considerations

1. Scalability:
   - Implement additional partitioning strategies
   - Archive policy for old versions
   - Caching implementation

2. Extensions:
   - Advanced spatial analysis capabilities
   - Enhanced audit reporting
   - Advanced security features
