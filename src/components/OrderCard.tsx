'use client';

import { Order } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type OrderCardProps = {
  order: Order;
  type: 'buying' | 'selling';
};

export function OrderCard({ order, type }: OrderCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    delivered: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg"
    >
      <Link href={`/orders/${order.id}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
            <p className="text-sm text-gray-600">
              {type === 'buying' ? 'From: ' : 'To: '}
              {type === 'buying' ? order.sellerWalletAddress : order.buyerWalletAddress}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${statusColors[order.status as keyof typeof statusColors]}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{order.priceAgreed} SOL</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Due: {formatDate(order.deliveryDeadline)}</span>
          </div>
        </div>

        <button className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </motion.div>
  );
}
