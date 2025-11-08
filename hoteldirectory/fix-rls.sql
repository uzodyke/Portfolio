-- Temporarily disable RLS for import
ALTER TABLE hotels DISABLE ROW LEVEL SECURITY;

-- Or update the policy to allow anon inserts
DROP POLICY IF EXISTS "Allow authenticated insert" ON hotels;
CREATE POLICY "Allow anon insert" ON hotels
  FOR INSERT WITH CHECK (true);

-- Also update the anon key permissions
GRANT INSERT ON hotels TO anon;
GRANT UPDATE ON hotels TO anon;