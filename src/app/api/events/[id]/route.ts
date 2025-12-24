import { NextRequest, NextResponse } from 'next/server';
import { updateEventSchema } from '@/lib/validations/events';
import { getEventById, updateEvent, deleteEvent, getEventAttendees } from '@/services/events.service';
import type { ApiResponse, Event } from '@/types';
import { ZodError } from 'zod';

/**
 * GET /api/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;

    // Check for include query parameter (to include attendees)
    const searchParams = request.nextUrl.searchParams;
    const includeAttendees = searchParams.get('includeAttendees') === 'true';

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

    let responseData: any = event;

    if (includeAttendees) {
      const { attendees } = await getEventAttendees(eventId, 1, 100);
      responseData = { ...event, attendees };
    }

    const response: ApiResponse<typeof responseData> = {
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch event',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id]
 * Update an event
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;
    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

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

    // Verify ownership
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
            message: 'You do not have permission to update this event',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const updatedEvent = await updateEvent(eventId, validatedData);

    const response: ApiResponse<Event | null> = {
      success: true,
      data: updatedEvent,
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

    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const eventId = params.id;

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

    // Verify ownership
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
            message: 'You do not have permission to delete this event',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    await deleteEvent(eventId);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete event',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
