'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/ProfileCard';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const { data: profile, isLoading } = useProfile(publicKey?.toString());

  useEffect(() => {
    if (!publicKey) {
      router.push('/');
    }
  }, [publicKey, router]);

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <div className="neo-card p-8 text-center">
          <h2 className="text-2xl font-black uppercase mb-4 text-neo-black">Connect Wallet Required</h2>
          <p className="font-bold text-neo-black">Please connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <Loader className="w-8 h-8 animate-spin text-neo-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black uppercase mb-8 text-neo-black">My Profile</h1>
        {profile ? (
          <ProfileCard profile={profile} />
        ) : (
          <div className="neo-card p-8 text-center">
            <h2 className="text-2xl font-black uppercase mb-4 text-neo-black">No Profile Found</h2>
            <p className="font-bold text-neo-black mb-6">Create your profile to get started!</p>
            <button className="neo-btn bg-neo-purple text-white">
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
