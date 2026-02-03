-- ============================================
-- Create Superadmin Account
-- ============================================
-- Username: admin
-- Password: roboadmina217
-- ============================================

INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'admin',
    '$2b$10$QiS3d0ImBSHxwkk1hCWG3u4MnqzvFiLh9BDXVvqTcBI95SrmXivTy',
    'System Administrator',
    'superadmin',
    true,
    0
);

-- Verify account creation
SELECT id, username, name, role, is_active FROM users WHERE role = 'superadmin';
