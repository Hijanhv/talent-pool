'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';

export function WalletConnect() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #ff006e !important;
          border: 3px solid #000000 !important;
          border-radius: 0 !important;
          box-shadow: 4px 4px 0px 0px #000000 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          transition: all 0.2s !important;
          height: 42px !important;
          font-size: 14px !important;
        }
        .wallet-adapter-button:hover {
          background-color: #d90058 !important;
          transform: translate(2px, 2px) !important;
          box-shadow: 2px 2px 0px 0px #000000 !important;
        }
        .wallet-adapter-button:not([disabled]):hover {
          background-color: #d90058 !important;
        }
        .wallet-adapter-modal-wrapper {
          background: rgba(0, 0, 0, 0.8) !important;
        }
        .wallet-adapter-modal {
          background: white !important;
          border: 4px solid #000000 !important;
          border-radius: 0 !important;
          box-shadow: 8px 8px 0px 0px #000000 !important;
        }
        .wallet-adapter-modal-title {
          font-weight: 900 !important;
          text-transform: uppercase !important;
        }
        .wallet-adapter-modal-button-close {
          border: 2px solid #000000 !important;
          border-radius: 0 !important;
        }
      `}</style>
      <WalletMultiButton />
      {connected && publicKey && (
        <span className="hidden md:block text-xs font-bold text-neo-black px-3 py-1 bg-neo-orange border-2 border-neo-black">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
      )}
    </div>
  );
}
