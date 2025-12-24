'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is TalentPool?',
      answer: 'TalentPool is a decentralized freelance marketplace and event management platform built on Solana. It allows users to post and find freelance gigs, create and attend events, and earn NFT badges for their participation - all with zero platform fees.',
    },
    {
      question: 'Do I need a crypto wallet?',
      answer: 'Yes, you need a Solana wallet to use TalentPool. We support Phantom and Solflare wallets. Your wallet serves as your identity on the platform - no email or password required.',
    },
    {
      question: 'Are there any fees?',
      answer: 'TalentPool charges ZERO platform fees. You only pay standard Solana network transaction fees (typically a fraction of a cent). This makes it one of the most affordable freelance platforms available.',
    },
    {
      question: 'What are NFT tickets and badges?',
      answer: 'When you attend events or achieve milestones on TalentPool, you can earn NFTs (Non-Fungible Tokens) as proof of participation. These NFTs serve as digital badges that showcase your involvement and can be displayed in your wallet or profile.',
    },
    {
      question: 'How do event tickets work?',
      answer: 'Event organizers can enable NFT tickets for their events. When you register for an event with NFT tickets enabled, you can mint a unique NFT ticket that proves your attendance. These tickets are stored in your wallet forever.',
    },
    {
      question: 'What types of badges can I earn?',
      answer: 'You can earn various badges including: Event Attendee (attend events), Event Organizer (create events), Early Adopter (join early), Super Host (organize multiple successful events), and Active Participant (engage regularly).',
    },
    {
      question: 'How do I get paid for gigs?',
      answer: 'Payment for gigs happens directly between clients and freelancers using Solana wallets. The platform does not hold or escrow funds. We recommend using clear payment terms and milestones in your gig agreements.',
    },
    {
      question: 'Can I create my own events?',
      answer: 'Yes! Connect your wallet and navigate to the Events page, then click "Create Event". You can organize conferences, workshops, webinars, or any other type of gathering. Set your ticket price (including free events) and enable NFT tickets if desired.',
    },
    {
      question: 'Is my data secure?',
      answer: 'All event and gig data is stored securely in our database. Your wallet address serves as your identifier - we never store passwords or access your private keys. Only you control your wallet and any NFTs you earn.',
    },
    {
      question: 'Which blockchain network does this use?',
      answer: 'TalentPool is built on Solana, specifically using the Devnet (development network) for testing. Solana was chosen for its high speed, low transaction costs, and excellent developer tools.',
    },
  ];

  return (
    <main className="min-h-screen bg-neo-white">
      <section className="bg-neo-orange border-b-4 border-neo-black shadow-brutal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neo-white hover:text-neo-pink mb-6 font-black uppercase"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-5xl font-black text-neo-white uppercase">Frequently Asked Questions</h1>
          <p className="text-neo-white/90 mt-4 text-xl font-bold">Everything you need to know about TalentPool</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="neo-card bg-neo-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4"
              >
                <h3 className="text-xl font-black text-neo-black uppercase">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 text-neo-purple transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <p className="text-gray-700 font-bold border-t-2 border-neo-black pt-4">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 neo-card bg-neo-pink/10 p-8 text-center"
        >
          <h2 className="text-2xl font-black text-neo-black uppercase mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 font-bold mb-6">
            Check out our source code or explore the platform to learn more.
          </p>
          <Link
            href="https://github.com/Hijanhv/talent-pool"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-neo-black text-white inline-block"
          >
            View on GitHub
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
