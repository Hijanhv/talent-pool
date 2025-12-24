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
    <header className="bg-neo-pink border-b-4 border-neo-black sticky top-0 z-50 shadow-brutal">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-black uppercase tracking-tight text-neo-black hover:text-neo-purple transition-colors">
            TalentPool
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-neo-black hover:bg-neo-purple hover:text-white font-bold px-4 py-2 border-2 border-neo-black transition-all">
              Events
            </Link>
            {publicKey && (
              <>
                <Link href="/events/create" className="text-neo-black hover:bg-neo-orange hover:text-white font-bold px-4 py-2 border-2 border-neo-black transition-all">
                  Create Event
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <WalletConnect />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neo-black hover:text-white border-2 border-neo-black transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/events" className="block py-2 px-4 text-neo-black hover:bg-neo-purple hover:text-white font-bold border-2 border-neo-black">
              Events
            </Link>
            {publicKey && (
              <Link href="/events/create" className="block py-2 px-4 text-neo-black hover:bg-neo-orange hover:text-white font-bold border-2 border-neo-black">
                Create Event
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
