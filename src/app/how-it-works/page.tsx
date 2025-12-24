'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Users, Wallet, Calendar, Award } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Wallet className="w-12 h-12" />,
      title: 'Connect Your Wallet',
      description: 'Connect your Solana wallet (Phantom or Solflare) to get started. No email or password required.',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Browse or Post Gigs',
      description: 'Find freelance opportunities or post your own gigs. Zero platform fees - pay only Solana transaction costs.',
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: 'Attend Events',
      description: 'Discover and register for events. Get NFT tickets that prove your attendance and unlock exclusive perks.',
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Earn Badges',
      description: 'Collect achievement badges as NFTs. Showcase your participation and build your on-chain reputation.',
    },
  ];

  return (
    <main className="min-h-screen bg-neo-white">
      <section className="bg-neo-purple border-b-4 border-neo-black shadow-brutal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neo-white hover:text-neo-pink mb-6 font-black uppercase"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-5xl font-black text-neo-white uppercase">How It Works</h1>
          <p className="text-neo-white/90 mt-4 text-xl font-bold">Your guide to using TalentPool</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="neo-card bg-neo-white p-8"
            >
              <div className="bg-neo-pink p-4 w-fit border-2 border-neo-black mb-6">
                {step.icon}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black text-neo-purple">0{index + 1}</span>
                <h3 className="text-2xl font-black text-neo-black uppercase">{step.title}</h3>
              </div>
              <p className="text-gray-700 font-bold">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 neo-card bg-neo-orange/10 p-8 border-4 border-neo-black"
        >
          <h2 className="text-3xl font-black text-neo-black uppercase mb-6">Why TalentPool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-black text-neo-purple mb-2 uppercase">Zero Fees</h3>
              <p className="text-gray-700 font-bold">No platform fees. Only pay Solana network transaction costs.</p>
            </div>
            <div>
              <h3 className="text-xl font-black text-neo-purple mb-2 uppercase">Web3 Native</h3>
              <p className="text-gray-700 font-bold">Built on Solana blockchain. Your wallet is your identity.</p>
            </div>
            <div>
              <h3 className="text-xl font-black text-neo-purple mb-2 uppercase">NFT Rewards</h3>
              <p className="text-gray-700 font-bold">Earn achievement badges and event tickets as NFTs.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/events"
            className="neo-btn bg-neo-purple text-white text-lg px-8 py-4 inline-block"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
