# Events Management Module - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

#### Create PlanetScale Database
1. Go to https://planetscale.com
2. Create a new MySQL database
3. Copy the connection string

#### Setup Environment Variables
Create `.env.local`:
```env
# Database (PlanetScale MySQL)
DATABASE_URL="mysql://user:password@hostname/database?sslaccept=strict"

# Redis (Optional but recommended for production)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_DB="0"

# Solana Network
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Generate & Push Database Schema
```bash
# Generate migrations from schema
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) View database UI
npm run db:studio
```

### 4. Setup Solana Wallet (Frontend)
The app requires @solana/wallet-adapter-react. Make sure your layout includes the WalletProvider:

```typescript
// src/app/layout.tsx
import { Providers } from '@/app/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000/events

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts (List & Create)
│   │       ├── [id]/
│   │       │   ├── route.ts (Get, Update, Delete)
│   │       │   ├── attendees/
│   │       │   │   └── route.ts (Attendee management)
│   │       │   └── mint-nft/
│   │       │       └── route.ts (NFT minting)
│   │       └── create/
│   │           └── page.tsx
│   ├── events/
│   │   ├── page.tsx (Events list)
│   │   ├── create/
│   │   │   └── page.tsx (Create event)
│   │   └── [id]/
│   │       └── page.tsx (Event detail)
│   └── layout.tsx
├── components/
│   ├── EventCard.tsx (Event display component)
│   ├── EventForm.tsx (Event form component)
│   ├── ...
├── db/
│   ├── schema.ts (Drizzle schema)
│   └── client.ts (DB client)
├── hooks/
│   └── useEvents.ts (React Query hooks)
├── lib/
│   ├── redis.ts (Redis client & utilities)
│   ├── validations/
│   │   └── events.ts (Zod schemas)
│   └── solana/
│       └── nft-service.ts (NFT minting)
├── services/
│   └── events.service.ts (Business logic)
└── types/
    └── index.ts (TypeScript types)
```

## Key Files & Their Purpose

### Database
- **src/db/schema.ts** - Defines events and eventAttendees tables
- **drizzle.config.ts** - Drizzle ORM configuration
- **drizzle/0000_*.sql** - Generated migrations

### API Routes
- **src/app/api/events/route.ts** - List & create events
- **src/app/api/events/[id]/route.ts** - Get, update, delete event
- **src/app/api/events/[id]/attendees/route.ts** - Attendee registration & check-in

### Frontend
- **src/app/events/page.tsx** - Events list page
- **src/app/events/create/page.tsx** - Create event page
- **src/app/events/[id]/page.tsx** - Event detail page

### Core Logic
- **src/services/events.service.ts** - All event business logic
- **src/lib/redis.ts** - Caching utilities
- **src/lib/solana/nft-service.ts** - NFT minting utilities

## API Endpoints Overview

### Events
```
GET    /api/events                    # List all events
POST   /api/events                    # Create event
GET    /api/events/[id]              # Get event details
PUT    /api/events/[id]              # Update event
DELETE /api/events/[id]              # Delete event
```

### Attendees
```
GET    /api/events/[id]/attendees     # List attendees
POST   /api/events/[id]/attendees     # Register for event
PUT    /api/events/[id]/attendees     # Check in attendee
```

### NFT
```
POST   /api/events/[id]/mint-nft      # Mint NFT ticket
```

## Testing the Events Module

### 1. Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: YOUR_WALLET_ADDRESS" \
  -d '{
    "title": "Web3 Workshop",
    "description": "Learn about Web3 development",
    "category": "workshop",
    "location": "San Francisco, CA",
    "isVirtual": false,
    "startDate": "2024-06-01T10:00:00Z",
    "endDate": "2024-06-01T14:00:00Z",
    "capacity": 50,
    "ticketPrice": "0.5",
    "canMintNFT": true
  }'
```

### 2. List Events
```bash
curl "http://localhost:3000/api/events?page=1&limit=10&category=workshop"
```

### 3. Register for Event
```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/attendees \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: ATTENDEE_WALLET_ADDRESS" \
  -d '{}'
```

### 4. Check In Attendee (as organizer)
```bash
curl -X PUT http://localhost:3000/api/events/EVENT_ID/attendees \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: ORGANIZER_WALLET_ADDRESS" \
  -d '{
    "attendeeWalletAddress": "ATTENDEE_WALLET"
  }'
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Add Events Management Module"
git push
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the project

3. **Set Environment Variables**
   In Vercel Project Settings > Environment Variables:
   ```
   DATABASE_URL=mysql://...
   REDIS_HOST=...
   REDIS_PORT=6379
   SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Vercel automatically deploys on push to main

### Deploy Database with PlanetScale

```bash
# Connect to PlanetScale CLI
pscale auth login

# Create develop branch
pscale branch create events-dev

# Push migrations to develop
DATABASE_URL="pscale://..." npm run db:push

# Create production branch when ready
pscale branch create events-prod
```

## Troubleshooting

### Build Errors
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx drizzle-kit push:mysql

# View database
npm run db:studio
```

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix auto-fixable errors
npx tsc --noEmit --strict
```

## Performance Optimization

### Enable Redis Caching
```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

### Database Indexing
Events are indexed on:
- organizerWalletAddress
- status
- category
- startDate

Attendees are indexed on:
- eventId
- attendeeWalletAddress
- status

### Frontend Optimization
- Images are loaded lazily
- Components are code-split
- Framer Motion animations are optimized
- React Query caching is configured

## Next Steps

1. ✅ Database schema created
2. ✅ API endpoints implemented
3. ✅ Frontend pages created
4. ✅ Solana integration prepared
5. 🔄 **Deploy to production**
6. 🔄 **Add payment integration** (Stripe)
7. 🔄 **Implement NFT minting** with Metaplex
8. 🔄 **Add event reviews & ratings**
9. 🔄 **Create admin dashboard**

## Support & Documentation

- Full documentation: See `EVENTS_MODULE.md`
- Code comments in source files
- API examples in this guide
- TypeScript types for IDE autocompletion

## License

MIT - See LICENSE file
