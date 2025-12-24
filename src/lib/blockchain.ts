import { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const connection = new Connection(SOLANA_RPC, 'confirmed');

export async function transferSOL(
  fromPublicKey: PublicKey,
  toPublicKey: PublicKey,
  lamports: number,
  signers: Keypair[]
): Promise<string> {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPublicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, signers);
    return signature;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

export function solToLamports(sol: number): number {
  return Math.round(sol * 1e9);
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}
