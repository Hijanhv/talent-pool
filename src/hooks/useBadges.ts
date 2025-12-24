import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';

export function useBadges(walletAddress: string) {
  return useQuery({
    queryKey: ['badges', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/badges`);
      return response.data.data;
    },
    enabled: !!walletAddress,
  });
}

export function useMintBadge() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (badgeType: string) => {
      const response = await axios.post(
        `/api/users/${publicKey}/badges/mint`,
        { badgeType },
        {
          headers: {
            'x-wallet-address': publicKey?.toString(),
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
}
