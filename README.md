# Cleaning Service Booking System

A modern, full-stack cleaning service booking application built with Next.js, Supabase, and Stripe. Features dynamic pricing, recurring services, and secure payment processing.

## 🚀 Key Features

### ✅ Core Functionality
- **Dynamic Price Calculator**: Real-time pricing based on service type, rooms, and add-ons
- **Secure Payment Processing**: Stripe integration with webhook-based booking creation
- **Recurring Services**: Weekly/bi-weekly subscriptions with automatic billing
- **Admin Dashboard**: Complete booking management and customer overview
- **Responsive Design**: Mobile-friendly interface

### 💰 Pricing Structure
- **Base Service Prices:**
  - Regular Cleaning: $90
  - Deep Cleaning: $185
  - Move-in/Move-out: $280
  - Post-Construction: $400

- **Room-Based Pricing:**
  - Additional bedrooms: $47.50 each (beyond the first)
  - Additional bathrooms: $57.50 each (beyond the first)

- **Appliance Cleaning:**
  - Oven: $30 per oven
  - Microwave & Dishwasher: $20 per unit
  - Refrigerator: $35 per refrigerator

- **Wall & Window Services:**
  - Wall Cleaning: $35 per room
  - Interior Window Cleaning: $40
  - Exterior Window Cleaning: $10 per window

- **Additional Services:**
  - Laundry Service: $25 per load
  - Make Beds: $10 per bed
  - Trash Removal: $10 per bag

- **Recurring Discount:** 10% off for weekly/bi-weekly services

## 🏗️ Project Structure

```
cleaning-booking/
├── components/                 # React components
│   ├── BookingForm.tsx        # Customer booking form
│   └── PriceCalculator.tsx    # Dynamic pricing calculator
├── lib/                       # Database and external services
│   ├── db.ts                 # Supabase database operations
│   ├── stripe.ts             # Stripe configuration
│   └── supabase.ts           # Supabase client setup
├── src/app/                   # Next.js app router
│   ├── admin/                # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── checkout/         # Stripe checkout creation
│   │   ├── webhook/          # Stripe webhook handler
│   │   └── booking/          # Booking retrieval
│   ├── booking/              # Booking page
│   └── success/              # Payment success page
├── supabase-schema.sql       # Database schema
├── migration.sql             # Database migration script
└── reset-with-dummy-data.sql # Reset script with test data
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Payments**: Stripe (Checkout, Subscriptions, Webhooks)
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Deployment**: Vercel-ready (or any Next.js hosting platform)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Git

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd cleaning-booking
npm install
```

### 2. Environment Setup
Create `.env.local` in the project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Base URL for production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Project Settings > API
3. Run the database schema in Supabase SQL Editor:
   ```sql
   -- Run supabase-schema.sql to create tables
   -- Run migration.sql to add new fields (if needed)
   -- Run reset-with-dummy-data.sql for test data (optional)
   ```

### 4. Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from Dashboard > Developers > API Keys
3. Set up webhook endpoint in Dashboard > Developers > Webhooks:
   - URL: `https://your-domain.com/api/webhook` (production)
   - For local testing: Use Stripe CLI (see SETUP.md)

### 5. Start Development
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application.

## 🔄 Payment Flow Architecture

### **Important: Payment-First Booking Creation**
This system uses a **payment-first approach** where bookings are only created after successful payment confirmation via Stripe webhooks.

**Flow:**
1. Customer fills booking form → Data stored in Stripe session metadata
2. Customer redirected to Stripe Checkout → Payment processing
3. **Payment Success** → Stripe webhook triggers → Booking created in database
4. **Payment Failure** → No booking created → Customer stays on booking page

**Benefits:**
- ✅ No orphaned bookings from failed payments
- ✅ Accurate revenue tracking
- ✅ Clean database with only paid bookings
- ✅ Better security and data integrity

## 🧪 Testing

### **Test Cards**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### **Testing Flow**
1. Go to `/booking` and fill out the form
2. Use test card numbers above
3. Check admin dashboard at `/admin` for created bookings
4. Test recurring services with weekly/bi-weekly options

### **Webhook Testing (Local)**
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` to:
- View all bookings with detailed service information
- Update booking status (pending, confirmed, completed, cancelled)
- See customer details and service specifications
- Monitor recurring service subscriptions

## 🔧 API Endpoints

- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook` - Handle Stripe webhooks (payment events)
- `GET /api/booking/[sessionId]` - Get booking by session ID
- `GET /api/admin/bookings` - Get all bookings (admin)
- `PATCH /api/admin/bookings/[id]` - Update booking status (admin)

## 🗄️ Database Schema

### **Bookings Table**
- Customer information (name, email, phone, address)
- Service details (type, bedrooms, bathrooms, appliances, etc.)
- Payment information (Stripe IDs, amounts, status)
- Recurring service data (type, frequency, discount)
- Timestamps and status tracking

### **Customers Table**
- Customer profile information
- Stripe customer ID for payment tracking
- Address and contact details

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- Netlify, Railway, or any Next.js-compatible hosting
- Ensure environment variables are configured
- Update Stripe webhook endpoint to production URL

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env.local` to version control
- **Webhook Verification**: All Stripe webhooks are signature-verified
- **Database Security**: Supabase provides built-in security features
- **Payment Security**: Stripe handles all payment data securely

## 🐛 Troubleshooting

### **Common Issues**

1. **"Failed to create checkout session"**
   - Verify Stripe API keys in environment variables
   - Check server logs for detailed error messages

2. **"Webhook signature verification failed"**
   - Ensure webhook secret is correct
   - Verify webhook endpoint URL is accessible

3. **"Booking not created after payment"**
   - Check webhook delivery in Stripe Dashboard
   - Verify webhook endpoint is receiving events
   - Check server logs for webhook processing errors

4. **Database connection issues**
   - Verify Supabase URL and keys
   - Check Supabase project status
   - Ensure database schema is properly set up

### **Debug Steps**
1. Check browser console for frontend errors
2. Monitor server logs in terminal
3. Verify Stripe Dashboard > Events for payment status
4. Check Supabase logs for database operations

## 📚 Additional Resources

- [SETUP.md](./SETUP.md) - Detailed Stripe setup guide
- [test-stripe.md](./test-stripe.md) - Comprehensive testing instructions
- [supabase-schema.sql](./supabase-schema.sql) - Complete database schema
- [migration.sql](./migration.sql) - Database migration script

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly

---

**Note for Developers**: This system is designed with a payment-first approach. Bookings are only created after successful payment confirmation via Stripe webhooks. This ensures data integrity and prevents orphaned bookings from failed payments. 
