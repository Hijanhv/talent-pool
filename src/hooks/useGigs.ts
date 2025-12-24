import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Gig, PaginatedResponse } from '@/types';
import { PaginationQuery } from '@/lib/validators';
import { useWallet } from '@solana/wallet-adapter-react';

export function useGigs(query: PaginationQuery) {
  return useQuery({
    queryKey: ['gigs', query],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await axios.get<any>(`/api/gigs?${params}`);
      return response.data.data as PaginatedResponse<Gig>;
    },
  });
}

export function useGig(gigId: string) {
  return useQuery({
    queryKey: ['gig', gigId],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/gigs/${gigId}`);
      return response.data.data as Gig;
    },
    enabled: !!gigId,
  });
}

export function useGigsByCreator(walletAddress: string) {
  return useQuery({
    queryKey: ['gigs', 'creator', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/gigs`);
      return response.data.data as Gig[];
    },
    enabled: !!walletAddress,
  });
}

export function useCreateGig() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/gigs', data, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useUpdateGig() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gigId, data }: { gigId: string; data: any }) => {
      const response = await axios.put(`/api/gigs/${gigId}`, data, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gig', variables.gigId] });
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}

export function useDeleteGig() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gigId: string) => {
      await axios.delete(`/api/gigs/${gigId}`, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
    },
  });
}
