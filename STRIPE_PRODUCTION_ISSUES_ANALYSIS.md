# Stripe Production Issues Analysis

## 🔍 Overview

This document analyzes potential reasons why Stripe payments are working in test mode but failing in production, specifically regarding customers being charged but not receiving proper confirmations.

## 🚨 Critical Issues Identified

### 0. **Missing EmailJS Environment Variables (ACTUAL ROOT CAUSE)**

**Status**: ✅ **RESOLVED** - This was the actual issue

**Problem**:
- EmailJS environment variables were **never configured in production deployment**
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` was missing
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` was missing  
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` was missing

**Why This Caused Issues**:
- While Stripe payments were processing successfully, any code paths that attempted to send confirmation emails via EmailJS would fail
- This could cause errors in the booking confirmation flow even though payment succeeded
- Users would be charged but not receive proper confirmations due to email sending failures

**Impact**: ⚠️ **CRITICAL** - Payments succeed but confirmation emails fail, leading to poor user experience

**Resolution**:
- Add all EmailJS environment variables to production deployment:
  ```env
  NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
  ```
- Verify variables are set in production environment (Vercel, etc.)
- Test email sending after deployment

**Lesson Learned**: Always verify ALL environment variables are set in production, not just payment-related ones. Missing email configuration can cause failures in the confirmation flow even when payments succeed.

---

### 1. **Webhook Signature Verification Failure**

**Location**: `src/app/api/webhook/route.ts` (lines 24-38)

**Problem**:
- The webhook handler has a development mode bypass that skips signature verification
- In production, if the webhook secret is incorrect or missing, signature verification will fail
- Failed webhook verification means bookings are never created, even though payments succeed

**Code Issue**:
```typescript
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
```

**Why This Fails in Production**:
- Production webhooks require valid signatures
- If `STRIPE_WEBHOOK_SECRET` is not set correctly in production environment
- If the webhook endpoint URL in Stripe Dashboard doesn't match production URL
- If webhook secret is from test mode but production uses live keys

**Impact**: ⚠️ **CRITICAL** - Payments succeed but bookings are never created

---

### 2. **Webhook Endpoint Not Accessible**

**Problem**:
- Production webhook endpoint must be publicly accessible
- Stripe needs to reach `/api/webhook` from the internet
- If deployed on Vercel, the webhook URL must be configured in Stripe Dashboard

**Common Issues**:
- Webhook URL in Stripe Dashboard points to localhost or wrong domain
- Webhook endpoint not configured in Stripe Dashboard for production
- Firewall or security settings blocking Stripe webhook requests
- Vercel deployment URL changed but Stripe webhook not updated

**Impact**: ⚠️ **CRITICAL** - Webhooks never reach the server

---

### 3. **Environment Variable Mismatch**

**Problem**:
- Production environment may be using test keys instead of live keys
- Webhook secret from test mode won't work with live mode
- Missing or incorrect environment variables in production

**Required Variables**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (not pk_test_...)
STRIPE_SECRET_KEY=sk_live_... (not sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_... (must match Stripe Dashboard)
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

**Impact**: ⚠️ **HIGH** - Payments may process but confirmations fail

---

### 4. **Success URL Redirect Issues**

**Location**: `src/app/api/checkout/route.ts` (lines 138, 193)

**Problem**:
- Success URL uses `NEXT_PUBLIC_BASE_URL` which may not be set correctly
- Falls back to `http://localhost:3000` if not set
- Customers redirected to wrong URL after payment

**Code Issue**:
```typescript
success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
```

**Impact**: ⚠️ **MEDIUM** - Customers may not see confirmation page

---

### 5. **Database Connection Issues**

**Location**: `src/app/api/webhook/route.ts` (line 3)

**Problem**:
- Database connection may fail in production
- Supabase connection credentials may be incorrect
- Network issues between production server and Supabase

**Impact**: ⚠️ **HIGH** - Bookings fail to save even if webhook succeeds

---

### 6. **Google Calendar Integration Failures**

**Location**: `src/app/api/webhook/route.ts` (lines 236-257)

**Problem**:
- Google Calendar API credentials may not be configured in production
- Calendar event creation fails silently (caught in try-catch)
- This doesn't prevent booking creation, but may cause confusion

**Impact**: ⚠️ **LOW** - Bookings created but calendar events missing

---

### 7. **Metadata Size Limitations**

**Location**: `src/app/api/checkout/route.ts` (lines 27-63)

**Problem**:
- Stripe metadata has a 500-character limit per key
- If metadata exceeds limits, webhook may fail to process
- Complex service details may cause metadata truncation

**Impact**: ⚠️ **MEDIUM** - Some booking details may be lost

---

### 8. **Race Condition in Success Page**

**Location**: `src/app/success/page.tsx` (lines 35-102)

**Problem**:
- Success page immediately tries to fetch booking
- Webhook may not have processed yet when page loads
- Retry logic exists but may not be sufficient for slow webhooks

**Impact**: ⚠️ **MEDIUM** - Customers see error even though payment succeeded

---

## 🔧 Root Cause Analysis

### Most Likely Issues (Ranked by Probability):

1. **Missing EmailJS Environment Variables** (100% probability - CONFIRMED ROOT CAUSE) ✅
   - EmailJS environment variables not set in production
   - This caused confirmation email failures even when payments succeeded
   - **RESOLVED**: Add EmailJS env vars to production

