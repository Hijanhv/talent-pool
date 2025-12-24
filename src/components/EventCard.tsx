'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';
import type { Event } from '@/types';

type EventCardProps = {
  event: Event;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isEventStarted = new Date(event.startDate) <= new Date();
  const capacityPercentage = (event.attendeeCount / event.capacity) * 100;
  const spotsAvailable = event.capacity - event.attendeeCount;

  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #000000' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="neo-card bg-neo-white h-full flex flex-col"
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-neo-pink to-neo-purple overflow-hidden border-b-4 border-neo-black">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neo-white">
              <Zap size={48} />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`neo-badge ${
                event.status === 'published'
                  ? 'bg-neo-purple text-white'
                  : event.status === 'ongoing'
                  ? 'bg-neo-orange text-neo-black'
                  : event.status === 'completed'
                  ? 'bg-neo-gray text-neo-black'
                  : 'bg-neo-red text-white'
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="absolute top-3 left-3">
            <span className="neo-badge bg-neo-pink text-neo-black">
              {event.category}
            </span>
          </div>
        </div>

        <div className="flex-grow p-5 flex flex-col">
          <h3 className="text-xl font-black text-neo-black mb-3 line-clamp-2 uppercase tracking-tight">
            {event.title}
          </h3>

          <p className="text-sm text-gray-700 mb-4 line-clamp-2 flex-grow font-medium">
            {event.description}
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-sm text-neo-black font-bold">
              <div className="p-2 bg-neo-orange border-2 border-neo-black">
                <Calendar size={16} className="flex-shrink-0" />
              </div>
              <span>
                {new Date(event.startDate).toLocaleDateString()} -{' '}
                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neo-black font-bold">
              <div className="p-2 bg-neo-purple border-2 border-neo-black">
                <MapPin size={16} className="flex-shrink-0 text-white" />
              </div>
              <span className="truncate">{event.isVirtual ? 'Virtual' : event.location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neo-black font-bold">
              <div className="p-2 bg-neo-pink border-2 border-neo-black">
                <Users size={16} className="flex-shrink-0" />
              </div>
              <span>
                {event.attendeeCount} / {event.capacity} attendees
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-neo-gray border-3 border-neo-black h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full border-r-3 border-neo-black ${
                  capacityPercentage > 90
                    ? 'bg-neo-red'
                    : capacityPercentage > 75
                    ? 'bg-neo-orange'
                    : 'bg-neo-purple'
                }`}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 font-bold uppercase">
              {spotsAvailable > 0 ? `${spotsAvailable} spots available` : 'Event is full'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-4 border-neo-black">
            <div className="text-lg font-black text-neo-purple uppercase">{event.ticketPrice} SOL</div>
            <div className="neo-badge bg-neo-orange text-neo-black text-xs">
              {isEventStarted ? 'In Progress' : 'Upcoming'}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
