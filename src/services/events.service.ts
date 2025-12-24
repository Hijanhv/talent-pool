import { and, eq, desc, sql, gte } from 'drizzle-orm';
import { db } from '@/db/client';
import { events, eventAttendees } from '@/db/schema';
import { cache, CACHE_KEYS } from '@/lib/redis';
import type { Event, EventAttendee, CreateEventInput, UpdateEventInput, EventStatus, EventCategory } from '@/types';

const EVENT_DETAIL_CACHE_TTL = 1800; // 30 minutes

/**
 * Create a new event
 */
export const createEvent = async (organizerWalletAddress: string, input: CreateEventInput): Promise<Event> => {
  const eventId = crypto.randomUUID();

  await db
    .insert(events)
    .values({
      id: eventId,
      organizerWalletAddress,
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
      isVirtual: input.isVirtual,
      startDate: input.startDate,
      endDate: input.endDate,
      capacity: input.capacity,
      ticketPrice: input.ticketPrice,
      imageUrl: input.imageUrl || null,
      bannerUrl: input.bannerUrl || null,
      canMintNFT: input.canMintNFT || false,
      nftMetadata: input.nftMetadata || null,
      status: 'draft',
    } as any);

  // Invalidate list cache
  await cache.clearPattern('events:list:*');

  return getEventById(eventId) as Promise<Event>;
};

/**
 * Get event by ID
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  // Try cache first
  const cached = await cache.get<Event>(CACHE_KEYS.event(eventId));
  if (cached) return cached;

  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)
    .execute();

  if (!event || event.length === 0) return null;

  const eventData = event[0] as Event;

  // Cache the result
  await cache.set(CACHE_KEYS.event(eventId), eventData, EVENT_DETAIL_CACHE_TTL);

  return eventData;
};

/**
 * Get all events with pagination and filtering
 */
export const getEvents = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    category?: EventCategory;
    status?: EventStatus;
    searchQuery?: string;
    organizerWalletAddress?: string;
  }
): Promise<{ events: Event[]; total: number }> => {
  const offset = (page - 1) * limit;

  // Build where clause
  const whereConditions = [sql`${events.deletedAt} IS NULL`];

  if (filters?.status) {
    whereConditions.push(eq(events.status, filters.status));
  }

  if (filters?.category) {
    whereConditions.push(eq(events.category, filters.category));
  }

  if (filters?.organizerWalletAddress) {
    whereConditions.push(eq(events.organizerWalletAddress, filters.organizerWalletAddress));
  }

  if (filters?.searchQuery) {
    whereConditions.push(
      sql`(${events.title} LIKE ${`%${filters.searchQuery}%`} OR ${events.description} LIKE ${`%${filters.searchQuery}%`})`
    );
  }

  const whereClause = and(...whereConditions);

  // Get paginated results
  const results = await db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(desc(events.createdAt))
    .limit(limit)
    .offset(offset)
    .execute();

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`cast(count(*) as char)` })
    .from(events)
    .where(whereClause)
    .execute();

  const total = parseInt(countResult[0]?.count as any, 10) || 0;

  return {
    events: results as Event[],
    total,
  };
};

/**
 * Update an event
 */
export const updateEvent = async (eventId: string, input: UpdateEventInput): Promise<Event | null> => {
  const updateData: Record<string, any> = {};

  if (input.title) updateData.title = input.title;
  if (input.description) updateData.description = input.description;
  if (input.category) updateData.category = input.category;
  if (input.location) updateData.location = input.location;
  if (input.isVirtual !== undefined) updateData.isVirtual = input.isVirtual;
  if (input.startDate) updateData.startDate = input.startDate;
  if (input.endDate) updateData.endDate = input.endDate;
  if (input.capacity) updateData.capacity = input.capacity;
  if (input.ticketPrice) updateData.ticketPrice = input.ticketPrice;
  if (input.imageUrl) updateData.imageUrl = input.imageUrl;
  if (input.bannerUrl) updateData.bannerUrl = input.bannerUrl;
  if (input.canMintNFT !== undefined) updateData.canMintNFT = input.canMintNFT;
  if (input.nftMetadata) updateData.nftMetadata = input.nftMetadata;
  if (input.status) updateData.status = input.status;

  updateData.updatedAt = new Date();

  await db
    .update(events)
    .set(updateData)
    .where(eq(events.id, eventId))
    .execute();

  // Invalidate caches
  await cache.del(CACHE_KEYS.event(eventId));
  await cache.clearPattern('events:list:*');

  return getEventById(eventId);
};

