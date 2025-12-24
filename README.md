# TalentPool - Decentralized Freelance & Events Platform

A Web3-native platform on Solana combining freelance marketplace (gigs) and event management with NFT tickets, badges, and blockchain-verified reputation. Zero platform fees, instant SOL payments, and decentralized trust-building.

![Solana](https://img.shields.io/badge/Solana-devnet-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Live Deployment

**Production URL:** [https://talent-pool-kappa.vercel.app](https://talent-pool-kappa.vercel.app)

**GitHub Repository:** [https://github.com/Hijanhv/talent-pool](https://github.com/Hijanhv/talent-pool)

---

## 📋 Project Overview

TalentPool is a comprehensive Web3 platform featuring:

### 1. Freelance Marketplace (Gigs)
- Post and browse freelance services across multiple categories
- Direct peer-to-peer hiring with SOL payments
- Zero platform fees - keep 100% of earnings
- Order management with complete status tracking
- Review and rating system for reputation

### 2. Event Management System
- Create virtual and physical events
- Ticket sales with SOL payments
- Attendee registration and check-in
- **NFT ticket minting** for proof of attendance
- Capacity management and revenue tracking

### 3. NFT & Achievement System
- **Event NFT Tickets** - Mint proof-of-attendance certificates
- **Achievement Badges** - Earn badges for milestones:
  - event_attendee, event_organizer, early_adopter
  - super_host, active_participant
- All NFTs stored as Solana SPL tokens in user wallets

### 4. Multi-Wallet Support
- Phantom, Solflare, and Solong integration
- Auto-connect and transaction signing
- Wallet-based authentication

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14.2.35** - React App Router with Server/Client Components
- **TypeScript 5.0** - Full type safety with strict mode
- **Tailwind CSS** - Custom neo-brutalism design system
- **Framer Motion** - Smooth animations
- **React Query** - Server state management and caching
- **Solana Wallet Adapter** - Multi-wallet support

### Backend
- **Next.js API Routes** - Serverless REST APIs
- **Drizzle ORM 0.28.1** - Type-safe PostgreSQL queries
- **PostgreSQL (Neon)** - Cloud database with connection pooling
- **Zod** - Runtime validation

### Blockchain
- **Solana Web3.js** - Blockchain interactions
- **@solana/spl-token** - NFT minting
- **Solana Devnet** - Test network

### Infrastructure
- **Vercel** - Deployment platform
- **Neon PostgreSQL** - Serverless database
- **Solana RPC** - Devnet endpoint

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Git
- Solana wallet (Phantom browser extension)

### 1. Clone Repository
```bash
git clone https://github.com/Hijanhv/talent-pool.git
cd talent-pool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
npm run db:push
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## 🌐 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC (client) | `https://api.devnet.solana.com` |
| `SOLANA_RPC_URL` | Solana RPC (server) | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Network type | `devnet` |
| `NEXT_PUBLIC_APP_URL` | Deployed URL | `https://your-app.vercel.app` |

---

## 🚢 Deployment to Vercel

1. Push to GitHub
```bash
git push origin main
```

2. Import to Vercel
- Go to vercel.com
- Import your GitHub repository
- Vercel auto-detects Next.js

3. Add Environment Variables
- Add all variables from `.env.local`
- Use **pooled connection** for DATABASE_URL

4. Deploy
- Click Deploy
- Wait 2-3 minutes
- Your app is live!

---

## 📁 Project Structure

```
talent-pool/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── events/        # Events CRUD
│   │   │   ├── gigs/          # Gigs CRUD
│   │   │   └── badges/        # Badges API
│   │   ├── events/            # Events pages
│   │   ├── gigs/              # Marketplace pages
│   │   ├── profile/           # User profile
│   │   ├── dashboard/         # User dashboard
│   │   └── providers.tsx      # React Query + Wallet
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   │   └── solana/
│   │       └── nft-service.ts # NFT minting
│   ├── db/                    # Database
│   │   ├── client.ts
│   │   └── schema.ts          # Tables + relations
│   └── types/                 # TypeScript types
├── drizzle/                   # Migrations
├── drizzle.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 💡 Assumptions & Notes

### Architecture Decisions

1. **Next.js App Router** - Better performance with Server Components
2. **PostgreSQL** - Switched from MySQL (PlanetScale removed free tier)
3. **Drizzle ORM** - Lightweight and type-safe
4. **Neo-Brutalism Design** - Bold, youth-friendly aesthetic
5. **Devnet** - Safe testing with free SOL

### Assumptions

1. **Wallet-Based Auth** - No email/password required
2. **Direct Payments** - No escrow in MVP (future enhancement)
3. **Optional NFT Minting** - Users opt-in for event tickets
4. **Soft Deletes** - Preserves order history
5. **12 Items Per Page** - Pagination default

### Future Enhancements

- Smart contract escrow for payments
- Real-time notifications
- Mobile app (React Native)
- Mainnet deployment
- Multi-language support
- DAO governance

---

## 🎯 Key Features

✅ Complete CRUD for Gigs, Events, Orders, Profiles  
✅ Solana wallet integration (Phantom, Solflare, Solong)  
✅ NFT ticket minting for events  
✅ Badge/achievement system  
✅ Neo-brutalism responsive design  
✅ Search, filter, pagination  
✅ Type-safe with TypeScript + Zod  

---

## 📚 API Documentation

### Events
```
GET    /api/events              # List with pagination
POST   /api/events              # Create event
GET    /api/events/[id]         # Get details
PUT    /api/events/[id]         # Update
DELETE /api/events/[id]         # Soft delete

POST   /api/events/[id]/attendees      # Register
POST   /api/events/[id]/mint-nft       # Mint NFT
```

### Gigs
```
GET    /api/gigs                # List with pagination
POST   /api/gigs                # Create gig
GET    /api/gigs/[id]           # Get details
PUT    /api/gigs/[id]           # Update
DELETE /api/gigs/[id]           # Delete
```

---

## 📝 License

MIT License

---

## 👨‍💻 Developer

**Repository:** [github.com/Hijanhv/talent-pool](https://github.com/Hijanhv/talent-pool)  
**Live Demo:** [talent-pool-kappa.vercel.app](https://talent-pool-kappa.vercel.app)

---

**Built with ❤️ for the Web3 community**
