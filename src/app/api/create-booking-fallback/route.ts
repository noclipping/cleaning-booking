import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../lib/db';
import { googleCalendar } from '../../../../lib/google-calendar';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        console.log('Fallback: Creating booking for session:', sessionId);

        // Get the Stripe session to extract metadata
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session.metadata) {
            return NextResponse.json({ error: 'No metadata found in session' }, { status: 400 });
        }

        // Check if booking already exists
        const existingBooking = await db.getBookingByStripeSessionId(sessionId);
        if (existingBooking) {
            console.log('Fallback: Booking already exists for session:', sessionId);
            return NextResponse.json(existingBooking);
        }

        const metadata = session.metadata;
        console.log('Fallback: Session metadata:', metadata);

        // Create or get customer
        let customer = await db.getCustomerByEmail(metadata.customerEmail);
        if (!customer) {
            customer = await db.createCustomer({
                name: metadata.customerName,
                email: metadata.customerEmail,
                phone: metadata.customerPhone,
                address: metadata.serviceAddress,
                stripe_customer_id: session.customer as string,
            });
        }

        // Calculate amount from session
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        // Create booking
        const booking = await db.createBooking({
            customer_name: metadata.customerName,
            customer_email: metadata.customerEmail,
            customer_phone: metadata.customerPhone,
            service_address: metadata.serviceAddress,
            service_type: metadata.serviceType,
            amount,
            status: 'confirmed',
            scheduled_date: metadata.scheduledDate,
            scheduled_time: metadata.scheduledTime,
            notes: metadata.notes,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_session_id: session.id,
            // Recurring service info
            recurring_type: metadata.recurringType || 'one-time',
            recurring_frequency: metadata.recurringFrequency || null,
            discount_percentage: parseInt(metadata.discountPercentage) || 0,
            // Service details
            bedrooms: parseInt(metadata.bedrooms) || 1,
            bathrooms: parseFloat(metadata.bathrooms) || 1,
            // Appliance services with quantities
            oven_cleaning: metadata.oven_cleaning === 'true',
            oven_count: parseInt(metadata.oven_count) || 0,
            microwave_dishwasher_cleaning: metadata.microwave_dishwasher_cleaning === 'true',
            microwave_dishwasher_count: parseInt(metadata.microwave_dishwasher_count) || 0,
            refrigerator_cleaning: metadata.refrigerator_cleaning === 'true',
            refrigerator_count: parseInt(metadata.refrigerator_count) || 0,
            // Wall and window services
            wall_cleaning: metadata.wall_cleaning === 'true',
            wall_rooms_count: parseInt(metadata.wall_rooms_count) || 0,
            interior_window_cleaning: metadata.interior_window_cleaning === 'true',
            exterior_window_cleaning: metadata.exterior_window_cleaning === 'true',
            exterior_windows_count: parseInt(metadata.exterior_windows_count) || 0,
            // Additional services
            laundry_service: metadata.laundry_service === 'true',
            laundry_loads: parseInt(metadata.laundry_loads) || 0,
            make_beds: metadata.make_beds === 'true',
            beds_count: parseInt(metadata.beds_count) || 0,
            trash_removal: metadata.trash_removal === 'true',
            trash_bags: parseInt(metadata.trash_bags) || 0,
        });

        console.log('Fallback: Booking created:', booking.id);

        // Create Google Calendar event
        try {
            console.log('Fallback: Attempting to create Google Calendar event...');
            console.log('Fallback: Calendar ID:', process.env.GOOGLE_CALENDAR_ID || 'primary');
            console.log('Fallback: Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Not set');
            console.log('Fallback: Private Key:', process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Not set');

            const calendarEvent = await googleCalendar.createCleaningEvent(booking);

            // Update booking with Google Calendar event ID
            await db.updateBooking(booking.id.toString(), {
                google_calendar_event_id: calendarEvent.id
            });

            console.log('Fallback: Google Calendar event created:', calendarEvent.id);
        } catch (calendarError) {
            console.error('Fallback: Failed to create Google Calendar event:', calendarError);
            console.error('Fallback: Error details:', {
                message: calendarError.message,
                code: calendarError.code,
                status: calendarError.status
            });
            // Don't fail the booking creation if calendar creation fails
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Fallback: Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
} 