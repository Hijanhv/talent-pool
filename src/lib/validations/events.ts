import { z } from 'zod';


export const EVENT_CATEGORIES = [
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

export const EVENT_STATUSES = ['draft', 'published', 'ongoing', 'completed', 'cancelled'] as const;
export const ATTENDEE_STATUSES = ['registered', 'checked-in', 'no-show', 'cancelled'] as const;


export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${EVENT_CATEGORIES.join(', ')}` }),
  }),
  location: z.string().min(3, 'Location must be at least 3 characters').max(500),
  isVirtual: z.boolean().default(false),
  startDate: z.coerce.date().refine((date) => date > new Date(), 'Start date must be in the future'),
  endDate: z.coerce.date(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(1000000, 'Capacity must be less than 1 million'),
  ticketPrice: z.string().regex(/^\d+(\.\d{1,8})?$/, 'Invalid ticket price format'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  bannerUrl: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  canMintNFT: z.boolean().default(false),
  nftMetadata: z.string().optional().or(z.literal('')),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const updateEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must be less than 5000 characters').optional(),
  category: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${EVENT_CATEGORIES.join(', ')}` }),
  }).optional(),
  location: z.string().min(3, 'Location must be at least 3 characters').max(500).optional(),
  isVirtual: z.boolean().optional(),
  startDate: z.coerce.date().refine((date) => date > new Date(), 'Start date must be in the future').optional(),
  endDate: z.coerce.date().optional(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(1000000, 'Capacity must be less than 1 million').optional(),
  ticketPrice: z.string().regex(/^\d+(\.\d{1,8})?$/, 'Invalid ticket price format').optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  bannerUrl: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  canMintNFT: z.boolean().optional(),
  nftMetadata: z.string().optional().or(z.literal('')),
  status: z.enum(EVENT_STATUSES).optional(),
});


export const registerEventSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  paymentTxHash: z.string().optional(),
});


export const checkInSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  attendeeWalletAddress: z.string().min(32, 'Invalid wallet address'),
});


export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type RegisterEventInput = z.infer<typeof registerEventSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
