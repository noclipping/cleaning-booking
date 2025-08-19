"use client";

import Navigation from "../../../components/Navigation";
import ContactForm from "../../../components/ContactForm";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6"></div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About
            <span className="text-blue-600">
              {" "}
              Wallenpaupack Cleaning Services
            </span>
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
          <div className="max-w-4xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Wallenpaupack Cleaning Services was founded with a simple
                  mission: to raise the standard of professional cleaning in the
                  Lake Wallenpaupack and NEPA region.
                </p>
                <p>
                  As local business owners and members of this community, we saw
                  a clear gap — homeowners, businesses, and rental property
                  owners were looking for reliable, detail-oriented cleaning
                  services they could trust, but too often ended up
                  disappointed. We set out to change that.
                </p>
                <p>
                  From the start, our focus has been on professionalism in every
                  detail — from showing up on time and prepared, to
                  communicating clearly, to delivering results that exceed
                  expectations. Whether it's a routine cleaning, a deep clean
                  before guests arrive, or specialized services for short-term
                  rentals and move-in/move-outs, we approach each job with care,
                  consistency, and respect for your space.
                </p>
                <p>
                  Our goal is to be more than just another cleaning company — we
                  want to be the team you know will get it right the first time,
                  every time. We believe that when you combine top-tier service
                  with genuine pride in our work, the results speak for
                  themselves.
                </p>
                <p>This is our home, our community, and our commitment.</p>
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

      {/* Contact Form Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Ready to experience the Wallenpaupack Cleaning Services
              difference? Contact us today!
            </p>
          </div>
          <ContactForm title="Contact Wallenpaupack Cleaning Services" />
        </div>
      </div>
    </div>
  );
}
