import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    console.log('Booking API called with sessionId:', sessionId);
    console.log('Request URL:', request.url);

    if (!sessionId) {
      console.log('Error: Session ID is missing');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get booking by Stripe session ID
    console.log('Database: Searching for booking with sessionId:', sessionId);
    const booking = await db.getBookingByStripeSessionId(sessionId);

    if (!booking) {
      console.log('Database: No booking found for sessionId:', sessionId);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('Database: Booking found:', booking.id);
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
} 