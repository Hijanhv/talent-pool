import { NextRequest, NextResponse } from 'next/server';
import { createEventSchema } from '@/lib/validations/events';
import { createEvent, getEvents } from '@/services/events.service';
import type { ApiResponse, PaginatedResponse, Event } from '@/types';
import { ZodError } from 'zod';

/**
 * GET /api/events
 * Get all events with pagination and filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const organizerWalletAddress = searchParams.get('organizer') || undefined;

    const { events: eventsList, total } = await getEvents(page, limit, {
      category: category as any,
      status: status as any,
      searchQuery,
      organizerWalletAddress,
    });

    const response: ApiResponse<PaginatedResponse<Event>> = {
      success: true,
      data: {
        data: eventsList,
        pagination: {
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch events',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    const organizerWallet = request.headers.get('x-wallet-address');
    if (!organizerWallet) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Wallet address required (x-wallet-address header)',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const newEvent = await createEvent(organizerWallet, validatedData);

    const response: ApiResponse<Event> = {
      success: true,
      data: newEvent,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            details: error.errors,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create event',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
