# Deployment Guide - Events Management System

This guide walks through deploying the Events Management System to production using Vercel and PlanetScale.

## Prerequisites

You'll need:
- GitHub account (for version control)
- Vercel account (free at vercel.com)
- PlanetScale account (free at planetscale.com)
- Node.js 18+ installed locally

## Step 1: Prepare Git Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/janhv/Desktop/talent-pool
git init
git add .
git commit -m "Initial commit: Events Management System"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/talent-pool.git
git branch -M main
git push -u origin main
```

## Step 2: Configure PlanetScale Database

### 2.1 Create PlanetScale Database
1. Log in to [PlanetScale](https://planetscale.com)
2. Click "Create a new database"
3. Enter name: `talent-pool`
4. Choose region closest to you
5. Click "Create database"

### 2.2 Get Connection String
1. Go to the database overview
2. Click "Connect" button
3. Select "MySQL" driver
4. Copy the connection string: `mysql://[username]:[password]@[host]/talent_pool`

### 2.3 Create Development Branch (Important!)
PlanetScale requires a development branch for safe migrations:
```
In PlanetScale UI:
1. Go to "Branches" tab
2. Click "Create branch"
3. Name it "development"
4. This allows safe testing before production
```

## Step 3: Set Up Environment Variables

### 3.1 Create `.env.local` locally
```bash
cat > /Users/janhv/Desktop/talent-pool/.env.local << 'EOF'
# Database - Use development branch connection string from Step 2.2
DATABASE_URL="mysql://[YOUR_USERNAME]:[YOUR_PASSWORD]@[YOUR_HOST]/talent_pool?sslaccept=strict"

# Solana RPC
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional - Helius API for advanced Solana features
HELIUS_API_KEY="your_helius_api_key_here"
EOF
```

### 3.2 Run Database Migrations Locally
```bash
# Generate Drizzle migrations
npm run db:generate

# Push migrations to development database
npm run db:push

# View the database with Drizzle Studio
npm run db:studio
```

### 3.3 Test Locally
```bash
# Build the project
npm run build

# Run locally
npm run dev

# Test in browser
# - Open http://localhost:3000
# - Navigate to /events
# - Try creating an event
```

## Step 4: Deploy to Vercel

### 4.1 Connect Repository to Vercel
1. Go to [Vercel](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

### 4.2 Configure Environment Variables
In Vercel Project Settings:
1. Go to "Settings" → "Environment Variables"
2. Add the following:

```
DATABASE_URL: mysql://[YOUR_USERNAME]:[YOUR_PASSWORD]@[YOUR_HOST]/talent_pool?sslaccept=strict
SOLANA_RPC_URL: https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL: https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK: devnet
NEXT_PUBLIC_APP_URL: https://[YOUR_VERCEL_URL]
HELIUS_API_KEY: [optional - if you have it]
```

**Important**: For `NEXT_PUBLIC_APP_URL`, use your actual Vercel deployment URL (e.g., `https://talent-pool-navy.vercel.app`)

### 4.3 Enable Automatic Deployments
In Vercel Project Settings:
1. Go to "Git" section
2. Under "Deploy on Push", ensure it's enabled for your main branch
3. This will auto-deploy on every git push

### 4.4 Initial Deployment
```bash
# Push to GitHub (which triggers Vercel deployment)
git push origin main
```

Monitor deployment in Vercel Dashboard - should complete in 2-3 minutes.

## Step 5: Production Database Setup

### 5.1 Create Production Database in PlanetScale
1. In PlanetScale, click "Promote to production"
2. Select your main branch
3. Confirm - this will make it the production database

### 5.2 Update Production Connection
For maximum security, create a separate database user:

In PlanetScale:
1. Go to "Settings" → "Users & Passwords"
2. Create new password: `[database]_prod`
3. Copy the new connection string
4. Update Vercel environment variable `DATABASE_URL` with this new connection

### 5.3 Run Production Migrations
```bash
# Before first production deployment, ensure migrations are up-to-date
npm run db:generate
npm run db:push
```

## Step 6: Verify Deployment

### 6.1 Check Deployment Status
```bash
# In Vercel Dashboard:
# 1. Go to your project
# 2. Check "Deployments" tab
# 3. Ensure latest deployment shows "Ready"
```

### 6.2 Test Production APIs
```bash
# Using curl or Postman
PROD_URL="https://your-deployment.vercel.app"

# Test GET all events
curl $PROD_URL/api/events

# Should return:
# {
#   "success": true,
#   "data": { "data": [], "pagination": {...} }
# }
```

### 6.3 Test Frontend
1. Visit your Vercel deployment URL
2. Navigate to `/events`
3. Try creating an event
4. Verify event appears in the list
5. Click to view event details
6. Test registration flow

## Step 7: Post-Deployment Configuration

### 7.1 Enable CRON Jobs (Optional)
For advanced features, you can set up scheduled tasks in Vercel using `/api/cron` endpoints.

### 7.2 Set Up Error Tracking (Optional)
Consider adding error tracking:
- [Sentry](https://sentry.io) - Free plan available
- [LogRocket](https://logrocket.com) - Session replay

### 7.3 Monitor Database Performance
In PlanetScale Dashboard:
1. Check "Analytics" tab for query performance
2. Monitor connection pool usage
3. Review slow query logs

## Troubleshooting

### Database Connection Issues
```bash
# Verify connection string format
# mysql://user:password@host/database?sslaccept=strict

# Common issues:
# - Special characters in password need URL encoding
# - sslaccept=strict is required for PlanetScale
```

### Build Failures
```bash
# Check build logs in Vercel
# Common issues:
# - Missing environment variables
# - TypeScript compilation errors
# - Missing dependencies

# Fix locally first:
npm install
npm run build
```

### Database Migration Issues
```bash
# If migrations fail:
npm run db:generate
npm run db:push --force

# Check schema in Drizzle Studio
npm run db:studio
```

## Rollback Procedure

If you need to rollback:

### 1. In Vercel
1. Go to "Deployments" tab
2. Find the previous working deployment
3. Click "..." → "Redeploy"

### 2. In PlanetScale
1. Go to "Branches"
2. If you pushed bad migrations, you can revert through Git or recreate the branch

## Performance Optimization

### 1. Enable Caching
Caching is already implemented in the code using Redis-like patterns.

### 2. Database Indexing
Events are already indexed on:
- `organizerWalletAddress`
- `status`
- `category`
- `startDate`

### 3. Vercel Edge Functions (Optional)
For even faster API responses, you can convert some routes to Edge Functions.

## Security Checklist

- ✅ Never commit `.env.local` to Git (in .gitignore)
- ✅ Use strong PlanetScale passwords
- ✅ Enable Vercel password protection in Settings if needed
- ✅ Validate all user inputs (already done with Zod)
- ✅ Use HTTPS everywhere (Vercel enforces this)
- ✅ Keep dependencies updated: `npm audit`

## Monitoring & Maintenance

### Weekly
- Check Vercel deployment logs
- Monitor database connection pool

### Monthly
- Review PlanetScale analytics
- Update dependencies: `npm update`

### Quarterly
- Full security audit
- Performance optimization review
- Backup database (PlanetScale handles this)

## Next Steps

Once deployed:
1. Test all API endpoints in production
2. Monitor error rates in first week
3. Gather user feedback
4. Plan v2 features

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Next.js Docs: https://nextjs.org/docs
- Drizzle Docs: https://orm.drizzle.team

## Git Commands Reference

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub (triggers Vercel deployment)
git push origin main

# View git log
git log --oneline
```
