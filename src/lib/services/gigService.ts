import { db } from '@/db/client';
import { gigs, orders, reviews } from '@/db/schema';
import { eq, and, desc, gte, lte, isNull, sql } from 'drizzle-orm';
import { Gig, CreateGigInput, UpdateGigInput, PaginatedResponse } from '@/types';
import { PaginationQuery } from '@/lib/validators';

export class GigService {
  static async createGig(creatorWalletAddress: string, input: CreateGigInput): Promise<Gig> {
    const newGigId = crypto.randomUUID();

    await db
      .insert(gigs)
      .values({
        id: newGigId,
        creatorWalletAddress,
        title: input.title,
        description: input.description,
        category: input.category,
        priceInSol: input.priceInSol,
        deliveryDaysMax: input.deliveryDaysMax,
        imageUrl: input.imageUrl || null,
        portfolioUrl: input.portfolioUrl || null,
      });

    const newGig = await db.select().from(gigs).where(eq(gigs.id, newGigId));
    return newGig[0] as Gig;
  }

  static async getGigs(query: PaginationQuery): Promise<PaginatedResponse<Gig>> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const whereConditions: any[] = [isNull(gigs.deletedAt), eq(gigs.status, 'active')];

    if (query.search) {
      whereConditions.push(
        sql`${gigs.title} LIKE ${`%${query.search}%`} OR ${gigs.description} LIKE ${`%${query.search}%`}`
      );
    }

    if (query.category) {
      whereConditions.push(eq(gigs.category, query.category as any));
    }

    if (query.minPrice) {
      whereConditions.push(gte(gigs.priceInSol, query.minPrice.toString()));
    }

    if (query.maxPrice) {
      whereConditions.push(lte(gigs.priceInSol, query.maxPrice.toString()));
    }

    let orderBy = desc(gigs.createdAt);
    if (query.sortBy === 'price_low') {
      orderBy = sql`${gigs.priceInSol} ASC`;
    } else if (query.sortBy === 'price_high') {
      orderBy = sql`${gigs.priceInSol} DESC`;
    } else if (query.sortBy === 'rating') {
      orderBy = desc(gigs.averageRating);
    }

    const [{ total }] = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(gigs)
      .where(and(...whereConditions));

    const gigsList = await db
      .select()
      .from(gigs)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset);

    return {
      data: gigsList as Gig[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getGigById(gigId: string): Promise<Gig | null> {
    const [gig] = await db.select().from(gigs).where(eq(gigs.id, gigId));
    return (gig as Gig) || null;
  }

  static async updateGig(gigId: string, input: UpdateGigInput): Promise<Gig> {
    await db
      .update(gigs)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(gigs.id, gigId));

    const updatedGig = await db.select().from(gigs).where(eq(gigs.id, gigId));
    return updatedGig[0] as Gig;
  }

  static async deleteGig(gigId: string): Promise<void> {
    await db
      .update(gigs)
      .set({ deletedAt: new Date() })
      .where(eq(gigs.id, gigId));
  }

  static async getGigsByCreator(walletAddress: string): Promise<Gig[]> {
    const results = await db
      .select()
      .from(gigs)
      .where(and(eq(gigs.creatorWalletAddress, walletAddress), isNull(gigs.deletedAt)))
      .orderBy(desc(gigs.createdAt));

    return results as Gig[];
  }

  static async updateGigRating(gigId: string): Promise<void> {
    const reviewsData = await db
      .select({
        avgRating: sql<string>`AVG(rating)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .innerJoin(orders, eq(reviews.orderId, orders.id))
      .where(eq(orders.gigId, gigId));

    if (reviewsData[0]) {
      await db
        .update(gigs)
        .set({
          averageRating: reviewsData[0].avgRating,
          totalReviews: reviewsData[0].count,
        })
        .where(eq(gigs.id, gigId));
    }
  }
}
