"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface BookingDetails {
  id: number;
  customer_name: string;
  customer_email: string;
  service_type: string;
  amount: number;
  scheduled_date: string;
  scheduled_time: string;
  service_address: string;
  status: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchBookingDetails(sessionId);
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  const fetchBookingDetails = async (sessionId: string) => {
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Attempt ${attempt} to fetch booking for session: ${sessionId}`
        );
        const response = await fetch(`/api/booking/${sessionId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Booking found:", data);
          setBooking(data);
          setLoading(false);
          return;
        } else {
          console.log(
            `Attempt ${attempt} failed with status: ${response.status}`
          );

          // If this is the last attempt and booking still not found, try to create it
          if (attempt === maxRetries) {
            console.log("Attempting to create booking manually...");
            try {
              const createResponse = await fetch(
                "/api/create-booking-fallback",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ sessionId }),
                }
              );

              if (createResponse.ok) {
                const bookingData = await createResponse.json();
                console.log("Booking created manually:", bookingData);
                setBooking(bookingData);
                setLoading(false);
                return;
              }
            } catch (createError) {
              console.error("Failed to create booking manually:", createError);
            }

            setError("Failed to fetch booking details after multiple attempts");
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error(`Error on attempt ${attempt}:`, error);
        if (attempt === maxRetries) {
          setError("Failed to fetch booking details");
          setLoading(false);
          return;
        }
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/booking"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Your cleaning service has been booked successfully
          </p>
        </div>

        {booking && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Booking Confirmation
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Booking ID:</span>
                <span className="text-gray-900 font-mono">{booking.id}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Customer:</span>
                <span className="text-gray-900">{booking.customer_name}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Service Type:</span>
                <span className="text-gray-900 capitalize">
                  {booking.service_type.replace("-", " ")}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">
                  Scheduled Date:
                </span>
                <span className="text-gray-900">
                  {new Date(booking.scheduled_date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">
                  Scheduled Time:
                </span>
                <span className="text-gray-900">{booking.scheduled_time}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">
                  Service Address:
                </span>
                <span className="text-gray-900 text-right max-w-xs">
                  {booking.service_address}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${booking.amount}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              You'll receive a confirmation email with all the details
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Our team will contact you 24 hours before your scheduled service
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Please ensure someone is available at the scheduled time
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              If you need to reschedule, please contact us at least 24 hours in
              advance
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Book Another Service
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
