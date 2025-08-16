"use client";

import Navigation from "../../../components/Navigation";
import ContactForm from "../../../components/ContactForm";

export default function AboutUs() {
  const handleContactSubmit = (data: any) => {
    console.log("Contact form submitted:", data);
    // Here you would typically send the data to your backend
    alert("Thank you for your inquiry! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About
            <span className="text-blue-600"> CleanPro Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're a family-owned cleaning company dedicated to providing
            exceptional service and making your spaces shine. With years of
            experience, we've built our reputation on quality, reliability, and
            customer satisfaction.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2015, CleanPro Services began with a simple
                  mission: to provide professional cleaning services that exceed
                  expectations. What started as a small local business has grown
                  into a trusted name in residential and commercial cleaning.
                </p>
                <p>
                  Our founder, Sarah Johnson, started the company after working
                  in the hospitality industry and seeing the importance of
                  maintaining clean, welcoming spaces. She brought that same
                  attention to detail and commitment to excellence to every job
                  we take on.
                </p>
                <p>
                  Today, we serve hundreds of satisfied customers across the
                  region, maintaining the same high standards and personal touch
                  that made us successful from day one.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Years in Business</span>
                  <span className="font-semibold text-blue-600">9+ Years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Happy Customers</span>
                  <span className="font-semibold text-blue-600">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Team Members</span>
                  <span className="font-semibold text-blue-600">25+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Services Offered</span>
                  <span className="font-semibold text-blue-600">10+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Satisfaction Rate</span>
                  <span className="font-semibold text-blue-600">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality
              </h3>
              <p className="text-gray-600">
                We never compromise on the quality of our work
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reliability
              </h3>
              <p className="text-gray-600">
                You can count on us to show up on time, every time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Care</h3>
              <p className="text-gray-600">
                We treat your home like it's our own
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We stay updated with the latest cleaning techniques
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The dedicated professionals behind our success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Sarah Johnson
              </h3>
              <p className="text-blue-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                With over 15 years of experience in the cleaning industry, Sarah
                leads our team with passion and expertise.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Mike Rodriguez
              </h3>
              <p className="text-blue-600 mb-2">Operations Manager</p>
              <p className="text-gray-600 text-sm">
                Mike ensures every job is completed to perfection and manages
                our team of professional cleaners.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Emily Chen
              </h3>
              <p className="text-blue-600 mb-2">Customer Success</p>
              <p className="text-gray-600 text-sm">
                Emily works directly with our clients to ensure their complete
                satisfaction and handles all customer inquiries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Ready to experience the CleanPro difference? Contact us today!
            </p>
          </div>
          <ContactForm
            title="Contact CleanPro Services"
            onSubmit={handleContactSubmit}
          />
        </div>
      </div>
    </div>
  );
}
