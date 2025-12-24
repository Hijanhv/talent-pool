import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Order } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/orders/${orderId}`);
      return response.data.data as Order;
    },
    enabled: !!orderId,
  });
}

export function useOrdersByBuyer(walletAddress: string) {
  return useQuery({
    queryKey: ['orders', 'buyer', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/orders/buying`);
      return response.data.data as Order[];
    },
    enabled: !!walletAddress,
  });
}

export function useOrdersBySeller(walletAddress: string) {
  return useQuery({
    queryKey: ['orders', 'seller', walletAddress],
    queryFn: async () => {
      const response = await axios.get<any>(`/api/users/${walletAddress}/orders/selling`);
      return response.data.data as Order[];
    },
    enabled: !!walletAddress,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/orders', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function usePayOrder() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, transactionHash }: { orderId: string; transactionHash: string }) => {
      const response = await axios.post(`/api/orders/${orderId}/pay`, { transactionHash }, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCompleteOrder() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axios.post(`/api/orders/${orderId}/deliver`, {}, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useApproveOrder() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await axios.post(`/api/orders/${orderId}/complete`, {}, {
        headers: {
          'x-wallet-address': publicKey?.toString(),
        },
      });
      return response.data.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
