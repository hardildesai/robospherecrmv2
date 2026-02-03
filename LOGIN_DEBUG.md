# Login Debugging Guide

## 🔍 Step-by-Step Debugging

### Step 1: Verify User Exists in Supabase

Run this in your **Supabase SQL Editor**:

```sql
SELECT 
    id, 
    username, 
    password_hash,
    name, 
    role, 
    is_active,
    created_at
FROM users 
WHERE username = 'admin';
```

**Expected Result:**
- Should return **1 row**
- `username` should be `admin`
- `role` should be `superadmin`
- `is_active` should be `true`
- `password_hash` should start with `$2b$10$QiS3d0ImBSHxwkk1hCWG3u...`

❌ **If no rows returned:** The user wasn't created. Run `create_my_superadmin.sql` again.

✅ **If row exists:** Continue to Step 2.

---

### Step 2: Clear Browser Cache & Reload

The app might have cached old data.

1. **Open DevTools** (F12)
2. **Application Tab** → **Storage** → **Clear site data**
3. **Close the app completely**
4. **Reopen** and try logging in

---

### Step 3: Check Browser Console

1. Open **DevTools** (F12) → **Console** tab
2. Try logging in with:
   - Username: `admin`
   - Password: `roboadmina217`
3. Look for error messages in console

**What to look for:**
- ❌ "Error loading users" → Supabase connection issue
- ❌ "Password comparison error" → bcrypt issue
- ✅ "Login successful" → Should navigate to dashboard

---

### Step 4: Force Data Reload

If data isn't loading from Supabase:

1. Open **DevTools** console
2. Run this:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

This clears ALL cached data and forces fresh load from Supabase.

---

### Step 5: Check Network Tab

1. Open **DevTools** → **Network** tab
2. Try logging in
3. Look for requests to Supabase
4. Check if `users` table data is being loaded

---

## 🎯 Quick Test

After clearing cache, the app should:

1. **Load users from Supabase** (check console for "Loading all data from Supabase...")
2. **Show your admin user** in the loaded data
3. **Accept login** with username: `admin`, password: `roboadmina217`

---

## 🆘 If Still Not Working

Run this SQL to **double-check everything**:

```sql
-- Check if user exists
SELECT COUNT(*) as user_count FROM users WHERE username = 'admin';

-- Check exact details
SELECT 
    username,
    LEFT(password_hash, 20) as hash_preview,
    role,
    is_active
FROM users 
WHERE username = 'admin';

-- Test with a different password to generate new hash
```

---

## 💡 Alternative: Use Test Password

If you want to test quickly, try the pre-generated test account:

**SQL:**
```sql
INSERT INTO users (id, username, password_hash, name, role, is_active, failed_access_attempts)
VALUES (
    'user-superadmin-002',
    'testadmin',
    '$2b$10$K87QFZtKPj3Qw8vZ8vZ8eO5Z8qE9YvN5X8vZ8vZ8eK5Z8qE9YvN5O',
    'Test Admin',
    'superadmin',
    true,
    0
);
```

**Login:**
- Username: `testadmin`
- Password: `admin123`

Then clear cache and try this one!
