# Supabase Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Create Supabase Account & Project (5 minutes)

1. **Go to** [supabase.com](https://supabase.com)
2. **Click** "Start your project"
3. **Sign up** with GitHub (recommended) or email
4. **Create new project**:
   - Organization: Create new or use existing
   - Project name: `robosphere-crm`
   - Database password: **Save this!** (you'll need it)
   - Region: Choose closest to you (e.g., `Southeast Asia (Singapore)`)
   - Pricing plan: **Free**
5. **Wait** ~2 minutes for project to provision

---

### Step 2: Run SQL Schema (2 minutes)

1. **In Supabase dashboard**, click **SQL Editor** (left sidebar)
2. **Click** "+ New query"
3. **Open** the file `supabase_schema.sql` (in brain folder)
4. **Copy ALL content** from the file
5. **Paste** into SQL Editor
6. **Click** "Run" (or press Ctrl+Enter)
7. **Wait** for success message (should see "Success. No rows returned")

**Verify**:
- Click **Table Editor** (left sidebar)
- You should see 26 tables listed

---

### Step 3: Get API Keys (1 minute)

1. **Click** ⚙️ **Settings** (bottom left)
2. **Click** **API** (left sidebar)
3. **Copy** these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

---

### Step 4: Create Environment File (1 minute)

1. **Create** `.env.local` in project root:

```bash
# .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Replace** with your actual values from Step 3

3. **Add** to `.gitignore` (if not already there):

```
# .gitignore
.env.local
```

---

### Step 5: Test Connection (2 minutes)

Run the test script I'll create to verify everything works!

---

## ✅ Checklist

- [ ] Supabase account created
- [ ] Project created (robosphere-crm)
- [ ] SQL schema executed (26 tables created)
- [ ] API keys copied
- [ ] `.env.local` file created
- [ ] Connection tested

---

## 🎯 What's Next?

After setup is complete, I'll:
1. Create Supabase client configuration
2. Update `store.ts` to use Supabase instead of mock data
3. Test all CRUD operations
4. Deploy to Vercel

---

## 🆘 Troubleshooting

**Problem**: SQL script fails  
**Solution**: Make sure you copied the ENTIRE file, including the last line

**Problem**: Can't find API keys  
**Solution**: Settings → API → Look for "Project API keys"

**Problem**: `.env.local` not working  
**Solution**: Restart dev server (`npm run dev`)

---

## 📊 Database Overview

**Total Tables**: 26
- `members` - Member profiles
- `events` - Club events
- `event_attendance` - Who attended what
- `teams` - Team information
- `team_members` - Team membership
- `projects` - Project tracking
- `contributions` - Project contributions
- `inventory` - Equipment/tools
- `checkouts` - Borrowed items
- `waitlist` - Prospective members
- `recruitment_applications` - New applicants
- `interviews` - Interview scheduling
- `recruitment_cohorts` - Recruitment batches
- `wiki_articles` - Knowledge base
- `polls` - Voting polls
- `poll_options` - Poll choices
- `poll_votes` - Who voted for what
- `elections` - Leadership elections
- `election_candidates` - Election candidates
- `election_votes` - Election voting
- `lab_machines` - Lab equipment
- `reservations` - Machine bookings
- `users` - Authentication
- `audit_logs` - Activity tracking
- `release_proposals` - Member releases
- `settings` - Global config

**Ready to proceed!**
