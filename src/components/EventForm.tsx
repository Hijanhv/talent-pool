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
        <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Event Title *</label>
        <input
          type="text"
          {...register('title')}
          placeholder="Your awesome event"
          className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
        />
        {errors.title && <p className="text-neo-red text-sm mt-2 font-bold">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Description *</label>
        <textarea
          {...register('description')}
          placeholder="Tell people about your event..."
          rows={4}
          className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
        />
        {errors.description && <p className="text-neo-red text-sm mt-2 font-bold">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Category *</label>
        <select
          {...register('category')}
          className="neo-input w-full bg-neo-white text-neo-black"
        >
          <option value="">Select a category</option>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-neo-red text-sm mt-2 font-bold">{errors.category.message}</p>}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('isVirtual')}
            className="w-5 h-5 border-3 border-neo-black text-neo-purple focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-sm font-black text-neo-black uppercase tracking-wide">Virtual Event</span>
        </label>
      </div>

      {!isVirtual && (
        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Location *</label>
          <input
            type="text"
            {...register('location')}
            placeholder="City, Address, or Venue"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.location && <p className="text-neo-red text-sm mt-2 font-bold">{errors.location.message}</p>}
        </div>
      )}

      {isVirtual && (
        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Virtual Meeting Link *</label>
          <input
            type="text"
            {...register('location')}
            placeholder="https://zoom.us/j/... or link to your virtual venue"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.location && <p className="text-neo-red text-sm mt-2 font-bold">{errors.location.message}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Start Date & Time *</label>
          <input
            type="datetime-local"
            {...register('startDate', {
              setValueAs: (v) => new Date(v),
            })}
            className="neo-input w-full bg-neo-white text-neo-black"
          />
          {errors.startDate && <p className="text-neo-red text-sm mt-2 font-bold">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">End Date & Time *</label>
          <input
            type="datetime-local"
            {...register('endDate', {
              setValueAs: (v) => new Date(v),
            })}
            className="neo-input w-full bg-neo-white text-neo-black"
          />
          {errors.endDate && <p className="text-neo-red text-sm mt-2 font-bold">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Event Capacity *</label>
          <input
            type="number"
            {...register('capacity', {
              setValueAs: (v) => parseInt(v, 10),
            })}
            placeholder="100"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.capacity && <p className="text-neo-red text-sm mt-2 font-bold">{errors.capacity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Ticket Price (SOL) *</label>
          <input
            type="text"
            {...register('ticketPrice')}
            placeholder="0.5"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.ticketPrice && <p className="text-neo-red text-sm mt-2 font-bold">{errors.ticketPrice.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Event Image URL</label>
          <input
            type="url"
            {...register('imageUrl')}
            placeholder="https://example.com/image.jpg"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.imageUrl && <p className="text-neo-red text-sm mt-2 font-bold">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-black text-neo-black mb-3 uppercase tracking-wide">Banner Image URL</label>
          <input
            type="url"
            {...register('bannerUrl')}
            placeholder="https://example.com/banner.jpg"
            className="neo-input w-full bg-neo-white text-neo-black placeholder-gray-500"
          />
          {errors.bannerUrl && <p className="text-neo-red text-sm mt-2 font-bold">{errors.bannerUrl.message}</p>}
        </div>
      </div>

      <div className="border-t-4 border-neo-black pt-6 bg-neo-pink/10 p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('canMintNFT')}
              className="w-5 h-5 border-3 border-neo-black text-neo-purple focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm font-black text-neo-black uppercase tracking-wide">Enable NFT Tickets</span>
          </label>
        </div>
        <p className="text-xs text-gray-600 mt-2 font-bold">Allow attendees to receive NFT tickets for this event</p>
      </div>

      {submitError && <div className="neo-card bg-neo-red text-white p-4 text-sm font-bold">{submitError}</div>}

      <motion.button
        type="submit"
        disabled={isSubmitting || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="neo-btn w-full bg-neo-purple text-white disabled:bg-neo-gray disabled:cursor-not-allowed"
      >
        {isSubmitting || isLoading ? 'Creating Event...' : initialData ? 'Update Event' : 'Create Event'}
      </motion.button>
    </motion.form>
  );
};
