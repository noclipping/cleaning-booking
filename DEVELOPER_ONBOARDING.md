# Developer Onboarding Guide

## 🚀 Quick Start for New Developers

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Basic knowledge of React, Next.js, and TypeScript

### **1. Project Setup (5 minutes)**
```bash
# Clone the repository
git clone <repository-url>
cd cleaning-booking

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local  # (if .env.example exists)
# Or create .env.local manually with the variables below
```

### **2. Environment Variables**
Create `.env.local` with these variables:
```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (Required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **3. Database Setup**
1. Create Supabase account at [supabase.com](https://supabase.com)
2. Create new project
3. Get your project URL and keys from Project Settings > API
4. Run this SQL in Supabase SQL Editor:
   ```sql
   -- Run the contents of supabase-schema.sql
   ```

### **4. Stripe Setup**
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard > Developers > API Keys
3. Set up webhook endpoint (see SETUP.md for details)

### **5. Start Development**
```bash
npm run dev
```
Visit `http://localhost:3000` to see the app!

## 🏗️ Architecture Overview

### **Payment-First Design**
This is a **critical concept** to understand:

```
Customer Form → Stripe Checkout → Payment Success → Webhook → Database
     ↓              ↓                ↓              ↓         ↓
   No DB         Metadata        Webhook         Create     Booking
   Entry         Storage         Trigger         Booking    Created
```

**Why this approach?**
- No orphaned bookings from failed payments
- Accurate revenue tracking
- Clean database with only paid bookings

### **Key Components**

#### **Frontend**
- `src/app/page.tsx` - Landing page
- `src/app/booking/page.tsx` - Main booking flow
- `src/app/admin/page.tsx` - Admin dashboard
- `components/PriceCalculator.tsx` - Dynamic pricing
- `components/BookingForm.tsx` - Customer form

#### **Backend**
- `src/app/api/checkout/route.ts` - Creates Stripe sessions
- `src/app/api/webhook/route.ts` - Handles payment confirmations
- `src/app/api/admin/bookings/route.ts` - Admin API
- `lib/db.ts` - Database operations

#### **Database**
- `bookings` table - All booking data
- `customers` table - Customer profiles
- Supabase for hosting and real-time features

## 🔄 Development Workflow

### **Making Changes**

1. **Frontend Changes**
   ```bash
   # Edit components in /components or /src/app
   # Changes auto-reload in development
   ```

2. **API Changes**
   ```bash
   # Edit files in /src/app/api
   # Restart dev server if needed
   ```

3. **Database Changes**
   ```bash
   # Edit supabase-schema.sql
   # Run in Supabase SQL Editor
   # Update lib/db.ts if needed
   ```

### **Testing Your Changes**

1. **Test Booking Flow**
   - Go to `/booking`
   - Fill out form
   - Use test card: `4242 4242 4242 4242`
   - Verify booking appears in admin dashboard

2. **Test Admin Dashboard**
   - Go to `/admin`
   - View bookings
   - Update status
   - Check all data displays correctly

3. **Test Recurring Services**
   - Create booking with weekly/bi-weekly option
   - Verify 10% discount applied
   - Check subscription handling

## 🐛 Common Issues & Solutions

### **"Failed to create checkout session"**
- Check Stripe API keys in `.env.local`
- Verify all environment variables are set
- Check server logs for detailed errors

### **"Webhook signature verification failed"**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook endpoint URL
- Ensure webhook is properly configured in Stripe Dashboard

### **"Booking not created after payment"**
- Check webhook delivery in Stripe Dashboard
- Verify webhook endpoint is accessible
- Check server logs for webhook processing errors

### **Database connection issues**
- Verify Supabase URL and keys
- Check Supabase project status
- Ensure database schema is properly set up

## 📁 File Structure Deep Dive

### **Critical Files to Understand**

#### **`src/app/api/checkout/route.ts`**
- Creates Stripe checkout sessions
- Stores booking data in session metadata
- Handles both one-time and recurring payments
- **Key function**: `createBookingFromSession()`

#### **`src/app/api/webhook/route.ts`**
- Processes Stripe webhook events
- Creates bookings only after successful payment
- Handles subscription events for recurring services
- **Key functions**: `handleCheckoutSessionCompleted()`, `createRecurringBooking()`

#### **`lib/db.ts`**
- Database operations using Supabase
- CRUD operations for bookings and customers
- **Key methods**: `createBooking()`, `getBookingByStripeSessionId()`

#### **`components/PriceCalculator.tsx`**
- Dynamic pricing logic
- Service selection and quantity inputs
- Discount calculations for recurring services

## 🧪 Testing Strategy

### **Manual Testing Checklist**
- [ ] One-time payment booking
- [ ] Recurring payment booking
- [ ] Payment failure handling
- [ ] Admin dashboard functionality
- [ ] Price calculator accuracy
- [ ] Form validation
- [ ] Responsive design

### **Test Cards**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### **Webhook Testing**
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### **Environment Variables for Production**
- Use live Stripe keys (not test keys)
- Set production webhook endpoint
- Configure production Supabase project

## 📚 Resources

### **Documentation**
- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [test-stripe.md](./test-stripe.md) - Testing guide

### **External Resources**
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Getting Help

### **When You're Stuck**
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Check Stripe Dashboard for payment status
4. Verify environment variables are correct
5. Test with known working configuration

### **Important Reminders**
- **Never commit `.env.local`** to version control
- **Always test webhook delivery** before going live
- **Backup database** before major changes
- **Monitor webhook failures** in production
- **Test recurring payments thoroughly**

## 🎯 Next Steps

1. **Familiarize yourself** with the payment-first architecture
2. **Test the complete flow** from booking to payment to admin dashboard
3. **Review the code** in the critical files mentioned above
4. **Set up your development environment** with proper keys
5. **Make a small change** and test it thoroughly

Welcome to the project! 🎉 