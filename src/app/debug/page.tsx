"use client";

import { useState } from "react";

export default function DebugPage() {
  const [sessionId, setSessionId] = useState(
    "cs_test_a1HDn63ObmiRS52erMRSUYqF61Gss5xKlz7TD45iPlVzhvBazLfhF3se1P"
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          metadata: {
            customerName: "Test User",
            customerEmail: "test@example.com",
            customerPhone: "1234567890",
            serviceAddress: "123 Test St",
            serviceType: "deep-cleaning",
            scheduledDate: "2025-07-28",
            scheduledTime: "10:00 AM",
          },
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBookingAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/booking/${sessionId}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Tools</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Webhook</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session ID:
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={testWebhook}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Webhook"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Booking API</h2>
          <button
            onClick={testBookingAPI}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Booking API"}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
