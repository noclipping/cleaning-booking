import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, metadata } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // Create a test webhook payload
        const webhookPayload = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: sessionId,
                    metadata: metadata || {
                        customerName: 'Test User',
                        customerEmail: 'test@example.com',
                        customerPhone: '1234567890',
                        serviceAddress: '123 Test St',
                        serviceType: 'deep-cleaning',
                        scheduledDate: '2025-07-28',
                        scheduledTime: '10:00 AM'
                    },
                    amount_total: 18500,
                    mode: 'payment',
                    customer: 'cus_test',
                    payment_intent: 'pi_test'
                }
            }
        };

        // Get the current domain for the webhook call
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const host = request.headers.get('host') || 'cleaning-booking-five.vercel.app';
        const baseUrl = `${protocol}://${host}`;

        console.log('Testing webhook with URL:', `${baseUrl}/api/webhook`);

        // Forward to the webhook endpoint
        const response = await fetch(`${baseUrl}/api/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': 'test'
            },
            body: JSON.stringify(webhookPayload)
        });

        const result = await response.text();

        return NextResponse.json({
            success: true,
            webhookResponse: result,
            webhookStatus: response.status,
            webhookUrl: `${baseUrl}/api/webhook`
        });
    } catch (error) {
        console.error('Test webhook error:', error);
        return NextResponse.json({ error: 'Test webhook failed', details: error }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Test webhook endpoint is ready',
        usage: 'POST with { sessionId: "test_session", metadata: {...} }'
    });
}
