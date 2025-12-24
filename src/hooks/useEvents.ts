import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Event, EventAttendee, CreateEventInput, UpdateEventInput, PaginatedResponse, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http:

/**
 * Fetch all events with pagination and filtering
 */
export const useEvents = (
  page: number = 1,
  limit: number = 10,
  filters?: {
    category?: string;
    status?: string;
    searchQuery?: string;
    organizerWalletAddress?: string;
  }
) => {
  return useQuery({
    queryKey: ['events', page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.searchQuery) params.append('search', filters.searchQuery);
      if (filters?.organizerWalletAddress) params.append('organizer', filters.organizerWalletAddress);

      const response = await axios.get<{
        success: boolean;
        data: PaginatedResponse<Event>;
      }>(`${API_BASE}/api/events?${params.toString()}`);

      if (!response.data.success) {
        throw new Error('Failed to fetch events');
      }

      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, 
  });
};

/**
 * Fetch a single event by ID
 */
export const useEventDetail = (eventId: string | null, includeAttendees: boolean = false) => {
  return useQuery({
    queryKey: ['event', eventId, includeAttendees],
    queryFn: async () => {
      if (!eventId) return null;

      const params = new URLSearchParams();
      if (includeAttendees) params.append('includeAttendees', 'true');

      const response = await axios.get<{
        success: boolean;
        data: Event & { attendees?: EventAttendee[] };
      }>(`${API_BASE}/api/events/${eventId}?${params.toString()}`);

      if (!response.data.success) {
        throw new Error('Failed to fetch event');
      }

      return response.data.data;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new event
 */
export const useCreateEvent = (walletAddress: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const response = await axios.post<ApiResponse<Event>>(`${API_BASE}/api/events`, input, {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to create event');
      }

      return response.data.data!;
    },
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      queryClient.setQueryData(['event', data.id], data);
    },
  });
};

/**
 * Update an event
 */
export const useUpdateEvent = (eventId: string, walletAddress: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateEventInput) => {
      const response = await axios.put<ApiResponse<Event | null>>(`${API_BASE}/api/events/${eventId}`, input, {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to update event');
      }

      return response.data.data!;
    },
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.setQueryData(['event', eventId], data);
    },
  });
};

/**
 * Delete an event
 */
export const useDeleteEvent = (walletAddress: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await axios.delete<{
        success: boolean;
      }>(`${API_BASE}/api/events/${eventId}`, {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (!response.data.success) {
        throw new Error('Failed to delete event');
      }

      return eventId;
    },
    onSuccess: (eventId) => {
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.removeQueries({ queryKey: ['event', eventId] });
    },
  });
};

/**
 * Register for an event
 */
export const useRegisterEvent = (eventId: string, walletAddress: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentTxHash?: string) => {
      const response = await axios.post<ApiResponse<EventAttendee>>(`${API_BASE}/api/events/${eventId}/attendees`, { paymentTxHash }, {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to register for event');
      }

      return response.data.data!;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] });
    },
  });
};

/**
 * Get event attendees
 */
export const useEventAttendees = (eventId: string, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ['eventAttendees', eventId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await axios.get<{
        success: boolean;
        data: PaginatedResponse<EventAttendee>;
      }>(`${API_BASE}/api/events/${eventId}/attendees?${params.toString()}`);

      if (!response.data.success) {
        throw new Error('Failed to fetch attendees');
      }

      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, 
  });
};

/**
 * Check in an attendee
 */
export const useCheckInAttendee = (eventId: string, walletAddress: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendeeWalletAddress: string) => {
      const response = await axios.put<ApiResponse<EventAttendee>>(`${API_BASE}/api/events/${eventId}/attendees`, { attendeeWalletAddress }, {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to check in attendee');
      }

      return response.data.data!;
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['eventAttendees', eventId] });
    },
  });
};
