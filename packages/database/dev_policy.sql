-- =====================================================
-- DANGEROUS: For Development Only
-- This disables Row Level Security for rapid prototyping
-- NEVER use this in production!
-- =====================================================

-- Disable RLS on all tables
ALTER TABLE items DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Grant full access to anon role (public access)
GRANT ALL ON profiles TO anon;
GRANT ALL ON stores TO anon;
GRANT ALL ON items TO anon;
GRANT ALL ON orders TO anon;

-- Grant usage on sequences (for inserts)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
