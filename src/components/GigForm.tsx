'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGigSchema, CreateGigRequest } from '@/lib/validators';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader } from 'lucide-react';

type GigFormProps = {
  onSuccess?: () => void;
  initialData?: Partial<CreateGigRequest>;
};

export function GigForm({ onSuccess, initialData }: GigFormProps) {
  const { publicKey } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGigRequest>({
    resolver: zodResolver(createGigSchema),
    defaultValues: initialData,
  });

  const createGigMutation = useMutation({
    mutationFn: async (data: CreateGigRequest) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const response = await axios.post('/api/gigs', data, {
        headers: {
          'x-wallet-address': publicKey.toString(),
        },
      });
      return response.data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create gig');
    },
  });

  const onSubmit = (data: CreateGigRequest) => {
    setError(null);
    createGigMutation.mutate(data);
  };

  if (!publicKey) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to create a gig.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gig Title
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g., I'll build your Next.js landing page"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Describe what you'll deliver..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="video">Video</option>
            <option value="tutoring">Tutoring</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price (SOL)
          </label>
          <input
            {...register('priceInSol')}
            type="number"
            step="0.01"
            placeholder="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.priceInSol && (
            <p className="mt-1 text-sm text-red-600">{errors.priceInSol.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Delivery Time (Days)
        </label>
        <input
          {...register('deliveryDaysMax', { valueAsNumber: true })}
          type="number"
          min="1"
          max="30"
          placeholder="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.deliveryDaysMax && (
          <p className="mt-1 text-sm text-red-600">{errors.deliveryDaysMax.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Portfolio URL (Optional)
          </label>
          <input
            {...register('portfolioUrl')}
            type="url"
            placeholder="https://example.com/portfolio"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image URL (Optional)
          </label>
          <input
            {...register('imageUrl')}
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={createGigMutation.isPending}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {createGigMutation.isPending && <Loader className="w-4 h-4 animate-spin" />}
        {createGigMutation.isPending ? 'Creating...' : 'Create Gig'}
      </button>
    </form>
  );
}
