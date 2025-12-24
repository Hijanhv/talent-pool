# Quick Deployment Guide - 10 Steps to Production

**Estimated Time**: 30-45 minutes
**Prerequisites**: GitHub account, Vercel account, PlanetScale account (all free)

---

## STEP 1: Create PlanetScale Database (5 minutes)

```
1. Go to https://planetscale.com
2. Sign up (free) if needed
3. Click "Create a new database"
4. Name: talent-pool
5. Region: Select closest to you (e.g., us-east)
6. Click "Create database"
```

After creation:
```
7. Click "Connect" button
8. Select "MySQL" driver
9. Copy the connection string
10. Save it somewhere safe (you'll need it in Step 4)
```

**Expected format**: `mysql://username:password@hostname/talent_pool`

---

## STEP 2: Commit Code to Git

In your terminal:

```bash
cd /Users/janhv/Desktop/talent-pool

# Check git status
git status

# If not initialized, initialize
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Events Management System - Production Ready"

# Verify
git log --oneline | head -1
```

**Expected output**: Shows your commit

---

## STEP 3: Create GitHub Repository

```
1. Go to https://github.com/new
2. Repository name: talent-pool
3. Description: Events Management System
4. Public or Private: Your choice
5. Click "Create repository"
```

After creation, you'll see commands like:

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/talent-pool.git
git branch -M main
git push -u origin main
```

Run these commands in your terminal.

**Verify**: Refresh GitHub page - you should see your code

---

## STEP 4: Create Vercel Project

```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Paste: https://github.com/YOUR_USERNAME/talent-pool.git
5. Click "Continue"
6. Click "Import"
```

Vercel will detect it's a Next.js project automatically.

**Expected**: You'll see "Importing project..." then configuration screen

---

## STEP 5: Add Environment Variables to Vercel

In Vercel's project settings:

```
1. Go to "Settings" → "Environment Variables"
2. Click "Add New"
```

Add these variables (copy from Step 1's connection string):

| Name | Value |
|------|-------|
| `DATABASE_URL` | `mysql://[user]:[password]@[host]/talent_pool?sslaccept=strict` |
| `SOLANA_RPC_URL` | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` |
| `NEXT_PUBLIC_APP_URL` | Will update after deployment |
| `HELIUS_API_KEY` | (optional - skip if you don't have it) |

**Important**:
- Replace `[user]`, `[password]`, `[host]` with actual values from PlanetScale
- Add `?sslaccept=strict` at the end of DATABASE_URL

---

## STEP 6: Test Locally (Optional but Recommended)

Before deploying to production, test locally:

```bash
# Create local .env.local
cat > /Users/janhv/Desktop/talent-pool/.env.local << 'EOF'
DATABASE_URL="mysql://[user]:[password]@[host]/talent_pool?sslaccept=strict"
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev

# Test in browser
# Open http://localhost:3000/events
# Try creating an event
```

If all works, proceed to Step 7.

---

## STEP 7: First Deployment to Vercel

```bash
# Push to GitHub (Vercel auto-deploys on push)
git push origin main
```

In Vercel Dashboard:
```
1. Go to your project
2. Click "Deployments" tab
3. Wait for build to complete (2-3 minutes)
4. When status shows "Ready", deployment succeeded!
5. Click the URL to view your deployed app
```

**Expected**: You'll see a URL like `https://talent-pool-xxx.vercel.app`

---

## STEP 8: Update Environment Variable (Post-Deployment)

Now that you have your Vercel URL, update one env var:

```
1. In Vercel → Settings → Environment Variables
2. Find NEXT_PUBLIC_APP_URL
3. Change value to: https://[your-vercel-url].vercel.app
   (Use the actual URL from Step 7)
4. Click "Save"
5. Redeploy: Click "Deployments" → Find latest → Click "..."  → "Redeploy"
```

**Wait** for redeployment to complete (~2 minutes)

---

## STEP 9: Test Production APIs

```bash
# Replace with your actual Vercel URL
PROD_URL="https://your-vercel-url.vercel.app"

# Test 1: Get all events (should be empty array)
curl $PROD_URL/api/events

# Expected response:
# {"success":true,"data":{"data":[],"pagination":{"page":1,"limit":20,"total":0,"totalPages":0}}}

# Test 2: Visit in browser
# Open $PROD_URL/events
# Should load without errors
```

