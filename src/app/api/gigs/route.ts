import { NextRequest, NextResponse } from 'next/server';
import { GigService } from '@/lib/services/gigService';
import { createGigSchema, paginationSchema } from '@/lib/validators';
import { ApiResponse, PaginatedResponse, Gig } from '@/types';
import { ZodError } from 'zod';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<PaginatedResponse<Gig>>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = paginationSchema.parse(Object.fromEntries(searchParams));

    const result = await GigService.getGigs(query);

    return NextResponse.json(
      {
        success: true,
        data: result,
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
          message: 'Failed to fetch gigs',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Gig>>> {
  try {
    const body = await request.json();
    const validatedData = createGigSchema.parse(body);

    const creatorWallet = request.headers.get('x-wallet-address');
    if (!creatorWallet) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Wallet address required',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const newGig = await GigService.createGig(creatorWallet, validatedData);

    return NextResponse.json(
      {
        success: true,
        data: newGig,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
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

    console.error('Error creating gig:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create gig',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
