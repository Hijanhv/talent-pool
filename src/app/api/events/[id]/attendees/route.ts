import { NextRequest, NextResponse } from 'next/server';
import { registerEventSchema, checkInSchema } from '@/lib/validations/events';
import { registerAttendee, getEventAttendees, getEventById, checkInAttendee } from '@/services/events.service';
import type { ApiResponse, PaginatedResponse, EventAttendee } from '@/types';
import { ZodError } from 'zod';

/**
 * GET /api/events/[id]/attendees
 * Get attendees for an event with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

    
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

    const { attendees, total } = await getEventAttendees(eventId, page, limit);

    const response: ApiResponse<PaginatedResponse<EventAttendee>> = {
      success: true,
      data: {
        data: attendees,
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
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch attendees',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events/[id]/attendees
 * Register for an event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;
    const body = await request.json();
    const validatedData = registerEventSchema.parse(body);

    const attendeeWallet = request.headers.get('x-wallet-address');
    if (!attendeeWallet) {
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

    
    if (event.attendeeCount >= event.capacity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CAPACITY_FULL',
            message: 'Event is at full capacity',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    const newAttendee = await registerAttendee(eventId, attendeeWallet, validatedData.paymentTxHash);

    const response: ApiResponse<EventAttendee> = {
      success: true,
      data: newAttendee,
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
            message: error.errors[0]?.message || 'Validation failed',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.error('Error registering attendee:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register for event',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id]/attendees/check-in
 * Check in an attendee
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { attendeeWalletAddress } = checkInSchema.parse({
      eventId,
      attendeeWalletAddress: body.attendeeWalletAddress,
    });

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

    if (event.organizerWalletAddress !== organizerWallet) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to check in attendees for this event',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const checkedInAttendee = await checkInAttendee(eventId, attendeeWalletAddress);

    if (!checkedInAttendee) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Attendee not found for this event',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const response: ApiResponse<EventAttendee> = {
      success: true,
      data: checkedInAttendee,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
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

    console.error('Error checking in attendee:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check in attendee',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
