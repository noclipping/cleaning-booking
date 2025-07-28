import { NextRequest, NextResponse } from 'next/server';
import { googleCalendar } from '../../../../lib/google-calendar';

export async function GET(request: NextRequest) {
    try {
        console.log('Testing Google Calendar connection...');

        // Test environment variables
        const envCheck = {
            serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Not set',
            privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Not set',
            calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary'
        };

        console.log('Environment check:', envCheck);

        const auth = googleCalendar['auth'];
        const calendar = googleCalendar['calendar'];

        // Test 1: List available calendars
        console.log('Testing calendar list access...');
        const calendarList = await calendar.calendarList.list();
        const availableCalendars = calendarList.data.items?.map(cal => ({
            id: cal.id,
            summary: cal.summary,
            accessRole: cal.accessRole
        })) || [];

        console.log('Available calendars:', availableCalendars);

        // Test 2: Try to access the specific calendar ID
        const targetCalendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
        console.log(`Testing access to calendar: ${targetCalendarId}`);

        let calendarAccess = null;
        try {
            const calendarInfo = await calendar.calendars.get({
                calendarId: targetCalendarId
            });
            calendarAccess = {
                id: calendarInfo.data.id,
                summary: calendarInfo.data.summary,
                accessRole: calendarInfo.data.accessRole
            };
            console.log('Calendar access successful:', calendarAccess);
        } catch (calendarError) {
            console.log('Calendar access failed:', calendarError.message);
            calendarAccess = { error: calendarError.message };
        }

        // Test 3: Try to create a test event
        let testEvent = null;
        try {
            const event = {
                summary: 'Test Event - Calendar Integration',
                description: 'This is a test event to verify calendar integration',
                start: {
                    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    timeZone: 'America/New_York',
                },
                end: {
                    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
                    timeZone: 'America/New_York',
                },
            };

            const createdEvent = await calendar.events.insert({
                calendarId: targetCalendarId,
                requestBody: event,
            });

            testEvent = {
                id: createdEvent.data.id,
                summary: createdEvent.data.summary,
                start: createdEvent.data.start,
                end: createdEvent.data.end
            };

            console.log('Test event created successfully:', testEvent);

            // Clean up - delete the test event
            await calendar.events.delete({
                calendarId: targetCalendarId,
                eventId: createdEvent.data.id,
            });
            console.log('Test event cleaned up');

        } catch (eventError) {
            console.log('Test event creation failed:', eventError.message);
            testEvent = { error: eventError.message };
        }

        return NextResponse.json({
            success: true,
            environment: envCheck,
            availableCalendars,
            calendarAccess,
            testEvent,
            recommendations: availableCalendars.length === 0 ? [
                'No calendars available. You need to share a calendar with your service account.',
                'Go to Google Calendar → Settings → Share with specific people',
                'Add: wcs-calendar@wcs-calendar-467221.iam.gserviceaccount.com',
                'Give "Make changes to events" permission'
            ] : []
        });
    } catch (error) {
        console.error('Calendar test failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: {
                code: error.code,
                status: error.status
            }
        }, { status: 500 });
    }
} 