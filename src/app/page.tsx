'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { GigCard } from '@/components/GigCard';
import { Gig, PaginatedResponse } from '@/types';
import { motion } from 'framer-motion';
import { Loader, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Talented Freelancers</h1>
          <p className="text-xl text-blue-100">Get instant payments. Zero fees. Blockchain powered.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link
              href="/gigs/create"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
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
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-8">
            Failed to load gigs. Please try again.
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
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Previous
              </button>

              <span className="text-gray-700">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(data.pagination.totalPages, page + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}

        {!isLoading && data && data.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No gigs found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
