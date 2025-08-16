"use client";

import { useState } from "react";
import BookingForm from "../../../components/BookingForm";
import PriceCalculator from "../../../components/PriceCalculator";
import Navigation from "../../../components/Navigation";

export default function BookingPage() {
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [recurringType, setRecurringType] = useState("one-time");
  const [serviceDetails, setServiceDetails] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Cleaning Service
            </h1>
            <p className="text-xl text-gray-600">
              Get a custom quote and book your professional cleaning service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Service Calculator
              </h2>
              <PriceCalculator
                onPriceChange={setCalculatedPrice}
                onServiceChange={setSelectedService}
                onRecurringChange={setRecurringType}
                onServiceDetailsChange={setServiceDetails}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Booking Details
              </h2>
              <BookingForm
                calculatedPrice={calculatedPrice}
                selectedService={selectedService}
                serviceDetails={serviceDetails}
                recurringType={recurringType}
                onServiceChange={setSelectedService}
                onRecurringChange={setRecurringType}
                onServiceDetailsChange={setServiceDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
