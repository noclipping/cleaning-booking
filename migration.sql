-- Migration script to add new fields for enhanced cleaning services
-- Run this in your Supabase SQL editor

-- Add new fields for recurring services
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS recurring_type VARCHAR(50) DEFAULT 'one-time' CHECK (recurring_type IN ('one-time', 'weekly', 'biweekly')),
ADD COLUMN IF NOT EXISTS recurring_frequency VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0;

-- Add fields for detailed service information
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS bathrooms DECIMAL(3,1) DEFAULT 1;

-- Add appliance services with quantities
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS oven_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS oven_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS microwave_dishwasher_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS microwave_dishwasher_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS refrigerator_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS refrigerator_count INTEGER DEFAULT 0;

-- Add wall and window services
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS wall_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wall_rooms_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interior_window_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS exterior_window_cleaning BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS exterior_windows_count INTEGER DEFAULT 0;

-- Add additional services
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS laundry_service BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS laundry_loads INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS make_beds BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS beds_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trash_removal BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trash_bags INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_type ON bookings(recurring_type);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);

-- Update existing records to have default values
UPDATE bookings SET 
  recurring_type = 'one-time',
  discount_percentage = 0,
  bedrooms = 1,
  bathrooms = 1,
  oven_count = 0,
  microwave_dishwasher_count = 0,
  refrigerator_count = 0,
  wall_rooms_count = 0,
  exterior_windows_count = 0,
  laundry_loads = 0,
  beds_count = 0,
  trash_bags = 0
WHERE recurring_type IS NULL; 