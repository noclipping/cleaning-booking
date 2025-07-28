import { supabase } from './supabase';
import type { Database } from './supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

// Database class with Supabase implementation
class DatabaseService {
  // Booking operations
  async createBooking(bookingData: any): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone,
        service_address: bookingData.service_address,
        service_type: bookingData.service_type,
        amount: bookingData.amount,
        status: bookingData.status || 'pending',
        scheduled_date: bookingData.scheduled_date,
        scheduled_time: bookingData.scheduled_time,
        notes: bookingData.notes || null,
        stripe_payment_intent_id: bookingData.stripe_payment_intent_id || null,
        stripe_session_id: bookingData.stripe_session_id || null,
        // New recurring fields
        recurring_type: bookingData.recurring_type || 'one-time',
        recurring_frequency: bookingData.recurring_frequency || null,
        discount_percentage: bookingData.discount_percentage || 0,
        // Service details
        bedrooms: bookingData.bedrooms || 1,
        bathrooms: bookingData.bathrooms || 1,
        // Appliance services
        oven_cleaning: bookingData.oven_cleaning || false,
        oven_count: bookingData.oven_count || 0,
        microwave_dishwasher_cleaning: bookingData.microwave_dishwasher_cleaning || false,
        microwave_dishwasher_count: bookingData.microwave_dishwasher_count || 0,
        refrigerator_cleaning: bookingData.refrigerator_cleaning || false,
        refrigerator_count: bookingData.refrigerator_count || 0,
        // Wall and window services
        wall_cleaning: bookingData.wall_cleaning || false,
        wall_rooms_count: bookingData.wall_rooms_count || 0,
        interior_window_cleaning: bookingData.interior_window_cleaning || false,
        exterior_window_cleaning: bookingData.exterior_window_cleaning || false,
        exterior_windows_count: bookingData.exterior_windows_count || 0,
        // Additional services
        laundry_service: bookingData.laundry_service || false,
        laundry_loads: bookingData.laundry_loads || 0,
        make_beds: bookingData.make_beds || false,
        beds_count: bookingData.beds_count || 0,
        trash_removal: bookingData.trash_removal || false,
        trash_bags: bookingData.trash_bags || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }

    return data;
  }

  async getBooking(id: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error fetching booking:', error);
      throw new Error('Failed to fetch booking');
    }

    return data;
  }

  async getBookingByStripeSessionId(sessionId: string): Promise<Booking | null> {
    console.log('Database: Looking for booking with sessionId:', sessionId);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('Database: No booking found for sessionId:', sessionId);
        return null; // No rows returned
      }
      console.error('Error fetching booking by session ID:', error);
      throw new Error('Failed to fetch booking');
    }

    console.log('Database: Found booking:', data);
    return data;
  }

  async getBookingByStripeSubscriptionId(subscriptionId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error fetching booking by subscription ID:', error);
      throw new Error('Failed to fetch booking');
    }

    return data;
  }

  async updateBooking(id: string, updates: Partial<BookingUpdate>): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }

    return data;
  }

  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all bookings:', error);
      throw new Error('Failed to fetch bookings');
    }

    return data || [];
  }

  async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings by status:', error);
      throw new Error('Failed to fetch bookings');
    }

    return data || [];
  }

  // Customer operations
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        stripe_customer_id: customerData.stripe_customer_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }

    return data;
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error fetching customer:', error);
      throw new Error('Failed to fetch customer');
    }

    return data;
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error fetching customer by email:', error);
      throw new Error('Failed to fetch customer');
    }

    return data;
  }

  async updateCustomer(id: string, updates: Partial<CustomerUpdate>): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }

    return data;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all customers:', error);
      throw new Error('Failed to fetch customers');
    }

    return data || [];
  }
}

// Export a singleton instance
export const db = new DatabaseService();

// Utility functions for common operations
export const bookingUtils = {
  // Calculate estimated duration based on service type and property size
  calculateDuration: (serviceType: string, bedrooms: number, bathrooms: number): number => {
    const baseHours = {
      'regular': 2,
      'deep': 4,
      'move-in': 6,
      'post-construction': 8,
    };

    const base = baseHours[serviceType as keyof typeof baseHours] || 2;
    const roomMultiplier = 1 + (bedrooms - 1) * 0.3 + (bathrooms - 1) * 0.2;

    return Math.round(base * roomMultiplier);
  },

  // Generate booking reference number
  generateReference: (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `BK-${timestamp}-${random}`;
  },

  // Validate booking data
  validateBooking: (bookingData: Partial<Booking>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!bookingData.customer_name?.trim()) {
      errors.push('Customer name is required');
    }

    if (!bookingData.customer_email?.trim()) {
      errors.push('Customer email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customer_email)) {
      errors.push('Invalid email format');
    }

    if (!bookingData.customer_phone?.trim()) {
      errors.push('Customer phone is required');
    }

    if (!bookingData.service_address?.trim()) {
      errors.push('Service address is required');
    }

    if (!bookingData.service_type?.trim()) {
      errors.push('Service type is required');
    }

    if (!bookingData.amount || bookingData.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!bookingData.scheduled_date?.trim()) {
      errors.push('Scheduled date is required');
    }

    if (!bookingData.scheduled_time?.trim()) {
      errors.push('Scheduled time is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Export types for use in other files
export type { Booking, Customer, BookingInsert, CustomerInsert }; 