# Events Management Module Documentation

## Overview

The Events Management module is a comprehensive, production-ready system for creating, managing, and attending events with Web3 integration for NFT tickets. Built with Next.js, TypeScript, React Query, Drizzle ORM, and Solana Web3.js.

## Architecture

### Database Schema

#### Events Table
```typescript
- id: UUID (Primary Key)
- organizerWalletAddress: Solana wallet address
- title: Event title (max 255 chars)
- description: Event description
- category: Conference, Workshop, Webinar, etc.
- location: Physical location or virtual meeting link
- isVirtual: Boolean flag for virtual events
- startDate: Event start timestamp
- endDate: Event end timestamp
- capacity: Max attendees allowed
- attendeeCount: Current number of attendees
- ticketPrice: Price in SOL
- imageUrl: Event image/poster
- bannerUrl: Event banner image
- status: draft | published | ongoing | completed | cancelled
- canMintNFT: Enable NFT ticket generation
- nftMetadata: JSON metadata for NFTs
- totalRevenue: Total ticket sales in SOL
- createdAt, updatedAt, deletedAt: Audit timestamps
```

#### Event Attendees Table
```typescript
- id: UUID (Primary Key)
- eventId: FK to events table
- attendeeWalletAddress: Solana wallet address
- nftTicketMintAddress: NFT mint address (if minted)
- paymentTxHash: Solana transaction hash
- ticketCheckInTime: Check-in timestamp
- status: registered | checked-in | no-show | cancelled
- createdAt: Registration timestamp
```

### API Endpoints

#### Events CRUD
- `GET /api/events` - List all events with pagination and filtering
- `POST /api/events` - Create a new event (requires wallet header)
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (owner only)
- `DELETE /api/events/[id]` - Delete event (owner only, soft delete)

#### Attendee Management
- `GET /api/events/[id]/attendees` - List event attendees
- `POST /api/events/[id]/attendees` - Register for event
- `PUT /api/events/[id]/attendees` - Check in attendee (organizer only)

#### NFT Integration
- `POST /api/events/[id]/mint-nft` - Prepare NFT minting

### Caching Strategy

Using Redis with strategic TTL:
- Event list: 1 hour (3600s)
- Event details: 30 minutes (1800s)
- Attendee lists: 2 minutes (120s)

Cache invalidation occurs on:
- Event creation
- Event update
- Event deletion
- New attendee registration
- Attendee check-in

### Frontend Architecture

#### Components
1. **EventCard** - Reusable event card with animations
2. **EventForm** - Event creation/editing form with Zod validation
3. **Wallet Integration** - Solana wallet adapter setup

#### Pages
1. `/events` - Events list with filtering and search
2. `/events/create` - Create new event page
3. `/events/[id]` - Event detail page with registration

#### Hooks
- `useEvents` - Fetch paginated events
- `useEventDetail` - Fetch single event
- `useCreateEvent` - Create event mutation
- `useUpdateEvent` - Update event mutation
- `useDeleteEvent` - Delete event mutation
- `useRegisterEvent` - Register for event
- `useCheckInAttendee` - Check in attendee

## Features

### Core Features
✅ Create, read, update, delete events
✅ Event filtering by category and status
✅ Search functionality
✅ Pagination support
✅ Attendee registration and management
✅ Check-in functionality for event organizers
✅ Soft delete for events (preserves data)

### Web3 Features
✅ Solana wallet integration
✅ NFT ticket generation (structure prepared)
✅ Wallet-based authentication headers
✅ Transaction hash tracking

### User Experience
✅ Responsive design (mobile, tablet, desktop)
✅ Framer Motion animations
✅ Real-time capacity tracking
✅ Loading and error states
✅ Form validation with Zod
✅ Pagination with page numbers

## Code Quality

### Type Safety
- Full TypeScript implementation with strict mode
- Type aliases for domain models
- Zod schemas for runtime validation
- Strong typing for API responses

### Architecture Patterns
- Service layer for business logic
- Repository pattern via Drizzle ORM
- Custom hooks for data fetching
- Component composition with Framer Motion
- Separation of concerns

### Best Practices
- Error handling at API and service layers
- Input validation with Zod
- Cache key generation utilities
- Secure ownership verification
- Transaction audit trails with timestamps

## Setup & Configuration

### Environment Variables

Create `.env.local`:
```env
# Database
DATABASE_URL="mysql://user:password@host/database"

# Redis (Optional)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your_password"
REDIS_DB="0"

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

1. Generate migrations:
```bash
npm run db:generate
```

2. Push to database:
```bash
npm run db:push
```

3. View database studio:
```bash
npm run db:studio
```

## Usage Examples

### Creating an Event (Frontend)

```typescript
import { useCreateEvent } from '@/hooks/useEvents';
import { useWallet } from '@solana/wallet-adapter-react';

