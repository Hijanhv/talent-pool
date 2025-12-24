'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GigCard } from '@/components/GigCard';
import { OrderCard } from '@/components/OrderCard';
import { Loader, Briefcase, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Gig, Order } from '@/types';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      router.push('/');
    }
  }, [publicKey, router]);

  const { data: myGigs, isLoading: gigsLoading } = useQuery({
    queryKey: ['my-gigs', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return [];
      const response = await axios.get<any>(`/api/gigs?seller=${publicKey.toString()}`);
      return response.data.data.data as Gig[];
    },
    enabled: !!publicKey,
  });

  const { data: myOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return [];
      const response = await axios.get<any>(`/api/orders?buyer=${publicKey.toString()}`);
      return response.data.data as Order[];
    },
    enabled: !!publicKey,
  });

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <div className="neo-card p-8 text-center">
          <h2 className="text-2xl font-black uppercase mb-4 text-neo-black">Connect Wallet Required</h2>
          <p className="font-bold text-neo-black">Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black uppercase mb-8 text-neo-black">My Dashboard</h1>

        {}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-neo-purple" />
              <h2 className="text-3xl font-black uppercase text-neo-black">My Gigs</h2>
            </div>
            <Link href="/gigs/create" className="neo-btn bg-neo-purple text-white">
              Post New Gig
            </Link>
          </div>

          {gigsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-neo-purple" />
            </div>
          ) : myGigs && myGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          ) : (
            <div className="neo-card p-8 text-center">
              <p className="font-bold text-neo-black mb-4">You haven't posted any gigs yet.</p>
              <Link href="/gigs/create" className="neo-btn bg-neo-purple text-white inline-block">
                Post Your First Gig
              </Link>
            </div>
          )}
        </section>

        {}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-8 h-8 text-neo-orange" />
            <h2 className="text-3xl font-black uppercase text-neo-black">My Orders</h2>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-neo-purple" />
            </div>
          ) : myOrders && myOrders.length > 0 ? (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="neo-card p-8 text-center">
              <p className="font-bold text-neo-black mb-4">You haven't placed any orders yet.</p>
              <Link href="/gigs" className="neo-btn bg-neo-orange text-white inline-block">
                Browse Gigs
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
