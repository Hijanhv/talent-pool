# Deployment Checklist

Copy and paste these steps to ensure everything is ready for production deployment.

## Pre-Deployment Verification ✓

- [ ] Code compiles without errors: `npm run build`
- [ ] All tests pass (if applicable)
- [ ] No console errors in dev mode: `npm run dev`
- [ ] All API endpoints tested locally
- [ ] TypeScript types verified: `npx tsc --noEmit`
- [ ] Dependencies are up to date: `npm audit`

## Code Review Checklist ✓

- [ ] No hardcoded secrets or API keys
- [ ] All environment variables are in `.env.example`
- [ ] Error handling is comprehensive
- [ ] Input validation uses Zod schemas
- [ ] Database queries are optimized
- [ ] Component structure is clean
- [ ] No dead code or unused imports
- [ ] Comments explain complex logic

## Database Setup ✓

- [ ] PlanetScale account created
- [ ] Database "talent-pool" created
- [ ] Development branch created for safe testing
- [ ] Connection string copied and secured
- [ ] Local migrations tested: `npm run db:push`
- [ ] Database schema verified in Drizzle Studio

## Environment Configuration ✓

### Local Testing
```bash
# Create .env.local with:
DATABASE_URL="mysql://..."
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- [ ] `.env.local` created with all required variables
- [ ] `.env.local` is in `.gitignore` (never commit!)
- [ ] `.env.example` updated with all variable names
- [ ] Variables match Vercel production setup

## Git & GitHub Setup ✓

```bash
# Initialize and commit
git init
git add .
git commit -m "Initial commit: Events Management System"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/talent-pool.git
git branch -M main
git push -u origin main
```

- [ ] GitHub repository created
- [ ] Code pushed to GitHub main branch
- [ ] `.gitignore` prevents committing secrets
- [ ] Commit history is clean

## Vercel Deployment ✓

### Step 1: Create Vercel Project
```
1. Log in to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Click "Import"
```

- [ ] Vercel project created
- [ ] GitHub integration connected
- [ ] Automatic deployments enabled

### Step 2: Add Environment Variables in Vercel
```
In Vercel Project Settings → Environment Variables:
- DATABASE_URL: mysql://[user]:[password]@[host]/talent_pool?sslaccept=strict
- SOLANA_RPC_URL: https://api.devnet.solana.com
- NEXT_PUBLIC_SOLANA_RPC_URL: https://api.devnet.solana.com
- NEXT_PUBLIC_SOLANA_NETWORK: devnet
- NEXT_PUBLIC_APP_URL: https://[your-vercel-url].vercel.app
- HELIUS_API_KEY: [if available]
```

- [ ] All environment variables added to Vercel
- [ ] Variables are NOT visible in public logs
- [ ] Variables apply to all environments (Production)

### Step 3: Deploy
```bash
# Push to GitHub (auto-triggers Vercel deployment)
git push origin main

# Or manually redeploy in Vercel UI if needed
```

- [ ] Initial deployment triggered
- [ ] Deployment completes without errors
- [ ] Vercel dashboard shows "Ready"

## Post-Deployment Verification ✓

### Test API Endpoints
```bash
PROD_URL="https://your-vercel-deployment.vercel.app"

# Get all events (should return empty array initially)
curl $PROD_URL/api/events

# Should return similar to:
# {"success":true,"data":{"data":[],"pagination":{"page":1,"limit":20,"total":0,"totalPages":0}}}
```

- [ ] GET /api/events returns valid response
- [ ] GET /api/events/:id returns proper data
- [ ] POST /api/events creates events (test with curl/Postman)
- [ ] PUT /api/events/:id updates events
- [ ] DELETE /api/events/:id deletes events

### Test Frontend
```
1. Visit https://your-vercel-deployment.vercel.app
2. Navigate to /events
3. Page loads without errors
4. Create an event (test full form)
5. Verify event appears in list
6. Click on event for detail view
7. Test registration flow
```

- [ ] Frontend loads without console errors
- [ ] /events page displays correctly
- [ ] Can navigate between pages
- [ ] Forms work and submit successfully
- [ ] Data persists in database
- [ ] Responsive design works on mobile

### Monitor Errors
```
In Vercel Dashboard:
- Check "Logs" tab for any runtime errors
- Check "Function Logs" for API errors
```

- [ ] No errors in Vercel logs
- [ ] No errors in browser console
- [ ] All network requests succeed

## Production Database Setup ✓

### Promote to Production (if testing in development first)
```
In PlanetScale:
1. Click "Promote to production"
2. Select your main branch
3. Confirm the promotion
```

- [ ] Production database is live in PlanetScale
- [ ] Backups are enabled (automatic)
- [ ] Connection string uses production branch

## Performance & Monitoring ✓

- [ ] First Contentful Paint (FCP) < 2s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Database queries execute < 100ms
- [ ] No N+1 query problems

## Security Final Check ✓

```bash
# Check for secrets in code
git grep -i "password\|secret\|api.key" src/

# Should return nothing (only in .env which is gitignored)
```

- [ ] No hardcoded passwords or API keys
- [ ] All secrets in environment variables
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] CORS properly configured if needed
- [ ] Input validation on all endpoints
- [ ] Database connection uses SSL

## Documentation ✓

- [ ] README.md exists with setup instructions
- [ ] DEPLOYMENT_GUIDE.md created
- [ ] DEPLOYMENT_CHECKLIST.md completed (this file)
- [ ] Code comments explain complex logic
- [ ] API endpoints documented
- [ ] Database schema documented

## Team Communication ✓

- [ ] Team informed of deployment
- [ ] Production URL shared with stakeholders
- [ ] Testing instructions provided
- [ ] Rollback procedure documented
- [ ] On-call person designated for monitoring

## Final Steps ✓

```bash
# After successful deployment:
1. Update NEXT_PUBLIC_APP_URL in code if it changed
2. Verify all links in emails/docs point to new URL
3. Test webhook integrations if any
4. Set up monitoring/alerts
5. Plan v2 features based on feedback
```

- [ ] All links updated to production URL
- [ ] Team has access to production systems
- [ ] Monitoring is configured
- [ ] Alerts are set up

---

## Quick Reference: Deployment Commands

```bash
# Local testing
npm install
npm run dev
npm run build

# Database management
npm run db:generate  # Create migrations
npm run db:push      # Apply migrations
npm run db:studio    # View database

# Git workflow
git add .
git commit -m "Your message"
git push origin main  # Triggers Vercel deployment

# Vercel CLI (optional)
npm install -g vercel
vercel              # Deploy current project
vercel env ls       # List environment variables
vercel logs         # View logs
```

## Emergency Contacts

- Vercel Support: https://vercel.com/support
- PlanetScale Support: https://planetscale.com/support
- Your GitHub Issues: Track bugs in GitHub Issues

## Sign-Off

- [ ] Tested by: _________________ Date: _______
- [ ] Reviewed by: ________________ Date: _______
- [ ] Approved for production: _____ Date: _______

---

**Last Updated**: 2025-12-24
**Version**: 1.0
**Status**: Ready for Deployment ✅
