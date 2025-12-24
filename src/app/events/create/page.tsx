'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateEvent } from '@/hooks/useEvents';
import { EventForm } from '@/components/EventForm';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowLeft } from 'lucide-react';
import type { CreateEventInput } from '@/types';

export default function CreateEventPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const createEventMutation = useCreateEvent(publicKey?.toBase58() || null);

  const handleCreateEvent = async (data: CreateEventInput) => {
    if (!publicKey) {
      throw new Error('Wallet connection required');
    }

    try {
      await createEventMutation.mutateAsync(data);
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/events');
      }, 2000);
    } catch (error) {
      throw error;
    }
  };

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-slate-800 rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-slate-300 mb-6">You need to connect your Solana wallet to create events</p>
            <p className="text-sm text-slate-400">Look for the wallet connect button in the top navigation</p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/events"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Event</h1>
          <p className="text-slate-400 mt-1">Organize something amazing</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900 border border-green-700 rounded-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-green-200 mb-2">Event Created Successfully!</h2>
            <p className="text-green-300 mb-6">Your event has been created and is ready to be published</p>
            <p className="text-sm text-green-400">Redirecting you to events page...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg shadow-lg p-8"
          >
            <EventForm
              onSubmit={handleCreateEvent}
              isLoading={createEventMutation.isPending}
            />
          </motion.div>
        )}
      </section>
    </main>
  );
}