function CreateEventComponent() {
  const { publicKey } = useWallet();
  const createEvent = useCreateEvent(publicKey?.toBase58() || null);

  const handleCreate = async () => {
    await createEvent.mutateAsync({
      title: 'Web3 Conference 2024',
      description: 'Annual Web3 conference',
      category: 'conference',
      location: 'San Francisco, CA',
      isVirtual: false,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-02'),
      capacity: 500,
      ticketPrice: '0.5',
      canMintNFT: true,
    });
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Fetching Events (Frontend)

```typescript
import { useEvents } from '@/hooks/useEvents';

function EventsListComponent() {
  const { data, isLoading } = useEvents(1, 20, {
    category: 'conference',
    status: 'published',
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
```

### API Usage

```bash
# List events
curl http://localhost:3000/api/events?page=1&limit=10&category=conference

# Create event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: YOUR_WALLET_ADDRESS" \
  -d '{
    "title": "My Event",
    "description": "Event description",
    "category": "workshop",
    "location": "Online",
    "isVirtual": true,
    "startDate": "2024-06-01T10:00:00Z",
    "endDate": "2024-06-01T12:00:00Z",
    "capacity": 100,
    "ticketPrice": "1.0"
  }'

# Register for event
curl -X POST http://localhost:3000/api/events/EVENT_ID/attendees \
  -H "Content-Type: application/json" \
  -H "x-wallet-address: YOUR_WALLET_ADDRESS" \
  -d '{}'
```

## Web3 Integration

### Solana Wallet Connection

Events require Solana wallet integration via `@solana/wallet-adapter-react`:

```typescript
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

<WalletProvider wallets={wallets}>
  <WalletMultiButton />
  {/* Events components */}
</WalletProvider>
```

### NFT Ticket Minting

NFT minting is prepared in `/lib/solana/nft-service.ts`:

```typescript
import { mintNFTTicket, getEventNFTMetadata } from '@/lib/solana/nft-service';

// Mint NFT for event attendee
const result = await mintNFTTicket({
  connection: new Connection(RPC_URL),
  payer: keypair,
  owner: attendeeWallet,
  eventName: 'My Event',
  eventId: 'event-123',
  attendeeAddress: 'attendee-wallet',
});

console.log(result.mint); // NFT mint address
```

## Performance Optimization

### Pagination
- Configurable page size (default 10, max 100)
- Total count for UI pagination
- Offset-based pagination for scalability

### Caching
- Redis integration for frequently accessed data
- Cache invalidation on mutations
- Pattern-based cache clearing

### Database Queries
- Indexed columns: organizer, status, category, startDate
- Efficient Drizzle ORM queries
- Soft deletes with filtered queries

### Frontend
- React Query for automatic caching
- Framer Motion for optimized animations
- Image lazy loading
- Code splitting by page

## Security Considerations

### Authentication
- Wallet address verification via headers
- Owner verification for write operations
- No private keys stored server-side

### Data Validation
- Zod schemas for all inputs
- Type-safe API responses
- Wallet address format validation

### Database
- SQL injection protection via Drizzle ORM
- Parameterized queries
- Soft deletes for data recovery

## Deployment

### Vercel Deployment

1. Push to GitHub repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with `npm run build && npm start`

### Database Deployment

Use PlanetScale MySQL for production:
```bash
npm run db:push
```

### Redis Deployment

Consider managed Redis services:
- Vercel KV
- Redis Cloud
- Upstash

## Testing

### Manual Testing Checklist

- [ ] Create event with all fields
- [ ] Edit event as owner
- [ ] Delete event as owner
- [ ] Register for event
- [ ] Filter events by category
- [ ] Search events by title
- [ ] Pagination works correctly
- [ ] Check-in attendee (organizer)
- [ ] Capacity tracking updates
- [ ] Error states display correctly
- [ ] Loading states work
- [ ] Animations are smooth
- [ ] Responsive on mobile/tablet/desktop

### API Testing

```bash
# Test all endpoints
npm test

# Run with coverage
npm test -- --coverage
```

## Monitoring & Logging

### Application Logs
- API error logging with context
- Database query logging
- Cache hit/miss tracking
- Transaction hash recording

### Key Metrics
- Event creation count
- Attendee registration count
- API response times
- Cache hit ratio
- Database query performance

## Future Enhancements

1. **Advanced NFT Features**
   - Full Metaplex integration
   - Custom NFT metadata
   - NFT transfer capabilities
   - Batch minting

2. **Payment Integration**
   - Stripe for fiat payments
   - SPL token support
   - Invoice generation
   - Refund handling

3. **Features**
   - Event reviews and ratings
   - Ticket resale marketplace
   - Event series/recurring events
   - Sponsorships and partnerships
   - Analytics dashboard

4. **Performance**
   - GraphQL API
   - Real-time updates with WebSocket
   - Advanced caching strategies
   - Database optimization

## Troubleshooting

### Common Issues

**Issue: Events list empty**
- Ensure events are published (status='published')
- Check filters aren't too restrictive
- Verify event data in database

**Issue: Wallet connection fails**
- Check NEXT_PUBLIC_SOLANA_RPC_URL
- Ensure wallet adapter is wrapped around components
- Check network is correct (devnet vs mainnet)

**Issue: Redis connection errors**
- Verify Redis server is running
- Check connection credentials
- Verify REDIS_HOST and REDIS_PORT
- Cache operations are non-blocking, so app works without Redis

**Issue: Database migration fails**
- Ensure DATABASE_URL is correct
- Check database user permissions
- Verify network connectivity
- Use `npm run db:studio` to diagnose

## Support

For issues and questions:
1. Check this documentation
2. Review the code comments
3. Check the codebase structure
4. Create an issue on GitHub

## License

MIT License - See LICENSE file for details
