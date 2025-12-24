'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletConnect() {
  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton />
    </div>
  );
}
