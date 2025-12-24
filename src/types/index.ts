export type GigStatus = 'active' | 'paused' | 'archived';
export type GigCategory = 'development' | 'design' | 'writing' | 'video' | 'tutoring' | 'other';

export type Gig = {
  id: string;
  creatorWalletAddress: string;
  title: string;
  description: string;
  category: GigCategory;
  priceInSol: string;
  deliveryDaysMax: number;
  imageUrl: string | null;
  portfolioUrl: string | null;
  status: GigStatus;
  totalCompletedOrders: number;
  averageRating: string | null;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateGigInput = {
  title: string;
  description: string;
  category: GigCategory;
  priceInSol: string;
  deliveryDaysMax: number;
  imageUrl?: string;
  portfolioUrl?: string;
};

export type UpdateGigInput = Partial<CreateGigInput> & { status?: GigStatus };

export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  gigId: string;
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  priceAgreed: string;
  status: OrderStatus;
  deliveryDeadline: Date;
  paymentTxHash: string | null;
  deliveredAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderInput = {
  gigId: string;
  buyerWalletAddress: string;
  deliveryDaysFromNow: number;
};

export type Review = {
  id: string;
  orderId: string;
  reviewerWalletAddress: string;
  rating: number;
  comment: string | null;
  nftBadgeAddress: string | null;
  createdAt: Date;
};

export type CreateReviewInput = {
  orderId: string;
  rating: number;
  comment?: string;
};

export type UserProfile = {
  id: string;
  walletAddress: string;
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  category: string | null;
  totalEarned: string;
  totalOrders: number;
  averageRating: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserProfileInput = {
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  category?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// Events Management Types
export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'conference' | 'workshop' | 'webinar' | 'networking' | 'concert' | 'sports' | 'art' | 'tech' | 'business' | 'education' | 'entertainment' | 'other';
export type AttendeeStatus = 'registered' | 'checked-in' | 'no-show' | 'cancelled';

export type Event = {
  id: string;
  organizerWalletAddress: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  isVirtual: boolean;
  startDate: Date;
  endDate: Date;
  capacity: number;
  attendeeCount: number;
  ticketPrice: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  status: EventStatus;
  canMintNFT: boolean;
  nftMetadata: string | null;
  totalRevenue: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type EventWithAttendees = Event & {
  attendees?: EventAttendee[];
};

export type EventAttendee = {
  id: string;
  eventId: string;
  attendeeWalletAddress: string;
  nftTicketMintAddress: string | null;
  paymentTxHash: string | null;
  ticketCheckInTime: Date | null;
  status: AttendeeStatus;
  createdAt: Date;
};

export type CreateEventInput = {
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  isVirtual: boolean;
  startDate: Date;
  endDate: Date;
  capacity: number;
  ticketPrice: string;
  imageUrl?: string;
  bannerUrl?: string;
  canMintNFT?: boolean;
  nftMetadata?: string;
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  status?: EventStatus;
};

export type RegisterEventInput = {
  eventId: string;
  paymentTxHash?: string;
};

export type CheckInInput = {
  eventId: string;
  attendeeWalletAddress: string;
};
