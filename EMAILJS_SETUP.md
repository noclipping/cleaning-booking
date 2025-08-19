# EmailJS Setup Guide

## 🎯 Overview

This guide will help you set up EmailJS to send contact form submissions to `wallenpaupackcs@gmail.com`. EmailJS allows you to send emails directly from the frontend without needing a backend server.

## 🚀 Quick Setup Steps

### **1. Create EmailJS Account**

1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Verify your email address

### **2. Set Up Email Service**

1. **Add Email Service**

   - In EmailJS Dashboard, go to **Email Services**
   - Click **Add New Service**
   - Choose **Gmail** (recommended) or **Outlook**
   - Connect your email account (`wallenpaupackcs@gmail.com`)
   - Give it a name like "Wallenpaupack Contact Form"
   - Copy the **Service ID** (you'll need this later)

2. **Alternative: Use EmailJS's Built-in Service**
   - Choose **EmailJS** as the service
   - This uses EmailJS's servers to send emails
   - No need to connect your own email account

### **3. Create Email Template**

1. **Go to Email Templates**

   - In EmailJS Dashboard, go to **Email Templates**
   - Click **Create New Template**

2. **Template Content**
   Use this template content:

   ```html
   <h2>New Contact Form Submission</h2>

   <p><strong>From:</strong> {{from_name}} ({{from_email}})</p>
   <p><strong>Phone:</strong> {{from_phone}}</p>
   <p><strong>Message:</strong></p>
   <p>{{message}}</p>

   <hr />
   <p>
     <em
       >This message was sent from the Wallenpaupack Cleaning Services contact
       form.</em
     >
   </p>
   ```

3. **Template Settings**

   - **Subject**: `New Contact Form Submission from {{from_name}}`
   - **To Email**: `wallenpaupackcs@gmail.com`
   - **From Name**: `Wallenpaupack Contact Form`
   - **From Email**: `noreply@wallenpaupackcs.com` (or your preferred sender)

4. **Save and Copy Template ID**
   - Save the template
   - Copy the **Template ID** (you'll need this later)

### **4. Get Your Public Key**

1. In EmailJS Dashboard, go to **Account** → **API Keys**
2. Copy your **Public Key**

### **5. Set Environment Variables**

Add these to your `.env.local` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**For Vercel Deployment:**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same variables above
4. Redeploy your application

### **6. Test the Integration**

1. **Local Testing**

   ```bash
   npm run dev
   ```

   Go to any page with the contact form and test it.

2. **Production Testing**
   - Deploy to Vercel
   - Test the contact form on your live site
   - Check that emails are received at `wallenpaupackcs@gmail.com`

## 📧 Email Template Variables

The contact form sends these variables to EmailJS:

| Variable         | Description        | Example                                     |
| ---------------- | ------------------ | ------------------------------------------- |
| `{{from_name}}`  | Customer's name    | "John Doe"                                  |
| `{{from_email}}` | Customer's email   | "john@example.com"                          |
| `{{from_phone}}` | Customer's phone   | "570-123-4567"                              |
| `{{message}}`    | Customer's message | "I need a quote for..."                     |
| `{{to_email}}`   | Recipient email    | "wallenpaupackcs@gmail.com"                 |
| `{{subject}}`    | Email subject      | "New Contact Form Submission from John Doe" |

## 🔧 Troubleshooting

### **Common Issues:**

1. **"EmailJS is not defined"**

   - Make sure `@emailjs/browser` is installed
   - Check that the import is correct in `ContactForm.tsx`

2. **"Service ID not found"**

   - Verify your EmailJS Service ID is correct
   - Check that the environment variable is set properly

3. **"Template ID not found"**

   - Verify your EmailJS Template ID is correct
   - Make sure the template is published and active

4. **"Public Key is invalid"**

   - Check your EmailJS Public Key
   - Ensure you're using the correct key from your account

5. **"Emails not being received"**
   - Check your spam folder
   - Verify the "To Email" in your template is correct
   - Check EmailJS Dashboard for delivery status

### **Debug Steps:**

1. **Check Browser Console**

   - Look for EmailJS error messages
   - Verify environment variables are loaded

2. **Check EmailJS Dashboard**

   - Go to **Email Logs** to see delivery attempts
   - Check for any failed deliveries

3. **Test Environment Variables**
   ```javascript
   console.log("Service ID:", process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
   console.log("Template ID:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
   console.log("Public Key:", process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
   ```

## 📊 EmailJS Plans

### **Free Plan (Recommended for starting):**

- 200 emails per month
- Basic templates
- Gmail/Outlook integration

### **Paid Plans:**

- **Starter**: $15/month - 1,000 emails
- **Professional**: $35/month - 10,000 emails
- **Enterprise**: Custom pricing

## 🔒 Security Considerations

- **Public Key**: The public key is safe to expose in frontend code
- **Service ID & Template ID**: These are also safe for frontend use
- **Rate Limiting**: EmailJS has built-in rate limiting to prevent abuse
- **Spam Protection**: EmailJS includes spam protection features

## 📚 Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Integration](https://www.emailjs.com/docs/examples/reactjs/)
- [EmailJS Templates](https://www.emailjs.com/docs/examples/templates/)

## 🎯 Next Steps

1. **Set up EmailJS account** following the steps above
2. **Configure environment variables** in both local and Vercel
3. **Test the contact form** thoroughly
4. **Monitor email delivery** in EmailJS Dashboard
5. **Consider upgrading** to a paid plan if you expect high volume

---

**Need Help?** Check the troubleshooting section above or refer to EmailJS's official documentation.
