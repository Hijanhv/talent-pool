'use client';

import Link from 'next/link';
import { WalletConnect } from '../WalletConnect';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { publicKey } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TalentPool
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Marketplace
            </Link>
            {publicKey && (
              <>
                <Link href="/gigs/create" className="text-gray-700 hover:text-blue-600 font-medium">
                  Post Gig
                </Link>
                <Link href="/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href={`/profile/${publicKey.toString()}`} className="text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <WalletConnect />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && publicKey && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Marketplace
            </Link>
            <Link href="/gigs/create" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Post Gig
            </Link>
            <Link href="/orders" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href={`/profile/${publicKey.toString()}`} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