---

## STEP 10: Final Verification

### In Browser:
```
1. Visit https://your-vercel-url.vercel.app/events
2. Click "Create Event" button
3. Fill in form:
   - Title: "Test Event"
   - Description: "This is a test event"
   - Category: "Tech"
   - Location: "Virtual"
   - Start Date: Tomorrow at 2 PM
   - End Date: Tomorrow at 3 PM
   - Capacity: 100
   - Ticket Price: 1.0
4. Click "Create Event"
5. Verify success message
6. Check events list - event should appear
7. Click event to view details
```

### In Terminal (API Test):
```bash
PROD_URL="https://your-vercel-url.vercel.app"

# Get all events
curl $PROD_URL/api/events | jq '.data.data | length'

# Should return: 1 (your test event)
```

---

## ✅ Deployment Complete!

Your production system is live and ready to use!

### What You Have:
- ✅ Live backend API
- ✅ Live frontend
- ✅ Connected to production database
- ✅ Auto-deploying on git push
- ✅ Full CRUD operations working
- ✅ Web3 integration ready

### Share Your URL:
Send this to stakeholders:
```
https://your-vercel-url.vercel.app/events
```

### Monitor Your App:
In Vercel Dashboard, check:
- Deployments tab - track each deployment
- Logs tab - see real-time logs
- Analytics tab - view performance

---

## Troubleshooting Quick Fixes

### Build Failed in Vercel
```
Check in Vercel "Logs" tab:
- Copy error message
- Search Google or GitHub issues
- Most common: Missing environment variable
- Fix: Add missing variable in Vercel → Settings → Environment Variables
- Redeploy
```

### Database Connection Error
```
1. Verify DATABASE_URL in Vercel is correct
2. Check for typos in connection string
3. Verify database still exists in PlanetScale
4. Test connection string locally: npm run db:studio
```

### Frontend Shows "Loading..." Forever
```
1. Check browser console for errors (F12)
2. Check Vercel logs for API errors
3. Common: API environment variable missing
4. Fix: Add NEXT_PUBLIC_APP_URL correctly
```

### "Cannot find module" Error
```
1. Delete node_modules locally: rm -rf node_modules
2. Reinstall: npm install
3. Test build: npm run build
4. If still fails, check package.json for typos
```

---

## Next Steps After Deployment

### Week 1: Monitor & Test
- [ ] Check Vercel logs daily
- [ ] Test all features manually
- [ ] Collect any bugs/issues
- [ ] Monitor database performance

### Week 2: Optimize
- [ ] Add any critical fixes
- [ ] Monitor error rates
- [ ] Review Vercel analytics
- [ ] Optimize slow endpoints

### Month 1: Plan Updates
- [ ] Gather user feedback
- [ ] Plan v2 features
- [ ] Document lessons learned
- [ ] Scale if needed

---

## Support Resources

| Issue | Resource |
|-------|----------|
| Vercel Issues | https://vercel.com/docs/platform/troubleshoot |
| PlanetScale Issues | https://planetscale.com/docs/troubleshooting |
| Database Schema | Open `/src/db/schema.ts` |
| API Endpoints | Open `/src/app/api/events/` |
| Frontend Code | Open `/src/app/events/` |

---

## Quick Command Reference

```bash
# Local development
npm run dev          # Start local server
npm run build        # Build for production
npm run lint         # Check for errors

# Database
npm run db:generate  # Create migrations
npm run db:push      # Apply migrations
npm run db:studio    # View database GUI

# Git
git add .            # Stage changes
git commit -m "msg"  # Commit
git push origin main # Push (triggers Vercel deploy)

# View logs
git log --oneline    # See commits
```

---

**Time Estimate**:
- Actual deployment: 20-30 minutes
- Testing: 10-15 minutes
- Total: 30-45 minutes ✓

**Status**: 🟢 Ready to Deploy!

---

**Questions?** Check:
1. DEPLOYMENT_GUIDE.md - Detailed explanation
2. PROJECT_STATUS.md - Project overview
3. DEPLOYMENT_CHECKLIST.md - Full verification
