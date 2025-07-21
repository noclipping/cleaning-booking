# Stripe Integration Testing Guide

## **Quick Setup Checklist**

### **1. Environment Variables**
Create `.env.local` in your project root:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **2. Database Setup**
Run the migration script in your Supabase SQL editor:
```sql
-- Run migration.sql to add new fields
-- Then run reset-with-dummy-data.sql for testing data
```

### **3. Start Development Server**
```bash
npm run dev
```

## **Testing Flow**

### **Step 1: Test One-Time Payment**
1. Go to `http://localhost:3000/booking`
2. Fill out the booking form:
   - Select "Regular Cleaning" ($90)
   - Choose 2 bedrooms, 1 bathroom
   - Add some appliance services
   - Set date/time
   - Fill customer info
3. Click "Book Now"
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Check admin dashboard: `http://localhost:3000/admin`

### **Step 2: Test Recurring Payment**
1. Repeat the booking process
2. Select "Weekly" or "Bi-weekly" recurring
3. Notice 10% discount applied
4. Complete payment with test card
5. Check admin dashboard for recurring booking

### **Step 3: Test Payment Failures**
1. Use declined card: `4000 0000 0000 0002`
2. Verify no booking is created in database

## **Test Cards**

| Card Number | Description | Result |
|-------------|-------------|---------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0000 0000 0002` | Generic decline | ❌ Declined |
| `4000 0025 0000 3155` | Requires authentication | 🔐 3D Secure |

## **Webhook Testing**

### **Local Testing with Stripe CLI**
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

### **Monitor Webhooks**
- Check terminal for webhook events
- Verify booking creation in admin dashboard
- Check Stripe Dashboard > Webhooks for delivery status

## **Expected Behavior**

### **One-Time Payments:**
- ✅ Booking created immediately after payment
- ✅ Status: "confirmed"
- ✅ Shows in admin dashboard

### **Recurring Payments:**
- ✅ First booking created after subscription confirmation
- ✅ Status: "confirmed"
- ✅ Additional bookings created on invoice payments
- ✅ 10% discount applied

### **Payment Failures:**
- ❌ No booking created
- ❌ Customer stays on booking page
- ❌ Error message displayed

## **Troubleshooting**

### **Common Issues:**

1. **"Failed to create checkout session"**
   - Check Stripe API keys
   - Verify environment variables
   - Check server logs

2. **"Webhook signature verification failed"**
   - Verify webhook secret
   - Check webhook endpoint URL
   - Ensure Stripe CLI is forwarding correctly

3. **"Booking not created after payment"**
   - Check webhook delivery in Stripe Dashboard
   - Verify webhook endpoint is accessible
   - Check server logs for errors

4. **"TypeScript errors"**
   - Run `npm install` to ensure all packages installed
   - Check for missing imports
   - Verify type definitions

### **Debug Steps:**
1. Check browser console for errors
2. Check server logs in terminal
3. Verify Stripe Dashboard > Events
4. Check Supabase logs for database errors

## **Production Checklist**

Before going live:
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Set up proper error monitoring
- [ ] Configure email notifications
- [ ] Set up admin authentication

## **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review Stripe documentation
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly 