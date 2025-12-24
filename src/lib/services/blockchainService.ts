import { PublicKey, Connection } from '@solana/web3.js';

const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export class BlockchainService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC, 'confirmed');
  }

  async verifyBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9;
    } catch (error) {
      console.error('Balance check failed:', error);
      throw error;
    }
  }

  async getTransactionStatus(txHash: string): Promise<boolean> {
    try {
      const signature = txHash;
      const status = await this.connection.getSignatureStatus(signature);
      return status.value?.confirmationStatus === 'finalized' || false;
    } catch (error) {
      console.error('Transaction status check failed:', error);
      return false;
    }
  }

  async getNFTsForWallet(walletAddress: string): Promise<any[]> {
    try {
      const response = await fetch(`https://api.helius.xyz/v0/addresses/${walletAddress}/nfts?api-key=${process.env.HELIUS_API_KEY}`);
      const data = await response.json();
      return data.nfts || [];
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
      return [];
    }
  }

  async createNFTMetadata(
    name: string,
    description: string,
    imageUrl: string,
    attributes: any[]
  ): Promise<string> {
    try {
      const metadata = {
        name,
        description,
        image: imageUrl,
        attributes: attributes.map((attr) => ({
          trait_type: attr.name,
          value: attr.value,
        })),
        properties: {
          category: 'badge',
          files: [{ uri: imageUrl, type: 'image/png' }],
        },
      };

      const metadataJson = JSON.stringify(metadata);
      return metadataJson;
    } catch (error) {
      console.error('Metadata creation failed:', error);
      throw error;
    }
  }

  async verifyWalletSignature(_message: string, _signature: string, publicKeyStr: string): Promise<boolean> {
    try {
      const publicKey = new PublicKey(publicKeyStr);
      const isValid = PublicKey.isOnCurve(publicKey.toBuffer());
      return isValid;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
}
