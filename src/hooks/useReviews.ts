import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Review } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';

export function useReviewsForGig(gigId: string) {
  return useQuery({
    queryKey: ['reviews', 'gig', gigId],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/gigs/${gigId}/reviews`);
      return response.data.data as Review[];
    },
    enabled: !!gigId,
  });
}

export function useReviewsByFreelancer(walletAddress: string) {
  return useQuery({
    queryKey: ['reviews', 'freelancer', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/reviews`);
      return response.data.data as Review[];
    },
    enabled: !!walletAddress,
  });
}

export function useCreateReview() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: any }) => {
      const response = await axios.post(`/api/orders/${orderId}/review`, data, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
