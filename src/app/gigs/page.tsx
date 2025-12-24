'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GigCard } from '@/components/GigCard';
import { Search, Loader } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Gig, PaginatedResponse } from '@/types';

export default function GigsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['gigs', page, category, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '12',
        ...(category && { category }),
        ...(search && { search }),
      });

      const response = await axios.get<any>(`/api/gigs?${params}`);
      return response.data.data as PaginatedResponse<Gig>;
    },
  });

  return (
    <div className="min-h-screen bg-neo-white">
      <div className="bg-neo-purple border-b-4 border-neo-black py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-black uppercase mb-4 text-white">Find Talented Freelancers</h1>
          <p className="text-2xl font-bold text-neo-pink">Get instant payments. Zero fees. Blockchain powered.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="neo-card p-6 mb-8">
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-3 text-neo-black w-5 h-5" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="neo-input w-full pl-10"
              />
            </div>
            <Link href="/gigs/create" className="neo-btn bg-neo-purple text-white">
              Post Gig
            </Link>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['development', 'design', 'writing', 'video', 'tutoring', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(category === cat ? null : cat);
                  setPage(1);
                }}
                className={`px-4 py-2 border-2 border-neo-black font-bold uppercase transition-all ${
                  category === cat
                    ? 'bg-neo-purple text-white shadow-brutal'
                    : 'bg-white text-neo-black hover:shadow-brutal'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-neo-purple" />
          </div>
        )}

        {error && (
          <div className="neo-card p-6 bg-neo-red text-white mb-8">
            <p className="font-bold">Failed to load gigs. Please try again.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {data.data.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="neo-btn disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-bold text-neo-black">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(data.pagination.totalPages, page + 1))}
                disabled={page === data.pagination.totalPages}
                className="neo-btn disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {!isLoading && data && data.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neo-black text-lg font-bold">No gigs found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
