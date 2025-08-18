"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import ContactForm from "../../components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/lake.jpg"
            alt="Professional Cleaning Services"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center bg-black/80 p-10 rounded-lg">
            <div className="flex justify-center mb-6"></div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional Cleaning
              <span className="text-blue-300"> Services</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Get your home sparkling clean with our professional cleaning
              services. From regular maintenance to deep cleaning, we've got you
              covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Your Service
              </Link>
              <Link
                href="#services"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our range of professional cleaning services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Regular Cleaning
              </h3>
              <p className="text-gray-600 mb-4">
                Standard cleaning service for regular maintenance
              </p>
              <p className="text-2xl font-bold text-blue-600">From $80</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deep Cleaning
              </h3>
              <p className="text-gray-600 mb-4">
                Thorough cleaning including hard-to-reach areas
              </p>
              <p className="text-2xl font-bold text-green-600">From $150</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Move-in/Move-out
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive cleaning for moving situations
              </p>
              <p className="text-2xl font-bold text-purple-600">From $200</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Post-Construction
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized cleaning after construction work
              </p>
              <p className="text-2xl font-bold text-orange-600">From $300</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your cleaning service today and enjoy a spotless home
          </p>
          <Link
            href="/booking"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>

          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById("reviews-carousel");
                if (container) {
                  container.scrollBy({ left: -400, behavior: "smooth" });
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById("reviews-carousel");
                if (container) {
                  container.scrollBy({ left: 400, behavior: "smooth" });
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              id="reviews-carousel"
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4 scroll-smooth px-16"
            >
              {/* Review 1 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "We needed house cleaning services for just one day after
                    guests stayed at our house for a weekend. Wallenpaupack
                    Cleaning Service was very accommodating. They showed up as
                    scheduled. Our house was nice and clean and tidy. They were
                    reasonably priced as well, I would highly recommend them."
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-xs">
                        JM
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Joanne Michael
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "Our house in WLE was in need of a thorough deep cleaning.
                    We called Wallenpaupack Cleaning and extremely glad we
                    did!!! Communication was terrific, fitting our timeline was
                    excellent and more importantly, our home, was immaculate
                    when we returned."
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-xs">
                        CC
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        C Clauss
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "Our airbnb consistently receives 5 star reviews. I highly
                    recommend Wallenpaupack Cleaning Services!"
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-semibold text-xs">
                        CM
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Cherie Matthews
                      </p>
                      <p className="text-xs text-gray-500">Local Guide</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 4 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "Wallenpaupak Cleaning Services was excellent. We needed
                    them in a pinch and they got out to get the job done
                    efficiently and effectively. The communication with them was
                    always easy and clear. I would definitely hire them again!"
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-pink-600 font-semibold text-xs">
                        SB
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Samantha Bloecker
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 5 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "Hard working pair who showed up on time and went straight
                    through until they were done. Very courteous and diligent."
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 font-semibold text-xs">
                        AC
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Alan Cooper
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 6 */}
              <div className="flex-shrink-0 w-full md:w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 italic text-sm leading-relaxed">
                    "Reasonable price. Very easy to work with and responsive.
                    Also, happy with the results!"
                  </p>
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-teal-600 font-semibold text-xs">
                        SE
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Sarah Eversdyke
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container =
                      document.getElementById("reviews-carousel");
                    if (container) {
                      const cardWidth = 400; // Approximate width of each card + gap
                      container.scrollTo({
                        left: index * cardWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need something our calculator doesn't provide or any other
              inquiries?
            </h2>
            <p className="text-xl text-gray-600">
              Contact us directly and we'll get back to you as soon as possible
            </p>
          </div>
          <ContactForm
            title="Contact Us"
            onSubmit={(data) => {
              console.log("Contact form submitted:", data);
              alert(
                "Thank you for your inquiry! We will get back to you soon."
              );
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Wallenpaupack Cleaning Services
              </h3>
              <p className="text-gray-400">
                Professional cleaning services for your home and office.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: wallenpaupackcs@gmail.com
                <br />
                Phone: 570-470-4896
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/booking"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Book Service
                </Link>
                <Link
                  href="/short-term-rental-cleaning"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Short Term Rental
                </Link>
                <Link
                  href="/pressure-washing"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Pressure Washing
                </Link>
                <Link
                  href="/window-cleaning"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Window Cleaning
                </Link>
                <Link
                  href="/about-us"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/admin"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Wallenpaupack Cleaning Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
