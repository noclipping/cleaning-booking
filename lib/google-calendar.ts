import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

class GoogleCalendarService {
    private auth: JWT;
    private calendar: any;

    constructor() {
        // Use Service Account authentication
        this.auth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    }

    async createCleaningEvent(booking: any) {
        try {
            console.log('Google Calendar: Creating event for booking:', {
                id: booking.id,
                customer_name: booking.customer_name,
                scheduled_date: booking.scheduled_date,
                scheduled_time: booking.scheduled_time,
                service_type: booking.service_type
            });

            // Debug environment variables
            console.log('Google Calendar: Environment check:', {
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Not set',
                privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Not set'
            });

            const event = {
                summary: `Cleaning Service - ${booking.customer_name}`,
                description: this.generateEventDescription(booking),
                start: {
                    dateTime: this.formatDateTime(booking.scheduled_date, booking.scheduled_time),
                    timeZone: 'America/New_York', // Adjust to your timezone
                },
                end: {
                    dateTime: this.calculateEndTime(booking.scheduled_date, booking.scheduled_time, booking.service_type),
                    timeZone: 'America/New_York', // Adjust to your timezone
                },
                location: booking.service_address,
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 24 hours
                        { method: 'popup', minutes: 60 }, // 1 hour
                    ],
                },
                extendedProperties: {
                    private: {
                        bookingId: booking.id.toString(),
                        serviceType: booking.service_type,
                        paymentStatus: booking.status,
                    },
                },
            };

            console.log('Google Calendar: Attempting to insert event into calendar:', process.env.GOOGLE_CALENDAR_ID || 'primary');

            const response = await this.calendar.events.insert({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                resource: event,
            });

            console.log('Google Calendar: Event created successfully:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('Google Calendar: Error creating event:', error);
            console.error('Google Calendar: Error details:', {
                message: error.message,
                code: error.code,
                status: error.status,
                errors: error.errors
            });
            throw error;
        }
    }

    async updateCleaningEvent(eventId: string, booking: any) {
        try {
            const event = {
                summary: `Cleaning Service - ${booking.customer_name}`,
                description: this.generateEventDescription(booking),
                start: {
                    dateTime: this.formatDateTime(booking.service_date, booking.service_time),
                    timeZone: 'America/New_York',
                },
                end: {
                    dateTime: this.calculateEndTime(booking.service_date, booking.service_time, booking.service_type),
                    timeZone: 'America/New_York',
                },
                location: booking.service_address,
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 60 },
                    ],
                },
                extendedProperties: {
                    private: {
                        bookingId: booking.id.toString(),
                        serviceType: booking.service_type,
                        paymentStatus: booking.payment_status,
                    },
                },
            };

            const response = await this.calendar.events.update({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                eventId: eventId,
                resource: event,
            });

            return response.data;
        } catch (error) {
            console.error('Error updating Google Calendar event:', error);
            throw error;
        }
    }

    async deleteCleaningEvent(eventId: string) {
        try {
            await this.calendar.events.delete({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                eventId: eventId,
            });
        } catch (error) {
            console.error('Error deleting Google Calendar event:', error);
            throw error;
        }
    }

    private generateEventDescription(booking: any): string {
        const serviceTypeNames = {
            'regular': 'Regular Cleaning',
            'deep-cleaning': 'Deep Cleaning',
            'move-in': 'Move-in Cleaning',
            'move-out': 'Move-out Cleaning',
            'post-construction': 'Post-Construction Cleaning',
        };

        const frequencyNames = {
            'one-time': 'One-time',
            'weekly': 'Weekly',
            'bi-weekly': 'Bi-weekly',
            'monthly': 'Monthly',
        };

        return `
🧹 ${serviceTypeNames[booking.service_type] || 'Cleaning Service'}

📅 Service Details:
• Date: ${new Date(booking.scheduled_date).toLocaleDateString()}
• Time: ${booking.scheduled_time}
• Frequency: ${frequencyNames[booking.recurring_type] || 'One-time'}
• Duration: ${this.getServiceDuration(booking.service_type)} hours

👤 Customer Information:
• Name: ${booking.customer_name}
• Email: ${booking.customer_email}
• Phone: ${booking.customer_phone}
• Address: ${booking.service_address}

💰 Payment Information:
• Amount: $${booking.amount}
• Status: ${booking.status}
• Booking ID: ${booking.id}

📝 Special Instructions:
${booking.notes || 'No special instructions provided.'}

---
Created by Cleaning Service Booking System
    `.trim();
    }

    private formatDateTime(date: string, time: string): string {
        // Add null checks and debugging
        if (!date || !time) {
            console.error('formatDateTime: Missing date or time', { date, time });
            throw new Error('Date and time are required');
        }

        // Ensure time has seconds (add :00 if missing)
        const timeWithSeconds = time.includes(':') && time.split(':').length === 2
            ? `${time}:00`
            : time;

        const dateTime = new Date(`${date}T${timeWithSeconds}`);
        return dateTime.toISOString();
    }

    private calculateEndTime(date: string, time: string, serviceType: string): string {
        // Add null checks and debugging
        if (!date || !time) {
            console.error('calculateEndTime: Missing date or time', { date, time });
            throw new Error('Date and time are required');
        }

        // Ensure time has seconds (add :00 if missing)
        const timeWithSeconds = time.includes(':') && time.split(':').length === 2
            ? `${time}:00`
            : time;

        const startTime = new Date(`${date}T${timeWithSeconds}`);
        const durationHours = this.getServiceDuration(serviceType);
        const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
        return endTime.toISOString();
    }

    private getServiceDuration(serviceType: string): number {
        const durations = {
            'regular': 2,
            'deep-cleaning': 4,
            'move-in': 6,
            'move-out': 6,
            'post-construction': 8,
        };
        return durations[serviceType] || 2;
    }
}

export const googleCalendar = new GoogleCalendarService(); 