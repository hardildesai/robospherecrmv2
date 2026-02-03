-- ============================================
-- Create New Superadmin Account
-- ============================================
-- Username: robospheresuperadmin
-- Password: robosphere@a217
-- Role: superadmin

-- First, delete the old admin account if it exists
DELETE FROM users WHERE username = 'admin';

-- Create new superadmin account
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'robospheresuperadmin',
    '$2b$10$PpKJKguaJ5Yf3xtYJwQIgu.iagZpoxUFsMaqvEOXqwK6w4lNN1V.',
    'RoboSphere Super Administrator',
    'superadmin',
    true,
    0
);

-- ============================================
-- Verify the account was created
-- ============================================
SELECT id, username, name, role, is_active, created_at 
FROM users 
WHERE username = 'robospheresuperadmin';
