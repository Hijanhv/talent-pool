# TalentPool - Zero-Fee Decentralized Freelance Marketplace

A Web3-native freelance marketplace on Solana where students, teenagers, and young adults earn SOL instantly with zero commissions, build blockchain-verified reputation, and trade gigs peer-to-peer.

![TalentPool](https://img.shields.io/badge/Solana-devnet-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Features

### For Freelancers (Gig Creators)
- **Post Unlimited Gigs** - Offer services in 6 categories (Development, Design, Writing, Video, Tutoring, Other)
- **Instant Payments** - Receive SOL immediately when work is approved, no payment delays
- **Zero Fees** - Keep 100% of earnings, unlike Fiverr (20-30% cut) or Upwork (5-20% cut)
- **Global Access** - No banking requirements, just connect Solana wallet
- **NFT Reputation** - Earn on-chain badges: Top Rated (⭐4.8+), Fast Delivery (50+ orders), Expert (20+ in category), Trusted ($1000+ earned)
- **Portfolio Showcase** - Display completed work and reviews on public profile
- **Mobile-First** - Works on any phone with Phantom/Solflare wallet

### For Buyers (Gig Posters)
- **Browse Gigs** - Search and filter by category, price, rating, delivery time
- **Transparent Pricing** - See exact SOL prices, no hidden fees
- **Direct Hiring** - Choose freelancers, negotiate delivery time
- **Secure Transactions** - Order status tracking from creation to completion
- **Leave Reviews** - Rate freelancers and build community trust

### Platform Features
- **CRUD Operations** - Create, Read, Update, Delete gigs and orders
- **Pagination** - Efficient browsing of 10,000+ gigs
- **Real-Time Status** - Track orders: Pending → In Progress → Delivered → Completed
- **NFT Badges** - Blockchain-verified reputation on Solana
- **Responsive Design** - Works perfectly on mobile, tablet, desktop
- **Type-Safe** - Full TypeScript, Zod validation, zero `any` types

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React SSR framework for server/client components
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Query (TanStack)** - Server state management, caching, mutations
- **Solana Wallet Adapter** - Connect Phantom, Solflare, Solong wallets
- **Lucide Icons** - Beautiful SVG icons
- **React Hook Form** - Form validation with minimal re-renders

### Backend
- **Next.js API Routes** - Serverless functions for CRUD
- **TypeScript** - Type-safe backend code
- **Drizzle ORM** - Lightweight, type-safe database layer
- **Zod** - Runtime validation for API inputs
- **MySQL** - Relational database (PlanetScale recommended)

### Blockchain
- **Solana Web3.js** - Interact with Solana RPC
- **Metaplex** - NFT minting and metadata management
- **Solana Devnet** - Test network (free SOL faucet)

### Infrastructure
- **Vercel** - Deploy Next.js + edge functions + serverless
- **PlanetScale** - MySQL database with instant scaling
- **Solana RPC** - Community node or Helius/QuickNode

---

## 📋 How It Works

### User Journey

#### Freelancer Workflow
```
1. Connect Wallet (Phantom/Solflare)
   ↓
2. Create Profile (name, bio, skills)
   ↓
3. Post Gig (title, description, price in SOL, delivery time)
   ↓
4. Receive Orders (buyers request to hire for gig)
   ↓
5. Complete Work (deliver files/link after buyer pays)
   ↓
6. Get Paid (SOL transferred instantly to wallet)
   ↓
7. Earn Badges (system auto-mints NFTs for achievements)
   ↓
8. Build Reputation (reviews + badges = trust score)
```

#### Buyer Workflow
```
1. Connect Wallet (Phantom/Solflare)
   ↓
2. Browse Gigs (search by category, price, rating)
   ↓
3. View Details (see freelancer profile, reviews, badge)
   ↓
4. Create Order (set delivery deadline, approve price)
   ↓
5. Payment (SOL transferred from wallet to smart contract escrow)
   ↓
6. Receive Work (freelancer delivers, you approve quality)
   ↓
7. Release Funds (payment transferred to freelancer)
   ↓
8. Leave Review (rate experience, support freelancer)
```

### Payment Flow

```
Buyer Wallet
    ↓
[Create Order]
    ↓
[Pay Order] → Solana Transfer (via Web3.js)
    ↓
Seller Wallet (receives SOL immediately)
    ↓
[Database Records Transaction Hash]
    ↓
Order marked "in_progress"
    ↓
[Seller Delivers Work]
    ↓
[Buyer Reviews & Approves]
    ↓
Order marked "completed"
    ↓
Freelancer keeps 100% of SOL earned
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** or **yarn**
- **Phantom Wallet** ([Install](https://phantom.app)) or Solflare
- **PlanetScale Account** ([Sign up](https://planetscale.com)) - Free tier available
- **Helius API Key** ([Get](https://helius.xyz)) - Optional for NFT fetching

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/talent-pool.git
cd talent-pool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="mysql://root:password@host/talent_pool"

SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

HELIUS_API_KEY="your_helius_api_key"
```

### 4. Setup Database

**Using PlanetScale:**
```bash
npm run db:generate
npm run db:push
```

**Or local MySQL:**
```bash
mysql -u root -p
CREATE DATABASE talent_pool;

npm run db:generate
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📱 Pages & Routes

### Public Pages
- `/` - Marketplace (browse all gigs)
- `/gigs/:id` - Gig detail page

### Authenticated Pages (Requires Wallet)
- `/gigs/create` - Create new gig
- `/gigs/:id/edit` - Edit your gig
- `/orders` - My orders (buying + selling)
- `/orders/:id` - Order detail & tracking
- `/profile/:walletAddress` - Public profile & portfolio
- `/profile/settings` - Edit your profile

### API Endpoints

**Gigs**
- `GET /api/gigs` - List gigs (paginated, filterable)
- `POST /api/gigs` - Create gig
- `GET /api/gigs/:id` - Get gig details
- `PUT /api/gigs/:id` - Update gig
- `DELETE /api/gigs/:id` - Delete gig (soft delete)
- `GET /api/gigs/:id/reviews` - Get gig reviews

**Orders**
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/pay` - Record payment (SOL transfer)
- `POST /api/orders/:id/deliver` - Mark work as delivered
- `POST /api/orders/:id/complete` - Approve & complete order
- `POST /api/orders/:id/review` - Leave review

**Users**
- `GET /api/users/:address/profile` - Get user profile
- `PUT /api/users/:address/profile` - Update profile
- `GET /api/users/:address/gigs` - Get user's gigs
- `GET /api/users/:address/orders/buying` - Get buy orders
- `GET /api/users/:address/orders/selling` - Get sell orders
- `GET /api/users/:address/badges` - Get earned badges
- `POST /api/users/:address/badges/mint` - Mint reputation NFT
- `GET /api/users/:address/reviews` - Get reviews about user

---

## 💻 Project Structure

```
talent-pool/
├── src/
│   ├── app/                      # Next.js pages and API routes
│   │   ├── api/                  # REST API endpoints
│   │   │   ├── gigs/
│   │   │   ├── orders/
│   │   │   └── users/
│   │   ├── gigs/                 # Pages: marketplace, detail, create
│   │   ├── orders/               # Pages: dashboard, order detail
│   │   ├── profile/              # Pages: public, settings
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/               # React components
│   │   ├── GigCard.tsx
│   │   ├── GigForm.tsx
│   │   ├── OrderCard.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── WalletConnect.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── db/                       # Database layer
│   │   ├── schema.ts             # Drizzle ORM tables
│   │   └── client.ts             # DB connection
│   ├── hooks/                    # Custom React hooks
│   │   ├── useGigs.ts
│   │   ├── useOrders.ts
│   │   ├── useReviews.ts
│   │   ├── useProfile.ts
│   │   └── useBadges.ts
│   ├── lib/                      # Utilities and services
│   │   ├── services/
│   │   │   ├── gigService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── reviewService.ts
│   │   │   └── blockchainService.ts
│   │   ├── validators.ts         # Zod schemas
│   │   ├── blockchain.ts         # Web3.js utilities
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (git ignored)
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── next.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🔐 Security & Best Practices

### Input Validation
- All API inputs validated with Zod schemas
- Type-safe requests and responses
- Prevents injection attacks

### Authentication
- Wallet signature verification via header
- X-Wallet-Address header required for mutations
- Only creator can update/delete own content

### Database
- Parameterized queries via Drizzle ORM
- No raw SQL strings
- SQL injection protection

### Code Quality
- Full TypeScript, no `any` types
- Reusable services for business logic
- Component composition for DRY UI
- Proper error handling in all routes

---

## 🏆 NFT Badge System

Auto-mint achievement badges when freelancers meet criteria:

### Badge Types
- **Top Rated** - Average rating ≥ 4.8 stars
- **Fast Delivery** - 50+ orders completed on-time
- **Expert [Category]** - 20+ gigs completed in a category
- **Trusted Freelancer** - Total earnings ≥ $1000 (≈7 SOL)

### Badge Metadata (On-Chain)
```json
{
  "name": "Top Rated Badge",
  "description": "Earned for maintaining 4.8+ star rating",
  "image": "ipfs://...",
  "attributes": [
    {
      "trait_type": "Badge Type",
      "value": "top_rated"
    }
  ]
}
```

---

## 🚀 Deployment

### Deploy to Vercel

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial TalentPool deployment"
git push origin main
```

**Step 2: Create Vercel Project**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Import"

**Step 3: Set Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL = mysql://...
SOLANA_RPC_URL = https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL = https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK = devnet
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
HELIUS_API_KEY = (optional)
```

**Step 4: Deploy**
```bash
vercel --prod
```

### Deploy Database to PlanetScale

- Sign up at [planetscale.com](https://planetscale.com)
- Create database
- Copy connection string to Vercel environment
- Run: `npm run db:push`

---

## 📊 Database Schema

**Gigs Table**
```
- id, creator_wallet_address, title, description
- category, price_in_sol, delivery_days_max
- image_url, status (active/paused/archived)
- average_rating, total_reviews, total_completed_orders
```

**Orders Table**
```
- id, gig_id, buyer_address, seller_address
- price_agreed, status (pending/in_progress/delivered/completed)
- payment_tx_hash, delivery_deadline
- created_at, delivered_at, completed_at
```

**Reviews Table**
```
- id, order_id, reviewer_address
- rating (1-5), comment
- nft_badge_address (optional)
```

**User Profiles Table**
```
- wallet_address, display_name, bio
- profile_image_url, category
- total_earned, total_orders, average_rating
```

---

## 💰 Pricing Model

### For Freelancers
- **Commission: 0%**
- **Payment: Instant** (no 5-7 day wait)
- **Fees: None** (only Solana network costs ~$0.00025)

### Comparison
| Feature | TalentPool | Fiverr | Upwork |
|---------|-----------|--------|--------|
| Commission | 0% | 20-30% | 5-20% |
| Payment Speed | Instant | 5-7 days | 7-14 days |
| Platform Fee | None | Yes | Yes |
| Global Access | Yes | ID required | Bank required |
| Wallet Support | Solana | None | None |

---

## 📚 Resources

- [Solana Docs](https://docs.solana.com)
- [Next.js 14](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [PlanetScale](https://planetscale.com/docs)

---

## 📜 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Built on [Solana](https://solana.com)
- Deployed via [Vercel](https://vercel.com)
- Inspired by [Fiverr](https://fiverr.com) and [Upwork](https://upwork.com)

---

## 📧 Support

- **Email:** support@talentpool.app
- **GitHub Issues:** [Report Bug](https://github.com/talentpool/issues)

---

**Made with ❤️ for the Solana community**
