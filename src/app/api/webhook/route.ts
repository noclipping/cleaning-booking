import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../lib/db';
import { googleCalendar } from '../../../../lib/google-calendar';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('Webhook endpoint called');
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  console.log('Webhook signature:', signature ? 'Present' : 'Missing');
  console.log('Webhook body length:', body.length);
  console.log('Webhook body preview:', body.substring(0, 200));

  let event: Stripe.Event;

  try {
    // Handle different signature scenarios
    if (process.env.NODE_ENV === 'development' && (!signature || signature === 'test')) {
      console.log('Development mode: Bypassing signature verification');
      event = JSON.parse(body) as Stripe.Event;
    } else if (!signature) {
      console.error('No signature header found');
      return NextResponse.json({ error: 'No signature header' }, { status: 400 });
    } else {
      // Real Stripe webhook - verify signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
    console.log('Webhook event verified successfully:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing completed checkout session:', session.id);
  console.log('Session metadata:', session.metadata);

  if (session.mode === 'payment') {
    // One-time payment completed
    console.log('Creating booking from payment session...');
    await createBookingFromSession(session);
    console.log('Booking creation completed for session:', session.id);
  } else if (session.mode === 'subscription') {
    // Subscription created - the first booking will be created when the subscription is confirmed
    console.log('Subscription created, waiting for subscription confirmation');
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id);

  // Create the first booking for the subscription
  await createBookingFromSubscription(subscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id);

  // Update booking status if needed
  const booking = await db.getBookingByStripeSubscriptionId(subscription.id);
  if (booking) {
    let status: 'confirmed' | 'cancelled' | 'pending' | 'completed' = 'confirmed';
    if (subscription.status === 'canceled') {
      status = 'cancelled';
    } else if (subscription.status === 'past_due') {
      status = 'pending';
    }

    await db.updateBooking(booking.id.toString(), { status });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id);

  // Cancel the booking
  const booking = await db.getBookingByStripeSubscriptionId(subscription.id);
  if (booking) {
    await db.updateBooking(booking.id.toString(), { status: 'cancelled' });
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment succeeded:', invoice.id);

  if (invoice.subscription) {
    // Create a new booking for recurring service
    await createRecurringBooking(invoice);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment failed:', invoice.id);

  if (invoice.subscription) {
    // Mark the booking as pending payment
    const booking = await db.getBookingByStripeSubscriptionId(invoice.subscription as string);
    if (booking) {
      await db.updateBooking(booking.id.toString(), { status: 'pending' });
    }
  }
}

async function createBookingFromSession(session: Stripe.Checkout.Session) {
  try {
    // Extract booking data from session metadata
    const metadata = session.metadata!;

    console.log('Session metadata keys:', Object.keys(metadata));
    console.log('Session metadata values:', metadata);
    console.log('Session customer:', session.customer);
    console.log('Session amount_total:', session.amount_total);

    // Check if we have the required metadata
    if (!metadata.customerEmail || !metadata.customerName) {
      console.error('Missing required metadata for booking creation');
      console.error('Available metadata:', metadata);
      throw new Error('Missing required customer information in session metadata');
    }

    // Check if booking already exists for this session
    const existingBooking = await db.getBookingByStripeSessionId(session.id);
    if (existingBooking) {
      console.log('Booking already exists for session:', session.id);
      return existingBooking;
    }

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

    console.log('Booking created from session:', booking.id);

    // Create Google Calendar event
    try {
      console.log('Webhook: Attempting to create Google Calendar event...');
      console.log('Webhook: Calendar ID:', process.env.GOOGLE_CALENDAR_ID || 'primary');

      const calendarEvent = await googleCalendar.createCleaningEvent(booking);

      // Update booking with Google Calendar event ID
      await db.updateBooking(booking.id.toString(), {
        google_calendar_event_id: calendarEvent.id
      });

      console.log('Webhook: Google Calendar event created:', calendarEvent.id);
    } catch (calendarError) {
      console.error('Webhook: Failed to create Google Calendar event:', calendarError);
      console.error('Webhook: Error details:', {
        message: calendarError instanceof Error ? calendarError.message : 'Unknown error',
        code: (calendarError as any)?.code,
        status: (calendarError as any)?.status
      });
      // Don't fail the booking creation if calendar creation fails
      // The booking is still valid without the calendar event
    }
  } catch (error) {
    console.error('Error creating booking from session:', error);
    throw error;
  }
}

async function createBookingFromSubscription(subscription: Stripe.Subscription) {
  try {
    // Extract booking data from subscription metadata
    const metadata = subscription.metadata;

    // Create or get customer
    let customer = await db.getCustomerByEmail(metadata.customerEmail);
    if (!customer) {
      customer = await db.createCustomer({
        name: metadata.customerName,
        email: metadata.customerEmail,
        phone: metadata.customerPhone,
        address: metadata.serviceAddress,
        stripe_customer_id: subscription.customer as string,
      });
    }

    // Calculate amount from subscription
    const amount = subscription.items.data[0]?.price?.unit_amount ?
      subscription.items.data[0].price.unit_amount / 100 : 0;

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
      stripe_payment_intent_id: null,
      stripe_session_id: null,
      stripe_subscription_id: subscription.id,
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

    console.log('Booking created from subscription:', booking.id);

    // Create Google Calendar event
    try {
      console.log('Webhook: Attempting to create Google Calendar event for subscription...');
      const calendarEvent = await googleCalendar.createCleaningEvent(booking);

      // Update booking with Google Calendar event ID
      await db.updateBooking(booking.id.toString(), {
        google_calendar_event_id: calendarEvent.id
      });

      console.log('Webhook: Google Calendar event created for subscription:', calendarEvent.id);
    } catch (calendarError) {
      console.error('Webhook: Failed to create Google Calendar event for subscription:', calendarError);
      // Don't fail the booking creation if calendar creation fails
      // The booking is still valid without the calendar event
    }
  } catch (error) {
    console.error('Error creating booking from subscription:', error);
    throw error;
  }
}

async function createRecurringBooking(invoice: Stripe.Invoice) {
  try {
    // Get the original booking to copy details
    const originalBooking = await db.getBookingByStripeSubscriptionId(invoice.subscription as string);
    if (!originalBooking) {
      console.error('Original booking not found for subscription:', invoice.subscription);
      return;
    }

    // Calculate next service date based on recurring frequency
    const lastServiceDate = new Date(originalBooking.scheduled_date);
    let nextServiceDate = new Date(lastServiceDate);

    const recurringFrequency = (originalBooking as any).recurring_frequency;
    if (recurringFrequency === 'weekly') {
      nextServiceDate.setDate(lastServiceDate.getDate() + 7);
    } else if (recurringFrequency === 'biweekly') {
      nextServiceDate.setDate(lastServiceDate.getDate() + 14);
    }

    // Create new booking for the recurring service
    const booking = await db.createBooking({
      customer_name: originalBooking.customer_name,
      customer_email: originalBooking.customer_email,
      customer_phone: originalBooking.customer_phone,
      service_address: originalBooking.service_address,
      service_type: originalBooking.service_type,
      amount: originalBooking.amount,
      status: 'confirmed',
      scheduled_date: nextServiceDate.toISOString().split('T')[0],
      scheduled_time: originalBooking.scheduled_time,
      notes: `Recurring service - ${recurringFrequency}`,
      stripe_payment_intent_id: invoice.payment_intent as string,
      stripe_session_id: null,
      stripe_subscription_id: invoice.subscription as string,
      // Recurring service info
      recurring_type: (originalBooking as any).recurring_type,
      recurring_frequency: recurringFrequency,
      discount_percentage: (originalBooking as any).discount_percentage,
      // Service details
      bedrooms: (originalBooking as any).bedrooms,
      bathrooms: (originalBooking as any).bathrooms,
      // Appliance services with quantities
      oven_cleaning: (originalBooking as any).oven_cleaning,
      oven_count: (originalBooking as any).oven_count,
      microwave_dishwasher_cleaning: (originalBooking as any).microwave_dishwasher_cleaning,
      microwave_dishwasher_count: (originalBooking as any).microwave_dishwasher_count,
      refrigerator_cleaning: (originalBooking as any).refrigerator_cleaning,
      refrigerator_count: (originalBooking as any).refrigerator_count,
      // Wall and window services
      wall_cleaning: (originalBooking as any).wall_cleaning,
      wall_rooms_count: (originalBooking as any).wall_rooms_count,
      interior_window_cleaning: (originalBooking as any).interior_window_cleaning,
      exterior_window_cleaning: (originalBooking as any).exterior_window_cleaning,
      exterior_windows_count: (originalBooking as any).exterior_windows_count,
      // Additional services
      laundry_service: (originalBooking as any).laundry_service,
      laundry_loads: (originalBooking as any).laundry_loads,
      make_beds: (originalBooking as any).make_beds,
      beds_count: (originalBooking as any).beds_count,
      trash_removal: (originalBooking as any).trash_removal,
      trash_bags: (originalBooking as any).trash_bags,
    });

    console.log('Recurring booking created:', booking.id);

    // Create Google Calendar event for recurring booking
    try {
      console.log('Webhook: Attempting to create Google Calendar event for recurring booking...');
      const calendarEvent = await googleCalendar.createCleaningEvent(booking);

      // Update booking with Google Calendar event ID
      await db.updateBooking(booking.id.toString(), {
        google_calendar_event_id: calendarEvent.id
      });

      console.log('Webhook: Google Calendar event created for recurring booking:', calendarEvent.id);
    } catch (calendarError) {
      console.error('Webhook: Failed to create Google Calendar event for recurring booking:', calendarError);
      // Don't fail the booking creation if calendar creation fails
    }
  } catch (error) {
    console.error('Error creating recurring booking:', error);
    throw error;
  }
} 