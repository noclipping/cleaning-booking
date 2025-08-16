"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "../../../components/Navigation";

interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_address: string;
  service_type: string;
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
  created_at: string;
  // New recurring fields
  recurring_type?: string;
  recurring_frequency?: string;
  discount_percentage?: number;
  // Service details
  bedrooms?: number;
  bathrooms?: number;
  // Appliance services with quantities
  oven_cleaning?: boolean;
  oven_count?: number;
  microwave_dishwasher_cleaning?: boolean;
  microwave_dishwasher_count?: number;
  refrigerator_cleaning?: boolean;
  refrigerator_count?: number;
  // Wall and window services
  wall_cleaning?: boolean;
  wall_rooms_count?: number;
  interior_window_cleaning?: boolean;
  exterior_window_cleaning?: boolean;
  exterior_windows_count?: number;
  // Additional services
  laundry_service?: boolean;
  laundry_loads?: number;
  make_beds?: boolean;
  beds_count?: number;
  trash_removal?: boolean;
  trash_bags?: number;
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: number,
    newStatus: Booking["status"]
  ) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the booking in the local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      } else {
        console.error("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusCount = (status: Booking["status"]) => {
    return bookings.filter((booking) => booking.status === status).length;
  };

  const toggleExpandedBooking = (bookingId: number) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const renderServiceDetails = (booking: Booking) => {
    const details = [];

    // Recurring information
    if (booking.recurring_type && booking.recurring_type !== "one-time") {
      details.push(
        <div key="recurring" className="mb-2">
          <span className="font-medium text-green-600">
            {booking.recurring_type} recurring service
          </span>
          {booking.discount_percentage && (
            <span className="text-sm text-gray-600 ml-2">
              ({booking.discount_percentage}% discount applied)
            </span>
          )}
        </div>
      );
    }

    // Property details
    if (booking.bedrooms || booking.bathrooms) {
      const propertyDetails = [];
      if (booking.bedrooms)
        propertyDetails.push(`${booking.bedrooms} bedrooms`);
      if (booking.bathrooms)
        propertyDetails.push(`${booking.bathrooms} bathrooms`);

      details.push(
        <div key="property" className="mb-2">
          <span className="font-medium">Property:</span>{" "}
          {propertyDetails.join(", ")}
        </div>
      );
    }

    // Appliance services
    const appliances = [];
    if (booking.oven_cleaning)
      appliances.push(`Oven (${booking.oven_count || 0})`);
    if (booking.microwave_dishwasher_cleaning)
      appliances.push(
        `Microwave & Dishwasher (${booking.microwave_dishwasher_count || 0})`
      );
    if (booking.refrigerator_cleaning)
      appliances.push(`Refrigerator (${booking.refrigerator_count || 0})`);

    if (appliances.length > 0) {
      details.push(
        <div key="appliances" className="mb-2">
          <span className="font-medium">Appliances:</span>{" "}
          {appliances.join(", ")}
        </div>
      );
    }

    // Wall and window services
    const wallWindowServices = [];
    if (booking.wall_cleaning)
      wallWindowServices.push(
        `Wall Cleaning (${booking.wall_rooms_count || 0} rooms)`
      );
    if (booking.interior_window_cleaning)
      wallWindowServices.push("Interior Windows");
    if (booking.exterior_window_cleaning) {
      wallWindowServices.push(
        `Exterior Windows (${booking.exterior_windows_count || 0})`
      );
    }

    if (wallWindowServices.length > 0) {
      details.push(
        <div key="wallWindow" className="mb-2">
          <span className="font-medium">Wall & Window Services:</span>{" "}
          {wallWindowServices.join(", ")}
        </div>
      );
    }

    // Additional services
    const additionalServices = [];
    if (booking.laundry_service)
      additionalServices.push(`Laundry (${booking.laundry_loads || 0} loads)`);
    if (booking.make_beds)
      additionalServices.push(`Make Beds (${booking.beds_count || 0} beds)`);
    if (booking.trash_removal)
      additionalServices.push(
        `Trash Removal (${booking.trash_bags || 0} bags)`
      );

    if (additionalServices.length > 0) {
      details.push(
        <div key="additional" className="mb-2">
          <span className="font-medium">Additional Services:</span>{" "}
          {additionalServices.join(", ")}
        </div>
      );
    }

    return details.length > 0 ? (
      <div className="bg-gray-50 p-3 rounded-md text-sm">{details}</div>
    ) : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage cleaning service bookings</p>
              <p className="text-sm text-green-600 mt-2">
                ✅ Google Calendar integration is active - appointments will be
                automatically synced
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {bookings.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getStatusCount("pending")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getStatusCount("confirmed")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {getStatusCount("completed")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by customer name, email, or service type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status Filter
                </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <React.Fragment key={booking.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.customer_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.customer_email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.customer_phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {booking.service_type.replace("-", " ")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.service_address}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(
                                booking.scheduled_date
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.scheduled_time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${booking.amount}
                            </div>
                            {booking.discount_percentage &&
                              booking.discount_percentage > 0 && (
                                <div className="text-xs text-green-600">
                                  {booking.discount_percentage}% discount
                                </div>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleExpandedBooking(booking.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {expandedBooking === booking.id ? "Hide" : "Show"}{" "}
                              Details
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                updateBookingStatus(
                                  booking.id,
                                  e.target.value as Booking["status"]
                                )
                              }
                              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                        {expandedBooking === booking.id && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              {renderServiceDetails(booking)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/booking"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Booking Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
