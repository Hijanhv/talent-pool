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
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="group bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer h-full flex flex-col"
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Zap size={48} />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'published'
                  ? 'bg-green-900 text-green-200'
                  : event.status === 'ongoing'
                  ? 'bg-blue-900 text-blue-200'
                  : event.status === 'completed'
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-yellow-900 text-yellow-200'
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-100">
              {event.category}
            </span>
          </div>
        </div>

        <div className="flex-grow p-4 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>

          <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={16} className="flex-shrink-0" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} -{' '}
                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="truncate">{event.isVirtual ? 'Virtual' : event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users size={16} className="flex-shrink-0" />
              <span>
                {event.attendeeCount} / {event.capacity} attendees
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full ${
                  capacityPercentage > 90
                    ? 'bg-red-500'
                    : capacityPercentage > 75
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {spotsAvailable > 0 ? `${spotsAvailable} spots available` : 'Event is full'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="text-sm font-semibold text-blue-400">{event.ticketPrice} SOL</div>
            <div className="text-xs text-slate-500">
              {isEventStarted ? 'In Progress' : 'Upcoming'}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
