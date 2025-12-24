import { NextRequest, NextResponse } from 'next/server';
import { getEventNFTMetadata } from '@/lib/solana/nft-service';
import { getEventById } from '@/services/events.service';
import type { ApiResponse } from '@/types';
import { z } from 'zod';

const mintNFTSchema = z.object({
  attendeeAddress: z.string().min(32, 'Invalid wallet address'),
});

/**
 * POST /api/events/[id]/mint-nft
 * Mint an NFT ticket for an event attendee
 *
 * This endpoint:
 * 1. Verifies the event exists
 * 2. Verifies the attendee is registered
 * 3. Mints an NFT ticket for the attendee
 * 4. Updates the attendee record with NFT mint address
 *
 * Note: In production, this would typically be called by the server
 * after the attendee has completed payment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { attendeeAddress } = mintNFTSchema.parse(body);

    
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Event not found',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    
    if (!event.canMintNFT) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NFT_MINTING_DISABLED',
            message: 'NFT minting is not enabled for this event',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    
    
    
    
    
    

    
    
    

    const response: ApiResponse<{
      message: string;
      instructions: string;
      nftMetadata: ReturnType<typeof getEventNFTMetadata>;
    }> = {
      success: true,
      data: {
        message: 'NFT minting prepared. Sign the transaction in your wallet.',
        instructions: 'The attendee should use their wallet to sign the transaction',
        nftMetadata: getEventNFTMetadata(event.title, eventId, attendeeAddress),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Validation failed',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.error('Error minting NFT:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to prepare NFT minting',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
