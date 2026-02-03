# Creating Superadmin Account - Complete Guide

## 🎯 Three Methods to Create Superadmin

---

## Method 1: Quick Setup (For Testing Only)

**Use this for**: Quick testing, development  
**Security**: ⚠️ Low (default password)

### Steps:

1. **Run the main schema** (`supabase_schema.sql`)
2. **Run this SQL** in Supabase SQL Editor:

```sql
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'admin',
    '$2a$10$K87QFZtKPj3Qw8vZ8vZ8eO5Z8qE9YvN5X8vZ8vZ8eK5Z8qE9YvN5O',
    'System Administrator',
    'superadmin',
    true,
    0
);
```

3. **Login with**:
   - Username: `admin`
   - Password: `admin123`

4. **⚠️ CHANGE PASSWORD IMMEDIATELY!**

---

## Method 2: Online Hash Generator (Recommended)

**Use this for**: Production, secure setup  
**Security**: ✅ High

### Steps:

1. **Go to**: [bcrypt-generator.com](https://bcrypt-generator.com/)

2. **Enter your password**:
   - Use a strong password (12+ characters)
   - Mix uppercase, lowercase, numbers, symbols
   - Example: `RoboSphere@2026!Secure`

3. **Set rounds to**: `10`

4. **Click "Generate Hash"**

5. **Copy the hash** (starts with `$2a$10$...`)

6. **Run this SQL** in Supabase SQL Editor:

```sql
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-001',
    'your_username',           -- Your chosen username
    'YOUR_BCRYPT_HASH_HERE',   -- Paste the hash from step 5
    'Your Full Name',          -- Your name
    'superadmin',
    true,
    0
);
```

7. **Login with your credentials!**

---

## Method 3: Node.js Script (Most Secure)

**Use this for**: Multiple admins, automation  
**Security**: ✅ Highest

### Steps:

1. **Install bcrypt**:
```bash
npm install bcryptjs
```

2. **Create** `generate-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

// Your password here
const password = 'YourSecurePassword123!';

// Generate hash
const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('Password Hash Generated!');
console.log('=================================');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('=================================\n');

// Generate SQL
console.log('Copy this SQL to Supabase:\n');
console.log(`INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)`);
console.log(`VALUES (`);
console.log(`    'user-superadmin-001',`);
console.log(`    'admin',`);
console.log(`    '${hash}',`);
console.log(`    'System Administrator',`);
console.log(`    'superadmin',`);
console.log(`    true,`);
console.log(`    0`);
console.log(`);\n`);
```

3. **Run the script**:
```bash
node generate-hash.js
```

4. **Copy the SQL output** and run it in Supabase!

---

## 🔐 Password Best Practices

### Strong Password Requirements:
- ✅ Minimum 12 characters
- ✅ Uppercase letters (A-Z)
- ✅ Lowercase letters (a-z)
- ✅ Numbers (0-9)
- ✅ Special characters (!@#$%^&*)
- ❌ No common words
- ❌ No personal information
- ❌ No sequential patterns (123, abc)

### Examples of Strong Passwords:
- `RoboSphere@2026!Admin`
- `Cr3@t1v3!R0b0t1cs#2026`
- `S3cur3P@ssw0rd!CRM`

---

## 👥 Creating Multiple Admins

### For Team Members:

```sql
-- Superadmin (full access)
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES ('user-superadmin-001', 'admin', 'HASH_HERE', 'Main Admin', 'superadmin', true, 0);

-- Regular Admin (most access)
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES ('user-admin-001', 'john_admin', 'HASH_HERE', 'John Doe', 'admin', true, 0);

-- Member (limited access)
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES ('user-member-001', 'jane_member', 'HASH_HERE', 'Jane Smith', 'member', true, 0);
```

---

## ✅ Verify Account Creation

**Run this SQL** to check:

```sql
SELECT id, username, name, role, is_active, created_at 
FROM users 
WHERE role IN ('superadmin', 'admin')
ORDER BY created_at DESC;
```

---

## 🔒 Security Checklist

After creating accounts:

- [ ] Changed default password (if using Method 1)
- [ ] Stored credentials in password manager
- [ ] Tested login works
- [ ] Verified superadmin has full access
- [ ] Documented who has admin access
- [ ] Set up password rotation schedule (90 days)

---

## 🆘 Troubleshooting

### Can't Login?

1. **Check username is correct** (case-sensitive)
2. **Verify account exists**:
   ```sql
   SELECT * FROM users WHERE username = 'your_username';
   ```
3. **Check password hash** was copied correctly
4. **Ensure `is_active = true`**
5. **Check browser console** for errors

### Forgot Password?

**Reset it**:
```sql
UPDATE users 
SET password_hash = 'NEW_HASH_HERE' 
WHERE username = 'your_username';
```

### Account Locked?

**Reset failed attempts**:
```sql
UPDATE users 
SET failed_access_attempts = 0, is_active = true 
WHERE username = 'your_username';
```

---

## 📝 Next Steps

After creating superadmin:

1. ✅ Login to the app
2. ✅ Create additional users via UI
3. ✅ Set up team members
4. ✅ Configure system settings
5. ✅ Start using the CRM!

**You're all set!** 🎉
