# Stripe Setup Guide

## **For New Developers - Important Notes**

### **🔑 Key Architecture Decision: Payment-First Booking Creation**
This system uses a **payment-first approach** where:
- **NO bookings are created in the database until payment is confirmed**
- All booking data is stored in Stripe session metadata during checkout
- Bookings are only created via webhook after successful payment
- Failed payments result in no database entries

**Why this approach?**
- ✅ Prevents orphaned bookings from failed payments
- ✅ Ensures accurate revenue tracking
- ✅ Maintains clean database with only paid bookings
- ✅ Better security and data integrity

### **🔄 Critical Flow Understanding**
1. Customer submits form → Data sent to `/api/checkout`
2. Checkout API stores data in Stripe metadata → Creates Stripe session
3. Customer redirected to Stripe Checkout → Payment processing
4. **Payment Success** → Stripe webhook → `/api/webhook` → Booking created
5. **Payment Failure** → No webhook → No booking created

## **1. Create Stripe Account**
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete your business verification
3. Navigate to the Dashboard

## **2. Get API Keys**
1. In Stripe Dashboard, go to **Developers > API Keys**
2. Copy your **Publishable Key** and **Secret Key**
3. For testing, use the **Test** keys (they start with `pk_test_` and `sk_test_`)

## **3. Set Environment Variables**
Create a `.env.local` file in your project root:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Supabase (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## **4. Install Stripe CLI (Optional but Recommended)**
```bash
# Windows (using chocolatey)
choco install stripe-cli

# Or download from: https://github.com/stripe/stripe-cli/releases
```

## **5. Set Up Webhook Endpoint**
1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set URL to: `https://your-domain.com/api/webhook` (for production)
4. For local testing, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
5. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## **6. Test the Integration**

### **Test Cards:**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### **Test the Flow:**
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/booking`
3. Fill out the booking form
4. Use test card `4242 4242 4242 4242`
5. Complete the payment
6. Check your admin dashboard for the booking

## **7. Monitor Webhooks**
- Use Stripe Dashboard > **Developers > Webhooks** to see webhook delivery
- Check your server logs for webhook processing
- Use Stripe CLI to see real-time webhook events locally

## **8. Production Deployment**
1. Switch to **Live** keys in Stripe Dashboard
2. Update environment variables with live keys
3. Set up production webhook endpoint
4. Test with real payment methods

## **Troubleshooting:**
- **Webhook failures**: Check your server logs and Stripe webhook dashboard
- **Payment failures**: Use Stripe Dashboard > **Payments** to see detailed error messages
- **CORS issues**: Ensure your domain is properly configured in Stripe settings

## **Developer Handoff Checklist**

### **Before Handing Off:**
- [ ] All environment variables documented
- [ ] Database schema properly set up
- [ ] Stripe webhook endpoint configured
- [ ] Test payments working correctly
- [ ] Admin dashboard accessible
- [ ] Documentation updated

### **For New Developer:**
- [ ] Review payment-first architecture (see above)
- [ ] Understand webhook flow and booking creation
- [ ] Test both one-time and recurring payments
- [ ] Verify admin dashboard functionality
- [ ] Check error handling and logging

### **Critical Files to Understand:**
- `src/app/api/checkout/route.ts` - Creates Stripe sessions with metadata
- `src/app/api/webhook/route.ts` - Creates bookings after payment success
- `lib/db.ts` - Database operations
- `components/PriceCalculator.tsx` - Pricing logic
- `components/BookingForm.tsx` - Form submission to checkout

### **Important Notes:**
- **Never modify webhook signature verification** - this is critical for security
- **Always test webhook delivery** before going live
- **Monitor webhook failures** in production
- **Backup database regularly** - especially before major changes
- **Test recurring payments thoroughly** - they create multiple bookings over time 