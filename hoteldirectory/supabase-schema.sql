-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  site TEXT,
  phone TEXT,
  full_address TEXT NOT NULL,
  borough TEXT,
  street TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  state TEXT,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  reviews INTEGER,
  reviews_tags TEXT,
  photo TEXT,
  street_view TEXT,
  working_hours TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_borough ON hotels(borough);
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(latitude, longitude);

-- Create function to generate slug from hotel name
CREATE OR REPLACE FUNCTION generate_hotel_slug(hotel_name TEXT, hotel_city TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(hotel_name || '-' || hotel_city, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional, for future use)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON hotels
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert" ON hotels
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON hotels
  FOR UPDATE USING (auth.role() = 'authenticated');