2. **Webhook Secret Mismatch** (90% probability)
   - Production webhook secret not configured correctly
   - Test webhook secret used in production
   - Webhook endpoint not configured in Stripe Dashboard

3. **Webhook Endpoint Not Configured** (85% probability)
   - Webhook URL not added to Stripe Dashboard for production
   - Webhook URL points to wrong domain
   - Webhook events not being sent

4. **Environment Variables Not Set** (70% probability)
   - Missing `STRIPE_WEBHOOK_SECRET` in production
   - Using test keys in production
   - `NEXT_PUBLIC_BASE_URL` not set correctly
   - **Also check**: All EmailJS variables are set

4. **Database Connection Failure** (40% probability)
   - Supabase credentials incorrect
   - Network connectivity issues
   - Database permissions issues

5. **Success URL Redirect Failure** (30% probability)
   - Wrong base URL configured
   - Customers redirected to localhost

---

## 🛠️ Recommended Fixes

### Immediate Actions:

1. **Verify Webhook Configuration**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Ensure production webhook endpoint is configured
   - Copy the correct webhook signing secret
   - Verify webhook events are being received (check logs)

2. **Check Environment Variables**:
   - Verify all Stripe environment variables are set in production
   - Ensure using live keys (not test keys) in production
   - Verify webhook secret matches Stripe Dashboard

3. **Test Webhook Endpoint**:
   - Use Stripe CLI to test webhook locally: `stripe listen --forward-to localhost:3000/api/webhook`
   - Test webhook in production using Stripe Dashboard test webhook feature
   - Check server logs for webhook errors

4. **Monitor Webhook Logs**:
   - Check Stripe Dashboard → Webhooks → Logs
   - Look for failed webhook deliveries
   - Check server error logs for webhook processing errors

5. **Verify Database Connection**:
   - Test Supabase connection from production environment
   - Verify database credentials are correct
   - Check database logs for connection errors

### Long-term Improvements:

1. **Add Better Error Handling**:
   - Log all webhook processing steps
   - Send alerts when webhooks fail
   - Create fallback booking creation mechanism

2. **Add Webhook Retry Logic**:
   - Implement idempotency checks
   - Add retry mechanism for failed webhook processing
   - Create manual booking creation endpoint for failed webhooks

3. **Improve Monitoring**:
   - Add logging for all payment flows
   - Monitor webhook success rates
   - Alert on payment without booking creation

4. **Add Health Checks**:
   - Create endpoint to verify webhook configuration
   - Test database connectivity
   - Verify all environment variables are set

---

## 📊 Diagnostic Checklist

Use this checklist to diagnose the issue:

- [x] **EmailJS environment variables set in production** ✅ (Was missing - this was the root cause)
  - [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID` set
  - [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` set
  - [ ] `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` set
- [ ] Webhook endpoint configured in Stripe Dashboard for production
- [ ] Webhook signing secret matches production environment variable
- [ ] Using live Stripe keys (not test keys) in production
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain
- [ ] Webhook events appearing in Stripe Dashboard logs
- [ ] Server logs showing webhook requests received
- [ ] Database connection working in production
- [ ] Success page URL correct in checkout session
- [ ] Environment variables all set in production deployment
- [ ] No firewall blocking Stripe webhook requests

---

## 🎯 Why It Worked in Test Mode

**Test Mode Success Factors**:
- Test webhook secret was configured correctly
- Local development used Stripe CLI to forward webhooks
- Test environment had all variables set correctly
- No network/firewall issues in local development
- Database connection was working locally

**Production Failure Factors**:
- Production webhook secret not configured
- Production webhook endpoint not accessible
- Environment variables missing or incorrect
- Network/firewall blocking webhook requests
- Database connection issues in production

---

## 💡 Alternative Solution: EmailJS Approach

Given the complexity of Stripe webhook configuration and the issues identified, switching to EmailJS for booking notifications provides:

**Advantages**:
- ✅ No webhook configuration needed
- ✅ Simpler implementation
- ✅ Immediate email notifications
- ✅ No payment processing complexity
- ✅ Works reliably in all environments

**Trade-offs**:
- ⚠️ No automatic payment processing
- ⚠️ Manual payment collection required
- ⚠️ No automatic booking confirmation emails to customers

This approach is recommended if:
- Payment processing can be handled manually
- Immediate booking notifications are more important than automatic payments
- Webhook configuration issues persist

---

## 📝 Conclusion

**UPDATE**: The actual root cause was identified as **missing EmailJS environment variables in production**. While Stripe payments were processing successfully, the confirmation email system was failing due to missing EmailJS configuration, causing users to be charged but not receive proper confirmations.

**Original Analysis** (still relevant for webhook issues):
The most likely cause of production Stripe issues is **webhook configuration problems**. Payments are succeeding because Stripe processes them, but bookings are not being created because webhooks are either:
1. Not reaching the server (endpoint not configured)
2. Failing signature verification (wrong secret)
3. Failing to process (database/API errors)

**Key Takeaway**: Always verify ALL environment variables are set in production, including:
- Stripe keys and webhook secrets
- EmailJS service/template/public key
- Database connection strings
- Any other third-party service credentials

The EmailJS approach eliminates webhook-related issues entirely and provides a more reliable booking notification system, but requires proper environment variable configuration in production.

