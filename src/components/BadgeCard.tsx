'use client';

import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';
import type { Badge } from '@/hooks/useBadges';

type BadgeCardProps = {
  badge: Badge;
};

export function BadgeCard({ badge }: BadgeCardProps) {
  const badgeColors = {
    event_attendee: 'bg-neo-purple',
    event_organizer: 'bg-neo-pink',
    early_adopter: 'bg-neo-orange',
    super_host: 'bg-neo-red',
    active_participant: 'bg-neo-purple',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="neo-card p-6 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div
          className={`${
            badgeColors[badge.type]
          } border-2 border-neo-black p-4 flex items-center justify-center shadow-brutal`}
        >
          <Award className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black uppercase text-neo-black mb-1 group-hover:text-neo-purple transition-colors">
            {badge.name}
          </h3>
          <p className="text-sm text-neo-black font-bold mb-3">{badge.description}</p>

          <div className="flex items-center gap-2 text-xs text-neo-black">
            <Calendar size={14} />
            <span className="font-bold">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </span>
          </div>

          {badge.nftMintAddress && (
            <div className="mt-3 p-2 bg-neo-orange border-2 border-neo-black">
              <p className="text-xs font-bold text-white break-all">
                NFT: {badge.nftMintAddress.slice(0, 8)}...{badge.nftMintAddress.slice(-8)}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
