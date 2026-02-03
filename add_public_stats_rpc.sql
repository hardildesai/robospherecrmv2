-- ============================================
-- Public Stats Function
-- ============================================
-- This function allows unauthenticated users (anon)
-- to get basic stats like total member count
-- without exposing actual member data.
-- ============================================

CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (bypassing RLS)
AS $$
DECLARE
    total_members INTEGER;
    total_projects INTEGER;
    server_time TIMESTAMP;
BEGIN
    -- Get count of active members
    SELECT COUNT(*) INTO total_members 
    FROM members 
    WHERE status = 'Active';

    -- Get count of active projects
    SELECT COUNT(*) INTO total_projects 
    FROM projects 
    WHERE status = 'Active';
    
    -- Get server time
    server_time := NOW();

    -- Return as JSON
    RETURN jsonb_build_object(
        'total_members', total_members,
        'total_projects', total_projects,
        'server_time', server_time
    );
END;
$$;

-- Grant execute permission to anon (public) and authenticated roles
GRANT EXECUTE ON FUNCTION get_public_stats() TO anon, authenticated;
