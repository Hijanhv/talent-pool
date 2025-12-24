import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserProfile } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';

export function useProfile(walletAddress: string) {
  return useQuery({
    queryKey: ['profile', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/profile`);
      return response.data.data as UserProfile;
    },
    enabled: !!walletAddress,
  });
}

export function useUpdateProfile() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(
        `/api/users/${publicKey}/profile`,
        data,
        {
          headers: {
            'x-wallet-address': publicKey?.toString(),
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
