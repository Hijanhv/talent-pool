import * as web3 from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

/**
 * Solana NFT Service
 * Handles NFT ticket minting and management for events
 * Uses SPL Token Program for creating and managing NFTs
 */

type MintNFTTicketParams = {
  connection: web3.Connection;
  payer: web3.Keypair;
  owner: web3.PublicKey;
  eventName: string;
  eventId: string;
  attendeeAddress: string;
};

type MintNFTTicketResponse = {
  mint: string;
  tokenAccount: string;
  transactionHash: string;
};

/**
 * Mint an NFT ticket for an event attendee
 * Creates a new token mint with metadata for the event
 * This is a simplified implementation using SPL tokens
 */
export const mintNFTTicket = async (
  params: MintNFTTicketParams
): Promise<MintNFTTicketResponse> => {
  const { connection, payer, owner, eventName: _eventName, eventId: _eventId, attendeeAddress: _attendeeAddress } = params;

  try {
    // Create new mint account
    const mint = web3.Keypair.generate();
    const tokenAccount = await getAssociatedTokenAddress(mint.publicKey, owner);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create transaction
    const transaction = new web3.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;

    // Create mint account instruction
    transaction.add(
      web3.SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0, // decimals
        owner, // mint authority
        owner, // freeze authority
        TOKEN_PROGRAM_ID
      ),
      createAssociatedTokenAccountInstruction(
        payer.publicKey,
        tokenAccount,
        owner,
        mint.publicKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      createMintToInstruction(
        mint.publicKey,
        tokenAccount,
        owner,
        1, // amount (1 NFT)
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Sign and send transaction
    const signature = await connection.sendTransaction(transaction, [payer, mint]);

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
    });

    return {
      mint: mint.publicKey.toBase58(),
      tokenAccount: tokenAccount.toBase58(),
      transactionHash: signature,
    };
  } catch (error) {
    console.error('Error minting NFT ticket:', error);
    throw new Error(`Failed to mint NFT ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get NFT metadata for an event ticket
 * Returns the metadata that would be stored on-chain
 */
export const getEventNFTMetadata = (eventName: string, eventId: string, attendeeAddress: string) => {
  return {
    name: `${eventName} Ticket`,
    description: `Attendance certificate for ${eventName}`,
    symbol: 'TICKET',
    uri: '', // Would point to external metadata JSON
    attributes: [
      {
        trait_type: 'Event',
        value: eventName,
      },
      {
        trait_type: 'Event ID',
        value: eventId,
      },
      {
        trait_type: 'Attendee',
        value: attendeeAddress,
      },
      {
        trait_type: 'Minted Date',
        value: new Date().toISOString(),
      },
    ],
  };
};

/**
 * Verify if a wallet holds an event NFT ticket
 */
export const verifyEventNFTOwnership = async (
  connection: web3.Connection,
  wallet: web3.PublicKey,
  nftMint: string
): Promise<boolean> => {
  try {
    const mint = new web3.PublicKey(nftMint);
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);

    const account = await connection.getTokenAccountBalance(tokenAccount);
    return account.value.uiAmount !== null && account.value.uiAmount > 0;
  } catch (error) {
    console.error('Error verifying NFT ownership:', error);
    return false;
  }
};

/**
 * Get all NFT tokens held by a wallet
 */
export const getWalletNFTs = async (
  connection: web3.Connection,
  wallet: web3.PublicKey
): Promise<string[]> => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      programId: TOKEN_PROGRAM_ID,
    });

    return tokenAccounts.value
      .filter((account) => {
        const parsedData = account.account.data.parsed;
        const amount = parsedData?.info?.tokenAmount?.uiAmount;
        return amount === 1; // NFTs have 1 token
      })
      .map((account) => {
        const parsedData = account.account.data.parsed;
        return parsedData?.info?.mint;
      })
      .filter((mint): mint is string => mint !== undefined);
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
};

/**
 * Get NFT mint authority (useful for verifying event ownership)
 */
export const getNFTMintAuthority = async (
  connection: web3.Connection,
  nftMint: string
): Promise<web3.PublicKey | null> => {
  try {
    const mint = new web3.PublicKey(nftMint);
    const accountInfo = await connection.getParsedAccountInfo(mint);

    if (accountInfo.value?.data && 'parsed' in accountInfo.value.data) {
      return new web3.PublicKey(
        (accountInfo.value.data as any).parsed?.info?.owner
      );
    }

    return null;
  } catch (error) {
    console.error('Error fetching NFT mint authority:', error);
    return null;
  }
};

/**
 * Transfer NFT to another wallet (for admin reassignment if needed)
 */
export const transferNFT = async (
  connection: web3.Connection,
  fromWallet: web3.Keypair,
  toWallet: web3.PublicKey,
  nftMint: web3.PublicKey
): Promise<string> => {
  try {
    const fromTokenAccount = await getAssociatedTokenAddress(nftMint, fromWallet.publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(nftMint, toWallet);

    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new web3.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet.publicKey;

    // Add instruction to transfer NFT
    transaction.add(
      new web3.TransactionInstruction({
        keys: [
          { pubkey: fromTokenAccount, isSigner: false, isWritable: true },
          { pubkey: nftMint, isSigner: false, isWritable: false },
          { pubkey: toTokenAccount, isSigner: false, isWritable: true },
          { pubkey: fromWallet.publicKey, isSigner: true, isWritable: false },
        ],
        programId: TOKEN_PROGRAM_ID,
        data: Buffer.from([3, 1, 0, 0, 0, 0, 0, 0, 0]), // Transfer instruction with amount 1
      })
    );

    const signature = await connection.sendTransaction(transaction, [fromWallet]);
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
    });

    return signature;
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw new Error(`Failed to transfer NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
