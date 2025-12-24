'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEventDetail, useRegisterEvent, useDeleteEvent } from '@/hooks/useEvents';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Calendar, MapPin, Users, Zap, Share2, Edit2, Trash2, ArrowLeft, Check, Award } from 'lucide-react';
import axios from 'axios';

type PageProps = {
  params: { id: string };
};

export default function EventDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const eventId = params.id;

  const { data: event, isLoading, error } = useEventDetail(eventId, true);
  const registerMutation = useRegisterEvent(eventId, publicKey?.toBase58() || null);
  const deleteMutation = useDeleteEvent(publicKey?.toBase58() || null);

  const [hasRegistered, setHasRegistered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mintingNFT, setMintingNFT] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full"
        />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/events"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Events
          </Link>
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-200 font-semibold">Event not found</p>
            <p className="text-red-400 text-sm mt-1">The event you're looking for doesn't exist or has been deleted</p>
          </div>
        </div>
      </main>
    );
  }

  const isOwner = publicKey && event.organizerWalletAddress === publicKey.toBase58();
  const capacityPercentage = (event.attendeeCount / event.capacity) * 100;
  const spotsAvailable = event.capacity - event.attendeeCount;
  const eventEnded = new Date(event.endDate) <= new Date();

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(undefined);
      setHasRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(eventId);
      router.push('/events');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleMintNFT = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setMintingNFT(true);
      
      // Call mint NFT API
      const response = await axios.post(
        `/api/events/${eventId}/mint-nft`,
        {
          attendeeWalletAddress: publicKey.toBase58(),
        },
        {
          headers: {
            'x-wallet-address': publicKey.toBase58(),
          },
        }
      );

      if (response.data.success) {
        setNftMinted(true);
        alert(`NFT Minted Successfully! Mint Address: ${response.data.data.mint}`);
      }
    } catch (error: any) {
      console.error('NFT Minting failed:', error);
      alert(error.response?.data?.error?.message || 'Failed to mint NFT');
    } finally {
      setMintingNFT(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/events"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Events
          </Link>
        </div>
      </section>

      <section className="relative h-64 md:h-96 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap size={64} className="text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
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
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800 rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>

              <p className="text-slate-300 text-lg mb-8 whitespace-pre-wrap">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-700">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold">Date & Time</p>
                    <p className="text-white font-semibold">
                      {new Date(event.startDate).toLocaleDateString()} at{' '}
                      {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Ends {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold">Location</p>
                    <p className="text-white font-semibold">
                      {event.isVirtual ? 'Virtual Event' : event.location}
                    </p>
                    {event.isVirtual && (
                      <p className="text-sm text-slate-400 mt-1">Join online from anywhere</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold">Capacity</p>
                    <p className="text-white font-semibold">
                      {event.attendeeCount} / {event.capacity} attendees
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {spotsAvailable > 0
                        ? `${spotsAvailable} spots available`
                        : 'Event is full'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold">Category</p>
                    <p className="text-white font-semibold capitalize">{event.category}</p>
                  </div>
                </div>
              </div>

              {event.attendees && event.attendees.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Attendees</h2>
                  <div className="space-y-2">
                    {event.attendees.slice(0, 5).map((attendee) => (
                      <div key={attendee.id} className="flex items-center gap-2 text-sm text-slate-400">
                        <Check size={16} className="text-green-400" />
                        <code className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300">
                          {attendee.attendeeWalletAddress.slice(0, 8)}...
                          {attendee.attendeeWalletAddress.slice(-8)}
                        </code>
                        {attendee.status === 'checked-in' && (
                          <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                            Checked in
                          </span>
                        )}
                      </div>
                    ))}
                    {event.attendees.length > 5 && (
                      <p className="text-sm text-slate-400 mt-4">
                        + {event.attendees.length - 5} more attendees
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motio<>
                  {hasRegistered ? (
                    <>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-full py-3 px-4 bg-neo-purple border-2 border-neo-black text-white font-bold uppercase rounded-none text-center flex items-center justify-center gap-2 shadow-brutal mb-3"
                      >
                        <Check size={20} />
                        Registered
                      </motion.div>
                      
                      {event.canMintNFT && !nftMinted && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleMintNFT}
                          disabled={mintingNFT}
                          className="w-full py-3 px-4 bg-neo-orange border-2 border-neo-black text-white font-bold uppercase rounded-none hover:bg-neo-red transition-colors shadow-brutal flex items-center justify-center gap-2"
                        >
                          <Award size={20} />
                          {mintingNFT ? 'Minting NFT...' : 'Mint NFT Ticket'}
                        </motion.button>
                      )}
                      
                      {nftMinted && (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="w-full py-3 px-4 bg-neo-pink border-2 border-neo-black text-white font-bold uppercase rounded-none text-center flex items-center justify-center gap-2 shadow-brutal"
                        >
                          <Award size={20} />
                          NFT Minted!
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRegister}
                      disabled={spotsAvailable === 0 || registerMutation.isPending || !publicKey}
                      className="w-full py-3 px-4 bg-neo-purple border-3 border-neo-black text-white font-bold uppercase rounded-none hover:bg-neo-red disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-brutal"
                    >
                      {!publicKey ? 'Connect Wallet' : spotsAvailable === 0 ? 'Event Full' : 'Register Now'}
                    </motion.button>
                  )}
                </>   className={`h-full ${
                      capacityPercentage > 90
                        ? 'bg-red-500'
                        : capacityPercentage > 75
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {capacityPercentage.toFixed(0)}% filled
                </p>
              </div>

              {!isOwner && !eventEnded ? (
                hasRegistered ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="w-full py-3 px-4 bg-green-900 text-green-200 font-semibold rounded-lg text-center flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Registered
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRegister}
                    disabled={spotsAvailable === 0 || registerMutation.isPending || !publicKey}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                  >
                    {!publicKey ? 'Connect Wallet' : spotsAvailable === 0 ? 'Event Full' : 'Register Now'}
                  </motion.button>
                )
              ) : eventEnded ? (
                <div className="w-full py-3 px-4 bg-slate-700 text-slate-300 font-semibold rounded-lg text-center">
                  Event Ended
                </div>
              ) : null}
            </div>

            {isOwner && (
              <div className="bg-slate-800 rounded-lg shadow-lg p-6 space-y-3">
                <Link
                  href={`/events/${eventId}/edit`}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Event
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 px-4 bg-red-900 text-red-200 font-semibold rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Event
                </button>
              </div>
            )}

            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Event link copied!');
                }}
                className="w-full py-2 px-4 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share Event
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-slate-800 rounded-lg p-8 max-w-md mx-4"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Delete Event?</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
