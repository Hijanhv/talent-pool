import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TalentPool - Zero-Fee Freelance Marketplace on Solana',
  description:
    'Earn and hire freelancers instantly with zero fees on Solana blockchain. Get paid in SOL, build your reputation with NFT badges.',
  keywords: [
    'freelance',
    'gig economy',
    'Solana',
    'Web3',
    'blockchain',
    'zero fees',
    'instant payments',
  ],
  openGraph: {
    title: 'TalentPool - Zero-Fee Freelance Marketplace',
    description: 'Earn and hire freelancers instantly on Solana with zero fees',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
