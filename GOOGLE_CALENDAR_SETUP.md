# Google Calendar Integration Setup Guide

## 🎯 Overview

This guide will help you set up Google Calendar integration for your cleaning service booking system. When a booking is confirmed and paid for, it will automatically create an appointment in the business owner's Google Calendar.

## 🚀 Quick Setup Steps

### **1. Google Cloud Console Setup**

1. **Create Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Note your Project ID

2. **Enable Google Calendar API**

   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

3. **Create Service Account (Recommended for Single Business Owner)**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name like "cleaning-service-calendar"
   - Click "Create and Continue"
   - Skip role assignment, click "Done"
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key" > "JSON"
   - Download the JSON file and save it securely

4. **Share Calendar with Service Account**
   - Open your Google Calendar
   - Find your calendar in the left sidebar
   - Click the three dots next to it > "Settings and sharing"
   - Scroll down to "Share with specific people"
   - Click "Add people"
   - Add the service account email (found in the JSON file: `client_email`)
   - Give it "Make changes to events" permission
   - Click "Send"

### **2. Environment Variables**

Add these to your `.env.local`:

```env
# Google Calendar Integration (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary  # or specific calendar ID
```

**Important**: Copy the `client_email` and `private_key` from your downloaded JSON file.

### **3. Install Dependencies**

```bash
npm install googleapis google-auth-library
```

### **4. Database Migration**

Run this SQL in your Supabase SQL Editor:

```sql
-- Add Google Calendar event ID field to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS google_calendar_event_id VARCHAR(255);

-- Add index for Google Calendar event ID lookups
CREATE INDEX IF NOT EXISTS idx_bookings_google_calendar_event_id
ON bookings(google_calendar_event_id);
```

### **5. That's It!**

No manual connection needed! The system will automatically create calendar events for all confirmed bookings.

## 🔧 How It Works

### **Payment-First Architecture with Calendar Integration**

```
Customer Form → Stripe Checkout → Payment Success → Webhook → Database + Google Calendar
     ↓              ↓                ↓              ↓         ↓              ↓
   No DB         Metadata        Webhook         Create     Booking      Calendar
   Entry         Storage         Trigger         Booking    Created      Event
```

### **Key Components**

1. **`lib/google-calendar.ts`** - Google Calendar service using Service Account
2. **`src/app/api/webhook/route.ts`** - Creates calendar events after payment
3. **No OAuth routes needed** - Service Account handles authentication automatically

### **Event Details**

Each calendar event includes:

- **Title**: "Cleaning Service - [Customer Name]"
- **Location**: Service address
- **Description**: Complete service details, customer info, and booking details
- **Duration**: Based on service type (2-8 hours)
- **Attendees**: Customer email (they'll receive calendar invites)
- **Reminders**: 24-hour email and 1-hour popup reminders

## 🧪 Testing

### **Test the Integration**

1. **Create a Test Booking**

   - Go to `/booking`
   - Fill out the form
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

2. **Check Calendar**

   - Go to your Google Calendar
   - Verify the appointment was created
   - Check that customer received email invitation

3. **Test Recurring Services**
   - Create a weekly/bi-weekly booking
   - Verify calendar events are created for each recurring payment

### **Test Cards**

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

## 🔒 Security Considerations

### **Service Account Security**

- Never commit service account JSON to version control
- Use environment variables for all sensitive data
- Regularly rotate service account keys
- Monitor service account usage in Google Cloud Console

### **Calendar Permissions**

- The service account has "Make changes to events" permission only
- Customers receive calendar invites but can't modify your calendar
- All events are created in your primary calendar (or specified calendar)

## 🚨 Troubleshooting

### **Common Issues**

1. **"Failed to create Google Calendar event"**

   - Check service account credentials are correct
   - Verify Google Calendar API is enabled
   - Ensure calendar is shared with service account email
   - Check server logs for detailed error messages

2. **"Service account not found"**

   - Verify the service account email in environment variables
   - Check that the service account exists in Google Cloud Console

3. **"Calendar event not created after payment"**

   - Check webhook delivery in Stripe Dashboard
   - Verify service account has calendar access
   - Check server logs for calendar creation errors

4. **"Customer not receiving calendar invites"**
   - Verify customer email is correct
   - Check spam folder
   - Ensure `sendUpdates: 'all'` is set in calendar event creation

### **Debug Steps**

1. **Check Server Logs**

   ```bash
   # Look for these log messages:
   # "Google Calendar event created: [event_id]"
   # "Failed to create Google Calendar event: [error]"
   ```

2. **Verify Service Account Setup**

   - Check environment variables are set correctly
   - Verify calendar sharing permissions
   - Test service account access manually

3. **Check Calendar Permissions**
   - Verify the service account has calendar access
   - Check if calendar ID is correct

## 📊 Production Deployment

### **Before Going Live**

1. **Update Service Account**

   - Use production service account credentials
   - Ensure calendar is shared with production service account
   - Configure proper IAM roles if needed

2. **Environment Variables**

   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-production-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_CALENDAR_ID=primary
   ```

3. **Test Production Flow**
   - Test with real payment methods
   - Verify calendar events are created
   - Check customer email delivery

### **Monitoring**

1. **Monitor Webhook Failures**

   - Check Stripe Dashboard > Webhooks
   - Monitor server logs for calendar creation errors

2. **Calendar Usage**
   - Monitor Google Cloud Console > APIs & Services > Dashboard
   - Check calendar API quota usage

## 🔄 Advanced Features

### **Custom Calendar ID**

To use a specific calendar instead of primary:

```env
GOOGLE_CALENDAR_ID=your_calendar_id_here
```

### **Custom Event Duration**

Modify duration in `lib/google-calendar.ts`:

```typescript
private calculateEndTime(date: string, time: string, serviceType: string): string {
  // Customize duration based on your business needs
  const durationHours = {
    'regular-cleaning': 2,
    'deep-cleaning': 4,
    'move-in-move-out': 6,
    'post-construction': 8,
  }[serviceType] || 2;
  // ...
}
```

### **Custom Reminders**

Modify reminders in calendar event creation:

```typescript
reminders: {
  useDefault: false,
  overrides: [
    { method: 'email', minutes: 24 * 60 }, // 24 hours
    { method: 'popup', minutes: 60 }, // 1 hour
    { method: 'email', minutes: 7 * 24 * 60 }, // 1 week
  ],
},
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly
5. Test service account access manually

## 🎉 Success!

Once set up, your cleaning service will automatically:

- ✅ Create calendar events for all confirmed bookings
- ✅ Send calendar invites to customers
- ✅ Include detailed service information in events
- ✅ Handle recurring service appointments
- ✅ Provide reminders and notifications
- ✅ No manual connection required!

Your business calendar will stay perfectly synchronized with your booking system! 🚀
