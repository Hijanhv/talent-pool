'use client';

import { Gig } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

type GigCardProps = {
  gig: Gig;
};

export function GigCard({ gig }: GigCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg"
    >
      <Link href={`/gigs/${gig.id}`}>
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {gig.imageUrl ? (
            <img
              src={gig.imageUrl}
              alt={gig.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-4xl">
              {gig.category[0].toUpperCase()}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full capitalize">
            {gig.category}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900">
          <Link href={`/gigs/${gig.id}`} className="hover:text-blue-600">
            {gig.title}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{gig.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">
              {gig.averageRating || 'No ratings'}
            </span>
            {gig.totalReviews > 0 && (
              <span className="text-xs text-gray-500">({gig.totalReviews})</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{gig.deliveryDaysMax}d delivery</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{gig.priceInSol} SOL</span>
          <Link
            href={`/gigs/${gig.id}`}
            className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
