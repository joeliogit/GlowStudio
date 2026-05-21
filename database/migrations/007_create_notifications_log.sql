-- Migration 007: Create notifications_log table

CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  channel VARCHAR(30) NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms')),
  type VARCHAR(60) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  message TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_booking ON notifications_log(booking_id);