/**
 * Delete an event (soft delete)
 */
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  await db
    .update(events)
    .set({ deletedAt: new Date() })
    .where(eq(events.id, eventId))
    .execute();

  // Invalidate caches
  await cache.del(CACHE_KEYS.event(eventId));
  await cache.clearPattern('events:list:*');

  return true;
};

/**
 * Register an attendee for an event
 */
export const registerAttendee = async (
  eventId: string,
  attendeeWalletAddress: string,
  paymentTxHash?: string
): Promise<EventAttendee> => {
  const attendeeId = crypto.randomUUID();

  await db
    .insert(eventAttendees)
    .values({
      id: attendeeId,
      eventId,
      attendeeWalletAddress,
      paymentTxHash: paymentTxHash || null,
      status: 'registered',
    } as any)
    .execute();

  // Update attendee count
  const event = await getEventById(eventId);
  if (event) {
    await db
      .update(events)
      .set({
        attendeeCount: event.attendeeCount + 1,
        totalRevenue: String(parseFloat(event.totalRevenue) + parseFloat(event.ticketPrice)),
      })
      .where(eq(events.id, eventId))
      .execute();

    // Invalidate caches
    await cache.del(CACHE_KEYS.event(eventId));
  }

  return getAttendeeById(attendeeId) as Promise<EventAttendee>;
};

/**
 * Get attendee by ID
 */
export const getAttendeeById = async (attendeeId: string): Promise<EventAttendee | null> => {
  const attendee = await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.id, attendeeId))
    .limit(1)
    .execute();

  if (!attendee || attendee.length === 0) return null;
  return attendee[0] as EventAttendee;
};

/**
 * Get event attendees with pagination
 */
export const getEventAttendees = async (
  eventId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ attendees: EventAttendee[]; total: number }> => {
  const offset = (page - 1) * limit;

  const attendeeList = await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId))
    .limit(limit)
    .offset(offset)
    .execute();

  const countResult = await db
    .select({ count: sql<number>`cast(count(*) as char)` })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId))
    .execute();

  const total = parseInt(countResult[0]?.count as any, 10) || 0;

  return {
    attendees: attendeeList as EventAttendee[],
    total,
  };
};

/**
 * Check in an attendee
 */
export const checkInAttendee = async (eventId: string, attendeeWalletAddress: string): Promise<EventAttendee | null> => {
  const attendee = await db
    .select()
    .from(eventAttendees)
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.attendeeWalletAddress, attendeeWalletAddress)
      )
    )
    .limit(1)
    .execute();

  if (!attendee || attendee.length === 0) return null;

  await db
    .update(eventAttendees)
    .set({
      status: 'checked-in',
      ticketCheckInTime: new Date(),
    })
    .where(eq(eventAttendees.id, attendee[0].id))
    .execute();

  // Invalidate attendee caches
  await cache.clearPattern(`event:${eventId}:attendees:*`);

  return getAttendeeById(attendee[0].id) as Promise<EventAttendee>;
};

/**
 * Update attendee NFT mint address (after minting NFT ticket)
 */
export const updateAttendeeNFTMint = async (attendeeId: string, nftMintAddress: string): Promise<EventAttendee | null> => {
  await db
    .update(eventAttendees)
    .set({ nftTicketMintAddress: nftMintAddress })
    .where(eq(eventAttendees.id, attendeeId))
    .execute();

  return getAttendeeById(attendeeId);
};

/**
 * Get upcoming events (events that haven't started yet)
 */
export const getUpcomingEvents = async (limit: number = 10): Promise<Event[]> => {
  const now = new Date();

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(
      and(
        gte(events.startDate, now),
        eq(events.status, 'published'),
        sql`${events.deletedAt} IS NULL`
      )
    )
    .orderBy(events.startDate)
    .limit(limit)
    .execute();

  return upcomingEvents as Event[];
};

/**
 * Get events by organizer
 */
export const getEventsByOrganizer = async (
  organizerWalletAddress: string,
  page: number = 1,
  limit: number = 20
): Promise<{ events: Event[]; total: number }> => {
  return getEvents(page, limit, { organizerWalletAddress });
};
