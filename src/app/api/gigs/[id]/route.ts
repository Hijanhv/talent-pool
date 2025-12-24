import { NextRequest, NextResponse } from 'next/server';
import { GigService } from '@/lib/services/gigService';
import { updateGigSchema } from '@/lib/validators';
import { ApiResponse, Gig } from '@/types';
import { ZodError } from 'zod';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Gig>>> {
  try {
    const gig = await GigService.getGigById(params.id);

    if (!gig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Gig not found',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: gig,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch gig',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Gig>>> {
  try {
    const body = await request.json();
    const validatedData = updateGigSchema.parse(body);

    const gig = await GigService.getGigById(params.id);
    if (!gig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Gig not found',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const walletAddress = request.headers.get('x-wallet-address');
    if (walletAddress !== gig.creatorWalletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only creator can update gig',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const updatedGig = await GigService.updateGig(params.id, validatedData);

    return NextResponse.json(
      {
        success: true,
        data: updatedGig,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update gig',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const gig = await GigService.getGigById(params.id);
    if (!gig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Gig not found',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const walletAddress = request.headers.get('x-wallet-address');
    if (walletAddress !== gig.creatorWalletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only creator can delete gig',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    await GigService.deleteGig(params.id);

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete gig',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
