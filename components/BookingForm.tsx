'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

interface BookingFormProps {
  calculatedPrice: number;
  selectedService: string;
  serviceDetails: any;
  recurringType: string;
  onServiceChange: (service: string) => void;
  onRecurringChange: (type: string) => void;
  onServiceDetailsChange: (details: any) => void;
}

// Service name mapping
const serviceNameMap: { [key: string]: string } = {
  'regular': 'Regular Cleaning',
  'deep': 'Deep Cleaning',
  'move-in': 'Move-in/Move-out Cleaning',
  'post-construction': 'Post-Construction Cleaning'
};

// Helper function to generate a booking ID
function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WCS-${timestamp}-${random}`;
}

// Helper function to format service details for email
function formatServiceDetails(serviceDetails: any, selectedService: string, recurringType: string, calculatedPrice: number): string {
  const details: string[] = [];
  
  // Service type
  details.push(`Service Type: ${serviceNameMap[selectedService] || selectedService}`);
  
  // Recurring type
  if (recurringType === 'weekly') {
    details.push('Frequency: Weekly Recurring (10% discount applied)');
  } else if (recurringType === 'biweekly') {
    details.push('Frequency: Bi-weekly Recurring (10% discount applied)');
  } else {
    details.push('Frequency: One-time service');
  }
  
  // Property details
  details.push(`\nProperty Details:`);
  details.push(`- Bedrooms: ${serviceDetails.bedrooms || 1}`);
  details.push(`- Bathrooms: ${serviceDetails.bathrooms || 1}`);
  
  // Appliance services
  if (serviceDetails.selectedAppliances && serviceDetails.selectedAppliances.length > 0) {
    details.push(`\nAppliance Cleaning:`);
    if (serviceDetails.selectedAppliances.includes('oven') && serviceDetails.ovenCount > 0) {
      details.push(`- Oven Cleaning: ${serviceDetails.ovenCount} oven(s)`);
    }
    if (serviceDetails.selectedAppliances.includes('microwave-dishwasher') && serviceDetails.microwaveDishwasherCount > 0) {
      details.push(`- Microwave & Dishwasher: ${serviceDetails.microwaveDishwasherCount} unit(s)`);
    }
    if (serviceDetails.selectedAppliances.includes('refrigerator') && serviceDetails.refrigeratorCount > 0) {
      details.push(`- Refrigerator Cleaning: ${serviceDetails.refrigeratorCount} refrigerator(s)`);
    }
  }
  
  // Wall cleaning
  if (serviceDetails.selectedWalls && serviceDetails.selectedWalls.includes('walls') && serviceDetails.wallRoomsCount > 0) {
    details.push(`\nWall Cleaning: ${serviceDetails.wallRoomsCount} room(s)`);
  }
  
  // Window cleaning
  if (serviceDetails.selectedWindows && serviceDetails.selectedWindows.length > 0) {
    details.push(`\nWindow Cleaning:`);
    if (serviceDetails.selectedWindows.includes('interior-windows')) {
      details.push(`- Interior Window Cleaning`);
    }
    if (serviceDetails.selectedWindows.includes('exterior-windows') && serviceDetails.exteriorWindows > 0) {
      details.push(`- Exterior Window Cleaning: ${serviceDetails.exteriorWindows} window(s)`);
    }
  }
  
  // Additional services
  if (serviceDetails.selectedAdditional && serviceDetails.selectedAdditional.length > 0) {
    details.push(`\nAdditional Services:`);
    if (serviceDetails.selectedAdditional.includes('laundry') && serviceDetails.laundryLoads > 0) {
      details.push(`- Laundry Service: ${serviceDetails.laundryLoads} load(s)`);
    }
    if (serviceDetails.selectedAdditional.includes('make-beds') && serviceDetails.beds > 0) {
      details.push(`- Make Beds: ${serviceDetails.beds} bed(s)`);
    }
    if (serviceDetails.selectedAdditional.includes('trash-removal') && serviceDetails.trashBags > 0) {
      details.push(`- Trash Removal: ${serviceDetails.trashBags} bag(s)`);
    }
  }
  
  // Total price
  details.push(`\nTotal Price: $${calculatedPrice}`);
  
  return details.join('\n');
}

export default function BookingForm({ calculatedPrice = 0, selectedService = '', recurringType = 'one-time', serviceDetails = {} }: BookingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');
    
    // Generate booking ID
    const generatedId = generateBookingId();
    setBookingId(generatedId);
    
    // Show modal with processing state
    setShowModal(true);
    setIsProcessing(true);

    try {
      // Format service details for email
      const serviceDetailsText = formatServiceDetails(serviceDetails, selectedService, recurringType, calculatedPrice);
      
      // Create email message with booking ID
      const emailMessage = `New Booking Request
