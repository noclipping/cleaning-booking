import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone: string;
          address: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          service_address: string;
          service_type: string;
          amount: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          scheduled_date: string;
          scheduled_time: string;
          notes: string | null;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          service_address: string;
          service_type: string;
          amount: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          scheduled_date: string;
          scheduled_time: string;
          notes?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          service_address?: string;
          service_type?: string;
          amount?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          scheduled_date?: string;
          scheduled_time?: string;
          notes?: string | null;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 