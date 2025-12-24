import { z } from 'zod';

export const createGigSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  category: z.enum(['development', 'design', 'writing', 'video', 'tutoring', 'other'] as const),
  priceInSol: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Price must be a positive number'
  ),
  deliveryDaysMax: z.number().int().min(1, 'Delivery time must be at least 1 day').max(30),
  imageUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
});

export const updateGigSchema = createGigSchema.partial().extend({
  status: z.enum(['active', 'paused', 'archived']).optional(),
});

export type CreateGigRequest = z.infer<typeof createGigSchema>;
export type UpdateGigRequest = z.infer<typeof updateGigSchema>;

export const createOrderSchema = z.object({
  gigId: z.string().uuid('Invalid gig ID'),
  buyerWalletAddress: z.string().regex(/^[1-9A-HJ-NP-Z]{32,44}$/, 'Invalid Solana wallet address'),
  deliveryDaysFromNow: z.number().int().min(1).max(30),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;

export const createReviewSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

export const updateUserProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  profileImageUrl: z.string().url().optional(),
  category: z.enum(['development', 'design', 'writing', 'video', 'tutoring', 'other']).optional(),
});

export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileSchema>;

export const paginationSchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().int().positive()),
  pageSize: z.string().default('10').transform(Number).pipe(z.number().int().min(1).max(100)),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  sortBy: z.enum(['newest', 'price_low', 'price_high', 'rating']).default('newest'),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
