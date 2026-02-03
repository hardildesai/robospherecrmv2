-- ============================================
-- RoboSphere CRM v2 - Complete Supabase Schema
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This creates all tables, relationships, indexes, and RLS policies

-- ============================================
-- 1. MEMBERS TABLE
-- ============================================
CREATE TABLE members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL CHECK (branch IN ('Mechanical', 'Electrical', 'CS', 'Civil', 'Other')),
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    phone TEXT,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Probation', 'Passive', 'Dismissed')),
    attendance_percent DECIMAL(5,2) DEFAULT 0.00 CHECK (attendance_percent BETWEEN 0 AND 100),
    fee_status TEXT NOT NULL DEFAULT 'Pending' CHECK (fee_status IN ('Paid', 'Pending', 'Forfeited')),
    avatar_url TEXT,
    rank TEXT NOT NULL DEFAULT 'Member' CHECK (rank IN ('Member', 'Lead', 'Mentor', 'Alumni')),
    skills TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    last_attended DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for members
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_student_id ON members(student_id);
CREATE INDEX idx_members_rank ON members(rank);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('Workshop', 'Meeting', 'Hackathon', 'Social', 'Competition')),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);

-- ============================================
-- 3. EVENT_ATTENDANCE (Junction Table)
-- ============================================
CREATE TABLE event_attendance (
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    method TEXT DEFAULT 'manual' CHECK (method IN ('manual', 'qr', 'kiosk')),
    PRIMARY KEY (event_id, member_id)
);

-- Indexes for event_attendance
CREATE INDEX idx_event_attendance_member ON event_attendance(member_id);
CREATE INDEX idx_event_attendance_event ON event_attendance(event_id);

-- ============================================
-- 4. TEAMS TABLE
-- ============================================
CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    lead_id TEXT REFERENCES members(id) ON DELETE SET NULL,
    created_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for teams
CREATE INDEX idx_teams_lead ON teams(lead_id);
CREATE INDEX idx_teams_name ON teams(name);

-- ============================================
-- 5. TEAM_MEMBERS (Junction Table)
-- ============================================
CREATE TABLE team_members (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    joined_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (team_id, member_id)
);

-- Indexes for team_members
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_member ON team_members(member_id);

-- ============================================
-- 6. PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Complete', 'On Hold')),
    deadline DATE,
    created_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for projects
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- 7. CONTRIBUTIONS TABLE
-- ============================================
CREATE TABLE contributions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    hours DECIMAL(5,2) NOT NULL CHECK (hours > 0),
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for contributions
CREATE INDEX idx_contributions_project ON contributions(project_id);
CREATE INDEX idx_contributions_member ON contributions(member_id);
CREATE INDEX idx_contributions_date ON contributions(date);

-- ============================================
-- 8. INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tool', 'Kit', 'Component', 'Equipment', 'Other')),
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    available INTEGER NOT NULL DEFAULT 0 CHECK (available >= 0),
    condition TEXT NOT NULL DEFAULT 'Good' CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Needs Repair')),
    location TEXT,
    purchase_date DATE,
    cost DECIMAL(10,2),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT available_lte_quantity CHECK (available <= quantity)
);

-- Indexes for inventory
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_available ON inventory(available);

