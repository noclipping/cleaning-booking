import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerData, 
      serviceDetails, 
      totalPrice, 
      recurringType 
    } = body;

    // Validate required data
    if (!customerData || !serviceDetails || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required booking data' },
        { status: 400 }
      );
    }

    // Store all booking data in session metadata for webhook processing
    const metadata = {
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      serviceAddress: customerData.address,
      serviceType: serviceDetails.serviceType,
      scheduledDate: customerData.scheduledDate,
      scheduledTime: customerData.scheduledTime,
      notes: customerData.notes || '',
      // Service details
      bedrooms: serviceDetails.bedrooms || 1,
      bathrooms: serviceDetails.bathrooms || 1,
      // Appliance services
      oven_cleaning: serviceDetails.selectedAppliances?.includes('oven') || false,
      oven_count: serviceDetails.ovenCount || 0,
      microwave_dishwasher_cleaning: serviceDetails.selectedAppliances?.includes('microwave-dishwasher') || false,
      microwave_dishwasher_count: serviceDetails.microwaveDishwasherCount || 0,
      refrigerator_cleaning: serviceDetails.selectedAppliances?.includes('refrigerator') || false,
      refrigerator_count: serviceDetails.refrigeratorCount || 0,
      // Wall and window services
      wall_cleaning: serviceDetails.selectedWalls?.includes('walls') || false,
      wall_rooms_count: serviceDetails.wallRoomsCount || 0,
      interior_window_cleaning: serviceDetails.selectedWindows?.includes('interior-windows') || false,
      exterior_window_cleaning: serviceDetails.selectedWindows?.includes('exterior-windows') || false,
      exterior_windows_count: serviceDetails.exteriorWindows || 0,
      // Additional services
      laundry_service: serviceDetails.selectedAdditional?.includes('laundry') || false,
      laundry_loads: serviceDetails.laundryLoads || 0,
      make_beds: serviceDetails.selectedAdditional?.includes('make-beds') || false,
      beds_count: serviceDetails.beds || 0,
      trash_removal: serviceDetails.selectedAdditional?.includes('trash-removal') || false,
      trash_bags: serviceDetails.trashBags || 0,
      // Recurring service info
      recurringType: recurringType || 'one-time',
      recurringFrequency: recurringType === 'one-time' ? null : recurringType,
      discountPercentage: recurringType !== 'one-time' ? 10 : 0,
    };

    // Create service description for Stripe
    const serviceDescription = createServiceDescription(serviceDetails, recurringType);

    if (recurringType !== 'one-time') {
      // Create recurring subscription
      return await createRecurringSubscription(customerData, serviceDescription, totalPrice, metadata);
    } else {
      // Create one-time payment
      return await createOneTimePayment(customerData, serviceDescription, totalPrice, metadata);
    }

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

async function createRecurringSubscription(customerData: any, description: string, amount: number, metadata: any) {
  try {
    // Create or get Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerData.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        metadata: {
          address: customerData.address,
        },
      });
    }

    // Determine billing cycle
    const interval = metadata.recurringType === 'weekly' ? 'week' : 'month';
    const intervalCount = metadata.recurringType === 'biweekly' ? 2 : 1;

    // Create product and price
    const product = await stripe.products.create({
      name: `Recurring Cleaning Service - ${metadata.recurringType}`,
      description: description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: interval,
        interval_count: intervalCount,
      },
    });

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking`,
      metadata: metadata,
      subscription_data: {
        metadata: metadata,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw error;
  }
}

async function createOneTimePayment(customerData: any, description: string, amount: number, metadata: any) {
  try {
    // Create or get Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerData.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        metadata: {
          address: customerData.address,
        },
      });
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Cleaning Service',
              description: description,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking`,
      metadata: metadata,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Payment creation error:', error);
    throw error;
  }
}

function createServiceDescription(serviceDetails: any, recurringType: string): string {
  const details = [];
  
  // Service type
  const serviceTypeMap: { [key: string]: string } = {
    'regular': 'Regular Cleaning',
    'deep': 'Deep Cleaning',
    'move-in': 'Move-in/Move-out Cleaning',
    'post-construction': 'Post-Construction Cleaning'
  };
  details.push(serviceTypeMap[serviceDetails.serviceType] || serviceDetails.serviceType);
  
  // Property details
  if (serviceDetails.bedrooms) details.push(`${serviceDetails.bedrooms} bedrooms`);
  if (serviceDetails.bathrooms) details.push(`${serviceDetails.bathrooms} bathrooms`);
  
  // Appliance services
  if (serviceDetails.selectedAppliances?.includes('oven') && serviceDetails.ovenCount > 0) {
    details.push(`Oven cleaning (${serviceDetails.ovenCount})`);
  }
  if (serviceDetails.selectedAppliances?.includes('microwave-dishwasher') && serviceDetails.microwaveDishwasherCount > 0) {
    details.push(`Microwave/Dishwasher cleaning (${serviceDetails.microwaveDishwasherCount})`);
  }
  if (serviceDetails.selectedAppliances?.includes('refrigerator') && serviceDetails.refrigeratorCount > 0) {
    details.push(`Refrigerator cleaning (${serviceDetails.refrigeratorCount})`);
  }
  
  // Wall and window services
  if (serviceDetails.selectedWalls?.includes('walls') && serviceDetails.wallRoomsCount > 0) {
    details.push(`Wall cleaning (${serviceDetails.wallRoomsCount} rooms)`);
  }
  if (serviceDetails.selectedWindows?.includes('interior-windows')) {
    details.push('Interior window cleaning');
  }
  if (serviceDetails.selectedWindows?.includes('exterior-windows') && serviceDetails.exteriorWindows > 0) {
    details.push(`Exterior window cleaning (${serviceDetails.exteriorWindows})`);
  }
  
  // Additional services
  if (serviceDetails.selectedAdditional?.includes('laundry') && serviceDetails.laundryLoads > 0) {
    details.push(`Laundry service (${serviceDetails.laundryLoads} loads)`);
  }
  if (serviceDetails.selectedAdditional?.includes('make-beds') && serviceDetails.beds > 0) {
    details.push(`Make beds (${serviceDetails.beds})`);
  }
  if (serviceDetails.selectedAdditional?.includes('trash-removal') && serviceDetails.trashBags > 0) {
    details.push(`Trash removal (${serviceDetails.trashBags} bags)`);
  }
  
  // Recurring service info
  if (recurringType !== 'one-time') {
    details.push(`${recurringType} recurring service`);
  }
  
  if (details.length > 0) {
    return details.join(', ');
  }
  
  return 'Cleaning Service';
} 