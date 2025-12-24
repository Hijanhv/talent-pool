'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { createEventSchema } from '@/lib/validations/events';
import type { CreateEventInput, Event, EventCategory } from '@/types';

const EVENT_CATEGORIES: EventCategory[] = [
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
];

type EventFormProps = {
  onSubmit: (data: CreateEventInput) => Promise<void>;
  initialData?: Event;
  isLoading?: boolean;
};

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData, isLoading = false }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          location: initialData.location,
          isVirtual: initialData.isVirtual,
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          capacity: initialData.capacity,
          ticketPrice: initialData.ticketPrice,
          imageUrl: initialData.imageUrl || undefined,
          bannerUrl: initialData.bannerUrl || undefined,
          canMintNFT: initialData.canMintNFT,
        }
      : {
          capacity: 100,
          isVirtual: false,
          canMintNFT: false,
          ticketPrice: '0',
        },
  });

  const isVirtual = watch('isVirtual');

  const handleFormSubmit = async (data: CreateEventInput) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">Event Title *</label>
        <input
          type="text"
          {...register('title')}
          placeholder="Your awesome event"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">Description *</label>
        <textarea
          {...register('description')}
          placeholder="Tell people about your event..."
          rows={4}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">Category *</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('isVirtual')}
            className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-slate-200">Virtual Event</span>
        </label>
      </div>

      {!isVirtual && (
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Location *</label>
          <input
            type="text"
            {...register('location')}
            placeholder="City, Address, or Venue"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
        </div>
      )}

      {isVirtual && (
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Virtual Meeting Link *</label>
          <input
            type="text"
            {...register('location')}
            placeholder="https://zoom.us/j/... or link to your virtual venue"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Start Date & Time *</label>
          <input
            type="datetime-local"
            {...register('startDate', {
              setValueAs: (v) => new Date(v),
            })}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">End Date & Time *</label>
          <input
            type="datetime-local"
            {...register('endDate', {
              setValueAs: (v) => new Date(v),
            })}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Event Capacity *</label>
          <input
            type="number"
            {...register('capacity', {
              setValueAs: (v) => parseInt(v, 10),
            })}
            placeholder="100"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.capacity && <p className="text-red-400 text-sm mt-1">{errors.capacity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Ticket Price (SOL) *</label>
          <input
            type="text"
            {...register('ticketPrice')}
            placeholder="0.5"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.ticketPrice && <p className="text-red-400 text-sm mt-1">{errors.ticketPrice.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Event Image URL</label>
          <input
            type="url"
            {...register('imageUrl')}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Banner Image URL</label>
          <input
            type="url"
            {...register('bannerUrl')}
            placeholder="https://example.com/banner.jpg"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.bannerUrl && <p className="text-red-400 text-sm mt-1">{errors.bannerUrl.message}</p>}
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('canMintNFT')}
              className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-200">Enable NFT Tickets</span>
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-2">Allow attendees to receive NFT tickets for this event</p>
      </div>

      {submitError && <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">{submitError}</div>}

      <motion.button
        type="submit"
        disabled={isSubmitting || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || isLoading ? 'Creating Event...' : initialData ? 'Update Event' : 'Create Event'}
      </motion.button>
    </motion.form>
  );
};
