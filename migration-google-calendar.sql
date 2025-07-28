-- Migration to add Google Calendar event ID to bookings table
-- This allows tracking which bookings have associated calendar events
-- Add the google_calendar_event_id column
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS google_calendar_event_id VARCHAR(255);
-- Add an index for better performance when querying by calendar event ID
CREATE INDEX IF NOT EXISTS idx_bookings_google_calendar_event_id ON bookings(google_calendar_event_id);
-- Add a comment to document the column purpose
COMMENT ON COLUMN bookings.google_calendar_event_id IS 'Google Calendar event ID for tracking and managing calendar events associated with bookings';