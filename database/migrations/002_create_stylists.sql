-- Migration 002: Create stylists table

CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  bio TEXT,
  specialty VARCHAR(120),
  photo_url TEXT,
  instagram_handle VARCHAR(80),
  rating NUMERIC(3,2) DEFAULT 5.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_stylists_updated_at ON stylists;
CREATE TRIGGER update_stylists_updated_at BEFORE UPDATE ON stylists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
