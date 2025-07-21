-- Supabase Database Schema for Cleaning Booking System

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  service_address TEXT NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  notes TEXT,
  stripe_payment_intent_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  -- New fields for recurring services
  recurring_type VARCHAR(50) DEFAULT 'one-time' CHECK (recurring_type IN ('one-time', 'weekly', 'biweekly')),
  recurring_frequency VARCHAR(50),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  -- New fields for detailed service information
  bedrooms INTEGER DEFAULT 1,
  bathrooms DECIMAL(3,1) DEFAULT 1,
  -- Appliance services with quantities
  oven_cleaning BOOLEAN DEFAULT FALSE,
  oven_count INTEGER DEFAULT 0,
  microwave_dishwasher_cleaning BOOLEAN DEFAULT FALSE,
  microwave_dishwasher_count INTEGER DEFAULT 0,
  refrigerator_cleaning BOOLEAN DEFAULT FALSE,
  refrigerator_count INTEGER DEFAULT 0,
  -- Wall and window services
  wall_cleaning BOOLEAN DEFAULT FALSE,
  wall_rooms_count INTEGER DEFAULT 0,
  interior_window_cleaning BOOLEAN DEFAULT FALSE,
  exterior_window_cleaning BOOLEAN DEFAULT FALSE,
  exterior_windows_count INTEGER DEFAULT 0,
  -- Additional services
  laundry_service BOOLEAN DEFAULT FALSE,
  laundry_loads INTEGER DEFAULT 0,
  make_beds BOOLEAN DEFAULT FALSE,
  beds_count INTEGER DEFAULT 0,
  trash_removal BOOLEAN DEFAULT FALSE,
  trash_bags INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_type ON bookings(recurring_type);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO customers (name, email, phone, address) VALUES
--   ('John Doe', 'john@example.com', '(555) 123-4567', '123 Main St, City, State 12345'),
--   ('Jane Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave, City, State 12345');

-- INSERT INTO bookings (customer_name, customer_email, customer_phone, service_address, service_type, amount, status, scheduled_date, scheduled_time) VALUES
--   ('John Doe', 'john@example.com', '(555) 123-4567', '123 Main St, City, State 12345', 'regular', 80.00, 'confirmed', '2024-01-20', '10:00:00'),
--   ('Jane Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave, City, State 12345', 'deep', 150.00, 'pending', '2024-01-22', '14:00:00'); 