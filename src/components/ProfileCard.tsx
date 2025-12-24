'use client';

import { UserProfile } from '@/types';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

type ProfileCardProps = {
  profile: UserProfile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.displayName || 'Unnamed'}</h2>
          {profile.category && (
            <p className="text-sm text-gray-600 capitalize">{profile.category}</p>
          )}
        </div>
        {profile.profileImageUrl && (
          <img
            src={profile.profileImageUrl}
            alt={profile.displayName || 'Profile'}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
      </div>

      {profile.bio && (
        <p className="text-gray-700 mb-4">{profile.bio}</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{profile.totalOrders}</p>
          <p className="text-sm text-gray-600">Orders</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold text-gray-900">{profile.averageRating || '-'}</p>
          </div>
          <p className="text-sm text-gray-600">Rating</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{profile.totalEarned}</p>
          <p className="text-sm text-gray-600">SOL</p>
        </div>
      </div>
    </motion.div>
  );
}
