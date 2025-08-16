import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              CleanPro Services
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/short-term-rental-cleaning"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Short Term Rental
            </Link>
            <Link
              href="/commercial-cleaning"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Commercial
            </Link>
            <Link
              href="/pressure-washing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pressure Washing
            </Link>
            <Link
              href="/window-cleaning"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Window Cleaning
            </Link>
            <Link
              href="/about-us"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/booking"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/short-term-rental-cleaning"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Short Term Rental
            </Link>
            <Link
              href="/commercial-cleaning"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Commercial
            </Link>
            <Link
              href="/pressure-washing"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pressure Washing
            </Link>
            <Link
              href="/window-cleaning"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Window Cleaning
            </Link>
            <Link
              href="/about-us"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/booking"
              className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
