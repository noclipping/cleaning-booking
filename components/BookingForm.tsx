'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  calculatedPrice: number;
  selectedService: string;
  serviceDetails: any;
  recurringType: string;
  onServiceChange: (service: string) => void;
  onRecurringChange: (type: string) => void;
  onServiceDetailsChange: (details: any) => void;
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

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            scheduledDate: formData.date,
            scheduledTime: formData.time,
            notes: formData.notes,
          },
          serviceDetails: {
            serviceType: selectedService,
            bedrooms: serviceDetails.bedrooms,
            bathrooms: serviceDetails.bathrooms,
            selectedAppliances: serviceDetails.selectedAppliances,
            ovenCount: serviceDetails.ovenCount,
            microwaveDishwasherCount: serviceDetails.microwaveDishwasherCount,
            refrigeratorCount: serviceDetails.refrigeratorCount,
            selectedWalls: serviceDetails.selectedWalls,
            wallRoomsCount: serviceDetails.wallRoomsCount,
            selectedWindows: serviceDetails.selectedWindows,
            exteriorWindows: serviceDetails.exteriorWindows,
            selectedAdditional: serviceDetails.selectedAdditional,
            laundryLoads: serviceDetails.laundryLoads,
            beds: serviceDetails.beds,
            trashBags: serviceDetails.trashBags,
          },
          totalPrice: calculatedPrice,
          recurringType: recurringType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirect error:', error);
          alert('Failed to redirect to payment page');
        }
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            Payment will be processed securely through Stripe
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
            Processing...
          </div>
        ) : (
          'Book Now & Pay'
        )}
      </button>
    </form>
  );
} 