-- ============================================
-- 9. CHECKOUTS TABLE
-- ============================================
CREATE TABLE checkouts (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    checkout_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    return_date TIMESTAMPTZ,
    condition_on_return TEXT CHECK (condition_on_return IN ('Excellent', 'Good', 'Fair', 'Needs Repair')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for checkouts
CREATE INDEX idx_checkouts_item ON checkouts(item_id);
CREATE INDEX idx_checkouts_member ON checkouts(member_id);
CREATE INDEX idx_checkouts_return_date ON checkouts(return_date);
CREATE INDEX idx_checkouts_due_date ON checkouts(due_date);

-- ============================================
-- 10. WAITLIST TABLE
-- ============================================
CREATE TABLE waitlist (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT NOT NULL,
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for waitlist
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- ============================================
-- 11. RECRUITMENT_APPLICATIONS TABLE
-- ============================================
CREATE TABLE recruitment_applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT NOT NULL,
    branch TEXT NOT NULL CHECK (branch IN ('Mechanical', 'Electrical', 'CS', 'Civil', 'Other')),
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
    phone TEXT,
    why_join TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    experience TEXT,
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Interview Scheduled', 'Accepted', 'Rejected')),
    cohort TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for recruitment_applications
CREATE INDEX idx_recruitment_status ON recruitment_applications(status);
CREATE INDEX idx_recruitment_cohort ON recruitment_applications(cohort);

-- ============================================
-- 12. INTERVIEWS TABLE
-- ============================================
CREATE TABLE interviews (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES recruitment_applications(id) ON DELETE CASCADE,
    interviewer_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    score INTEGER CHECK (score BETWEEN 1 AND 10),
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for interviews
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_interviewer ON interviews(interviewer_id);
CREATE INDEX idx_interviews_date ON interviews(scheduled_date);

-- ============================================
-- 13. RECRUITMENT_COHORTS TABLE
-- ============================================
CREATE TABLE recruitment_cohorts (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    application_count INTEGER DEFAULT 0,
    accepted_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. WIKI_ARTICLES TABLE
-- ============================================
CREATE TABLE wiki_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tutorial', 'Post-Mortem', 'Resource', 'Guide')),
    content TEXT NOT NULL,
    author TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    created_date DATE DEFAULT CURRENT_DATE,
    last_modified DATE DEFAULT CURRENT_DATE,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for wiki_articles
CREATE INDEX idx_wiki_category ON wiki_articles(category);
CREATE INDEX idx_wiki_author ON wiki_articles(author);
CREATE INDEX idx_wiki_tags ON wiki_articles USING GIN(tags);

-- ============================================
-- 15. POLLS TABLE
-- ============================================
CREATE TABLE polls (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
    created_by TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    created_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for polls
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_by ON polls(created_by);

-- ============================================
-- 16. POLL_OPTIONS TABLE
-- ============================================
CREATE TABLE poll_options (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for poll_options
CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);

-- ============================================
-- 17. POLL_VOTES (Junction Table)
-- ============================================
CREATE TABLE poll_votes (
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (poll_id, member_id)
);

-- Indexes for poll_votes
CREATE INDEX idx_poll_votes_member ON poll_votes(member_id);

-- ============================================
-- 18. ELECTIONS TABLE
-- ============================================
CREATE TABLE elections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for elections
CREATE INDEX idx_elections_status ON elections(status);

-- ============================================
-- 19. ELECTION_CANDIDATES TABLE
-- ============================================
CREATE TABLE election_candidates (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    position TEXT NOT NULL,
    manifesto TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for election_candidates
CREATE INDEX idx_election_candidates_election ON election_candidates(election_id);
CREATE INDEX idx_election_candidates_member ON election_candidates(member_id);

-- ============================================
-- 20. ELECTION_VOTES (Junction Table)
-- ============================================
CREATE TABLE election_votes (
    election_id TEXT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL REFERENCES election_candidates(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (election_id, member_id)
);

-- Indexes for election_votes
CREATE INDEX idx_election_votes_member ON election_votes(member_id);

-- ============================================
-- 21. LAB_MACHINES TABLE
-- ============================================
CREATE TABLE lab_machines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('3D Printer', 'CNC', 'Laser Cutter', 'Workstation')),
    model TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Idle' CHECK (status IN ('Idle', 'In Use', 'Maintenance', 'Offline')),
    image_url TEXT,
    current_job JSONB,
    specs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lab_machines
CREATE INDEX idx_lab_machines_status ON lab_machines(status);
CREATE INDEX idx_lab_machines_type ON lab_machines(type);

-- ============================================
-- 22. RESERVATIONS TABLE
-- ============================================
CREATE TABLE reservations (
    id TEXT PRIMARY KEY,
    machine_id TEXT NOT NULL REFERENCES lab_machines(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
    created_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes for reservations
CREATE INDEX idx_reservations_machine ON reservations(machine_id);
CREATE INDEX idx_reservations_member ON reservations(member_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_start_time ON reservations(start_time);

-- ============================================
-- 23. USERS TABLE (Authentication)
-- ============================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'superadmin')),
    is_active BOOLEAN DEFAULT TRUE,
    failed_access_attempts INTEGER DEFAULT 0,
    member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_member ON users(member_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 24. AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action_type TEXT NOT NULL,
    user_id TEXT,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action_type);

-- ============================================
-- 25. RELEASE_PROPOSALS TABLE
-- ============================================
CREATE TABLE release_proposals (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    proposed_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    proposed_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Executed', 'Rejected')),
    executed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    executed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for release_proposals
CREATE INDEX idx_release_proposals_member ON release_proposals(member_id);
CREATE INDEX idx_release_proposals_status ON release_proposals(status);

-- ============================================
-- 26. SETTINGS TABLE (Global Configuration)
-- ============================================
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('recruitment_open', 'true'),
    ('maintenance_mode', 'false'),
    ('default_password', '"robosphere"'),
    ('allow_member_signups', 'true'),
    ('status_thresholds', '{"green": 85, "yellow": 60}');

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruitment_applications_updated_at BEFORE UPDATE ON recruitment_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruitment_cohorts_updated_at BEFORE UPDATE ON recruitment_cohorts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wiki_articles_updated_at BEFORE UPDATE ON wiki_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON elections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_machines_updated_at BEFORE UPDATE ON lab_machines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_release_proposals_updated_at BEFORE UPDATE ON release_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data (you can customize this later)
CREATE POLICY "Allow authenticated read access" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON event_attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON contributions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON checkouts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON waitlist FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON recruitment_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON interviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON recruitment_cohorts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON wiki_articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON polls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON poll_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON poll_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON elections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON election_candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON election_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON lab_machines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON release_proposals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON settings FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete (you can customize this later for role-based access)
CREATE POLICY "Allow authenticated write access" ON members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON events FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON event_attendance FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON teams FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON contributions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON checkouts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON waitlist FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON recruitment_applications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON interviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON recruitment_cohorts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON wiki_articles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON polls FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON poll_options FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON poll_votes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON elections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON election_candidates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON election_votes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON lab_machines FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON reservations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON audit_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON release_proposals FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access" ON settings FOR ALL TO authenticated USING (true);

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Total Tables: 26
-- Total Indexes: 50+
-- Total Triggers: 17
-- Total RLS Policies: 52
-- ============================================
