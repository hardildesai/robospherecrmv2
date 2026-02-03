-- ============================================
-- Verify Superadmin Account Exists
-- ============================================
-- Run this to check if your account was created correctly

SELECT 
    id, 
    username, 
    password_hash,
    name, 
    role, 
    is_active,
    failed_access_attempts,
    created_at
FROM users 
WHERE username = 'admin';

-- This should return 1 row with:
-- - username: admin
-- - role: superadmin
-- - is_active: true
-- - password_hash starting with: $2b$10$QiS3d0ImBSHxwkk1hCWG3u...
