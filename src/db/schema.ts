import { mysqlTable, varchar, text, decimal, timestamp, int, boolean, index, foreignKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const gigs = mysqlTable(
  'gigs',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    creatorWalletAddress: varchar('creator_wallet_address', { length: 44 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    priceInSol: decimal('price_in_sol', { precision: 18, scale: 8 }).notNull(),
    deliveryDaysMax: int('delivery_days_max').notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    portfolioUrl: varchar('portfolio_url', { length: 500 }),
    status: varchar('status', { length: 20 }).default('active').notNull(),
    totalCompletedOrders: int('total_completed_orders').default(0),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
    totalReviews: int('total_reviews').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    creatorIdx: index('creator_idx').on(table.creatorWalletAddress),
    statusIdx: index('status_idx').on(table.status),
    categoryIdx: index('category_idx').on(table.category),
  })
);

export const orders = mysqlTable(
  'orders',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    gigId: varchar('gig_id', { length: 36 }).notNull(),
    buyerWalletAddress: varchar('buyer_wallet_address', { length: 44 }).notNull(),
    sellerWalletAddress: varchar('seller_wallet_address', { length: 44 }).notNull(),
    priceAgreed: decimal('price_agreed', { precision: 18, scale: 8 }).notNull(),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    deliveryDeadline: timestamp('delivery_deadline').notNull(),
    paymentTxHash: varchar('payment_tx_hash', { length: 88 }),
    deliveredAt: timestamp('delivered_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    gigIdx: index('gig_idx').on(table.gigId),
    buyerIdx: index('buyer_idx').on(table.buyerWalletAddress),
    sellerIdx: index('seller_idx').on(table.sellerWalletAddress),
    statusIdx: index('order_status_idx').on(table.status),
    fk_gig: foreignKey({ columns: [table.gigId], foreignColumns: [gigs.id] }).onDelete('cascade'),
  })
);

export const proposals = mysqlTable(
  'proposals',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    gigId: varchar('gig_id', { length: 36 }).notNull(),
    freelancerWalletAddress: varchar('freelancer_wallet_address', { length: 44 }).notNull(),
    message: text('message').notNull(),
    portfolioUrl: varchar('portfolio_url', { length: 500 }),
    proposedPrice: decimal('proposed_price', { precision: 18, scale: 8 }),
    proposedDeliveryDays: int('proposed_delivery_days'),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    gigIdx: index('proposal_gig_idx').on(table.gigId),
    freelancerIdx: index('freelancer_idx').on(table.freelancerWalletAddress),
    fk_gig: foreignKey({ columns: [table.gigId], foreignColumns: [gigs.id] }).onDelete('cascade'),
  })
);

export const reviews = mysqlTable(
  'reviews',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: varchar('order_id', { length: 36 }).notNull(),
    reviewerWalletAddress: varchar('reviewer_wallet_address', { length: 44 }).notNull(),
    rating: int('rating').notNull(),
    comment: text('comment'),
    nftBadgeAddress: varchar('nft_badge_address', { length: 44 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    orderIdx: index('review_order_idx').on(table.orderId),
    reviewerIdx: index('reviewer_idx').on(table.reviewerWalletAddress),
    fk_order: foreignKey({ columns: [table.orderId], foreignColumns: [orders.id] }).onDelete('cascade'),
  })
);

export const userProfiles = mysqlTable(
  'user_profiles',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    walletAddress: varchar('wallet_address', { length: 44 }).primaryKey().notNull(),
    displayName: varchar('display_name', { length: 100 }),
    bio: text('bio'),
    profileImageUrl: varchar('profile_image_url', { length: 500 }),
    category: varchar('category', { length: 50 }),
    totalEarned: decimal('total_earned', { precision: 18, scale: 8 }).default('0'),
    totalOrders: int('total_orders').default(0),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    walletIdx: index('wallet_idx').on(table.walletAddress),
  })
);

export const nftBadges = mysqlTable(
  'nft_badges',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    freelancerWalletAddress: varchar('freelancer_wallet_address', { length: 44 }).notNull(),
    badgeType: varchar('badge_type', { length: 50 }).notNull(),
    mintAddress: varchar('mint_address', { length: 44 }).notNull(),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    freelancerIdx: index('badge_freelancer_idx').on(table.freelancerWalletAddress),
    badgeTypeIdx: index('badge_type_idx').on(table.badgeType),
  })
);

export const gigsRelations = relations(gigs, ({ many }) => ({
  orders: many(orders),
  proposals: many(proposals),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  gig: one(gigs, {
    fields: [orders.gigId],
    references: [gigs.id],
  }),
  reviews: many(reviews),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  gig: one(gigs, {
    fields: [proposals.gigId],
    references: [gigs.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

// Events Management Tables
export const events = mysqlTable(
  'events',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizerWalletAddress: varchar('organizer_wallet_address', { length: 44 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    location: varchar('location', { length: 500 }).notNull(),
    isVirtual: boolean('is_virtual').default(false).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    capacity: int('capacity').notNull(),
    attendeeCount: int('attendee_count').default(0).notNull(),
    ticketPrice: decimal('ticket_price', { precision: 18, scale: 8 }).notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    bannerUrl: varchar('banner_url', { length: 500 }),
    status: varchar('status', { length: 20 }).default('draft').notNull(), // draft, published, ongoing, completed, cancelled
    canMintNFT: boolean('can_mint_nft').default(false).notNull(),
    nftMetadata: text('nft_metadata'), // JSON string for NFT metadata
    totalRevenue: decimal('total_revenue', { precision: 18, scale: 8 }).default('0').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table: any) => ({
    organizerIdx: index('organizer_idx').on(table.organizerWalletAddress),
    statusIdx: index('event_status_idx').on(table.status),
    categoryIdx: index('event_category_idx').on(table.category),
    startDateIdx: index('start_date_idx').on(table.startDate),
  })
);

export const eventAttendees = mysqlTable(
  'event_attendees',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    eventId: varchar('event_id', { length: 36 }).notNull(),
    attendeeWalletAddress: varchar('attendee_wallet_address', { length: 44 }).notNull(),
    nftTicketMintAddress: varchar('nft_ticket_mint_address', { length: 44 }),
    paymentTxHash: varchar('payment_tx_hash', { length: 88 }),
    ticketCheckInTime: timestamp('ticket_check_in_time'),
    status: varchar('status', { length: 20 }).default('registered').notNull(), // registered, checked-in, no-show, cancelled
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table: any) => ({
    eventIdx: index('attendee_event_idx').on(table.eventId),
    attendeeIdx: index('attendee_wallet_idx').on(table.attendeeWalletAddress),
    statusIdx: index('attendee_status_idx').on(table.status),
    fk_event: foreignKey({ columns: [table.eventId], foreignColumns: [events.id] }).onDelete('cascade'),
  })
);

export const eventCategoriesEnum = [
  'conference',
  'workshop',
  'webinar',
  'networking',
  'concert',
  'sports',
  'art',
  'tech',
  'business',
  'education',
  'entertainment',
  'other',
] as const;

// Relations for Events
export const eventsRelations = relations(events, ({ many }: any) => ({
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }: any) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
}));
