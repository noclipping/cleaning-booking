-- Reset database and add dummy data with new fields
-- WARNING: This will delete all existing data!

-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Recreate the schema with all new fields
-- Create customers table
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create bookings table with all new fields
CREATE TABLE bookings (
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
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_bookings_recurring_type ON bookings(recurring_type);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);

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

-- Insert dummy customers
INSERT INTO customers (name, email, phone, address) VALUES
  ('John Doe', 'john@example.com', '(555) 123-4567', '123 Main St, City, State 12345'),
  ('Jane Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave, City, State 12345'),
  ('Mike Johnson', 'mike@example.com', '(555) 456-7890', '789 Pine Rd, City, State 12345'),
  ('Sarah Wilson', 'sarah@example.com', '(555) 321-6540', '321 Elm St, City, State 12345'),
  ('David Brown', 'david@example.com', '(555) 789-0123', '654 Maple Dr, City, State 12345');

-- Insert dummy bookings with new fields
INSERT INTO bookings (
  customer_name, customer_email, customer_phone, service_address, 
  service_type, amount, status, scheduled_date, scheduled_time, notes,
  recurring_type, recurring_frequency, discount_percentage,
  bedrooms, bathrooms,
  oven_cleaning, oven_count, microwave_dishwasher_cleaning, microwave_dishwasher_count,
  refrigerator_cleaning, refrigerator_count, wall_cleaning, wall_rooms_count,
  interior_window_cleaning, exterior_window_cleaning, exterior_windows_count,
  laundry_service, laundry_loads, make_beds, beds_count, trash_removal, trash_bags
) VALUES
  -- One-time booking with appliances
  ('John Doe', 'john@example.com', '(555) 123-4567', '123 Main St, City, State 12345', 
   'regular', 145.00, 'confirmed', '2024-01-20', '10:00:00', 'First time customer',
   'one-time', NULL, 0, 2, 2,
   true, 1, true, 1, false, 0, false, 0,
   true, false, 0, false, 0, false, 0, false, 0),

  -- Weekly recurring booking
  ('Jane Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave, City, State 12345', 
   'deep', 189.00, 'confirmed', '2024-01-22', '14:00:00', 'Weekly recurring service',
   'weekly', 'weekly', 10, 3, 2.5,
   false, 0, true, 1, true, 1, true, 3,
   false, true, 8, true, 2, true, 3, true, 2),

  -- Bi-weekly recurring booking
  ('Mike Johnson', 'mike@example.com', '(555) 456-7890', '789 Pine Rd, City, State 12345', 
   'regular', 126.00, 'confirmed', '2024-01-25', '09:00:00', 'Bi-weekly service',
   'biweekly', 'biweekly', 10, 1, 1,
   true, 1, false, 0, false, 0, false, 0,
   true, false, 0, false, 0, false, 0, false, 0),

  -- Move-in service with all extras
  ('Sarah Wilson', 'sarah@example.com', '(555) 321-6540', '321 Elm St, City, State 12345', 
   'move-in', 320.00, 'pending', '2024-01-28', '11:00:00', 'Moving in next week',
   'one-time', NULL, 0, 4, 3,
   true, 1, true, 1, true, 1, true, 4,
   true, true, 12, true, 4, true, 4, true, 3),

  -- Post-construction with wall cleaning
  ('David Brown', 'david@example.com', '(555) 789-0123', '654 Maple Dr, City, State 12345', 
   'post-construction', 450.00, 'completed', '2024-01-15', '08:00:00', 'Post-renovation cleanup',
   'one-time', NULL, 0, 3, 2,
   true, 1, true, 1, true, 1, true, 3,
   true, true, 10, false, 0, false, 0, true, 5),

  -- Simple regular cleaning
  ('John Doe', 'john@example.com', '(555) 123-4567', '123 Main St, City, State 12345', 
   'regular', 80.00, 'completed', '2024-01-10', '13:00:00', 'Regular maintenance',
   'one-time', NULL, 0, 1, 1,
   false, 0, false, 0, false, 0, false, 0,
   false, false, 0, false, 0, false, 0, false, 0),

  -- Weekly recurring with laundry
  ('Jane Smith', 'jane@example.com', '(555) 987-6543', '456 Oak Ave, City, State 12345', 
   'regular', 171.00, 'confirmed', '2024-01-29', '15:00:00', 'Weekly with laundry service',
   'weekly', 'weekly', 10, 2, 2,
   false, 0, false, 0, false, 0, false, 0,
   false, false, 0, true, 3, false, 0, false, 0),

  -- Cancelled booking
  ('Mike Johnson', 'mike@example.com', '(555) 456-7890', '789 Pine Rd, City, State 12345', 
   'deep', 150.00, 'cancelled', '2024-01-30', '10:00:00', 'Customer cancelled',
   'one-time', NULL, 0, 2, 1.5,
   false, 0, false, 0, false, 0, false, 0,
   false, false, 0, false, 0, false, 0, false, 0);

-- Display the results
SELECT 'Database reset complete!' as status;
SELECT COUNT(*) as total_customers FROM customers;
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT 
  recurring_type,
  COUNT(*) as count,
  AVG(amount) as avg_amount
FROM bookings 
GROUP BY recurring_type; 