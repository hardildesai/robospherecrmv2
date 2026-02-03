-- ============================================
-- Create Initial Superadmin Account
-- ============================================
-- Run this AFTER running the main schema
-- This creates your first superadmin account

-- ============================================
-- OPTION 1: Simple Setup (For Testing)
-- ============================================
-- Password: "admin123" (CHANGE THIS IMMEDIATELY!)
-- This uses a simple bcrypt hash for quick setup

INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'admin',
    '$2a$10$rKJ5Z8qE9YvN5X8vZ8vZ8eK5Z8qE9YvN5X8vZ8vZ8eK5Z8qE9YvN5',  -- Password: "admin123"
    'System Administrator',
    'superadmin',
    true,
    0
);

-- ============================================
-- OPTION 2: Custom Setup (Recommended)
-- ============================================
-- Use this to create your own superadmin with a custom password
-- You'll need to generate a bcrypt hash first

-- Step 1: Generate bcrypt hash
-- Go to: https://bcrypt-generator.com/
-- Enter your desired password
-- Use 10 rounds
-- Copy the hash

-- Step 2: Run this query with YOUR hash
/*
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'your_username',           -- Change this
    'YOUR_BCRYPT_HASH_HERE',   -- Paste your hash here
    'Your Full Name',          -- Change this
    'superadmin',
    true,
    0
);
*/

-- ============================================
-- OPTION 3: Create Multiple Admin Accounts
-- ============================================
-- Create additional admin accounts for your team

/*
-- Admin account 1
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-admin-001',
    'admin1',
    'YOUR_BCRYPT_HASH_HERE',
    'Admin User 1',
    'admin',
    true,
    0
);

-- Admin account 2
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-admin-002',
    'admin2',
    'YOUR_BCRYPT_HASH_HERE',
    'Admin User 2',
    'admin',
    true,
    0
);
*/

-- ============================================
-- VERIFY ACCOUNT CREATION
-- ============================================
-- Run this to check if the account was created
SELECT id, username, name, role, is_active FROM users WHERE role = 'superadmin';

-- ============================================
-- NOTES
-- ============================================
-- 1. The default password for OPTION 1 is "admin123"
-- 2. CHANGE THIS PASSWORD IMMEDIATELY after first login!
-- 3. For production, ALWAYS use OPTION 2 with a strong password
-- 4. Never commit password hashes to git
-- 5. Store admin credentials securely (password manager)

-- ============================================
-- PASSWORD REQUIREMENTS (Recommended)
-- ============================================
-- Minimum 12 characters
-- Mix of uppercase, lowercase, numbers, symbols
-- No common words or patterns
-- Unique per admin account

-- ============================================
-- SECURITY BEST PRACTICES
-- ============================================
-- 1. Use different passwords for each admin
-- 2. Enable 2FA (future enhancement)
-- 3. Rotate passwords every 90 days
-- 4. Monitor failed login attempts in audit_logs
-- 5. Disable unused admin accounts