Booking ID: ${generatedId}

Customer Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Address: ${formData.address}
- Preferred Date: ${formData.date}
- Preferred Time: ${formData.time}
${formData.notes ? `- Notes: ${formData.notes}` : ''}

${serviceDetailsText}

---
This booking request was submitted through the Wallenpaupack Cleaning Services booking form.`;

      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please contact support.');
      }

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: emailMessage,
        to_email: 'wallenpaupackcs@gmail.com',
        subject: `New Booking Request [${generatedId}] from ${formData.name} - ${serviceNameMap[selectedService] || selectedService}`,
      };

      // Send email via EmailJS
      // If this resolves without throwing, email was sent successfully
      const emailResult = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('Email sent successfully:', emailResult);
      
      // If we get here, emailjs.send() resolved successfully with status 200
      // This means the email was sent successfully - ALWAYS show success
      const submittedEmailAddress = formData.email;

      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success - show success state in modal
      // If we got here, email was sent - show success no matter what
      setIsProcessing(false);
      setSubmitStatus('success');
      setSubmittedEmail(submittedEmailAddress);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        date: '',
        time: '',
        notes: '',
      });
      
    } catch (error) {
      // Only catch errors from emailjs.send() - if it throws, email was NOT sent
      console.error('EmailJS send failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setIsProcessing(false);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  const getRecurringDescription = () => {
    switch (recurringType) {
      case 'weekly':
        return 'Weekly recurring service (10% discount applied)';
      case 'biweekly':
        return 'Bi-weekly recurring service (10% discount applied)';
      default:
        return 'One-time service';
    }
  };

  // Don't reset status when modal is showing or when we have a success/error state
  // This prevents the useEffect from interfering with the modal state

  // Prevent body scrolling and ESC key when modal is open
  useEffect(() => {
    if (showModal) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Prevent ESC key from closing modal
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 relative border border-gray-200">
            {isProcessing ? (
              // Processing State
              <div className="text-center">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Request</h2>
                <p className="text-gray-600">Please wait while we submit your booking request...</p>
              </div>
            ) : submitStatus === 'success' ? (
              // Success State
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h2>
                <p className="text-gray-600 mb-4">
                  Your booking request has been successfully submitted. We've received your information and will contact you shortly to confirm your appointment.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-1">Booking ID:</p>
                  <p className="text-lg font-mono font-bold text-blue-600">{bookingId}</p>
                  <p className="text-xs text-gray-500 mt-2">Please save this ID for your records</p>
                </div>
                {submittedEmail && (
                  <p className="text-sm text-gray-600 mb-6">
                    A confirmation will be sent to <span className="font-medium">{submittedEmail}</span>
                  </p>
                )}
                <button
                  onClick={handleReturnHome}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Return Home
                </button>
              </div>
            ) : (
              // Error State
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Error</h2>
                <p className="text-gray-600 mb-6">
                  Sorry, there was an error submitting your booking request. Please try again or contact us directly.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSubmitStatus('idle');
                    }}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleReturnHome}
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="570-470-4896"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Time *
        </label>
        <input
          type="time"
          id="time"
          name="time"
          required
          value={formData.time}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Service Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="123 Main St, City, State 12345"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Special Instructions
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Any special requirements or notes..."
        />
      </div>

      {calculatedPrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total Price:</span>
            <span className="text-2xl font-bold text-blue-600">${calculatedPrice}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {getRecurringDescription()}
          </p>
          <p className="text-sm text-gray-600">
            We'll contact you to confirm your booking and arrange payment
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || calculatedPrice === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Submitting...
          </div>
        ) : (
          'Submit Booking Request'
        )}
      </button>
    </form>
    </>
  );
} 