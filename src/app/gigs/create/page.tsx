'use client';

import { GigForm } from '@/components/GigForm';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateGigPage() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      router.push('/gigs');
    }
  }, [publicKey, router]);

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-white">
        <div className="neo-card p-8 text-center">
          <h2 className="text-2xl font-black uppercase mb-4 text-neo-black">Connect Wallet Required</h2>
          <p className="font-bold text-neo-black">Please connect your wallet to post a gig.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="neo-card p-8">
          <h1 className="text-4xl font-black uppercase mb-2 text-neo-black">Post a Gig</h1>
          <p className="text-neo-black font-bold mb-8">Find talented freelancers for your project</p>
          <GigForm />
        </div>
      </div>
    </div>
  );
}
