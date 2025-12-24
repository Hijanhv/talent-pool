import { db } from '@/db/client';
import { reviews, orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Review, CreateReviewInput } from '@/types';

export class ReviewService {
  static async createReview(
    orderId: string,
    reviewerWalletAddress: string,
    input: CreateReviewInput
  ): Promise<Review> {
    const newReviewId = crypto.randomUUID();
    await db
      .insert(reviews)
      .values({
        id: newReviewId,
        orderId,
        reviewerWalletAddress,
        rating: input.rating,
        comment: input.comment || null,
      });

    const [newReview] = await db.select().from(reviews).where(eq(reviews.id, newReviewId));
    return newReview as Review;
  }

  static async getReviewsForGig(gigId: string): Promise<any[]> {
    return db
      .select()
      .from(reviews)
      .innerJoin(orders, eq(reviews.orderId, orders.id))
      .where(eq(orders.gigId, gigId))
      .orderBy(desc(reviews.createdAt));
  }

  static async getReviewByOrder(orderId: string): Promise<Review | null> {
    const [review] = await db.select().from(reviews).where(eq(reviews.orderId, orderId));
    return (review as Review) || null;
  }

  static async getReviewsByFreelancer(walletAddress: string): Promise<Review[]> {
    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.reviewerWalletAddress, walletAddress))
      .orderBy(desc(reviews.createdAt));
    return results as Review[];
  }
}
