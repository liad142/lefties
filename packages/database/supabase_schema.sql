-- =====================================================
-- FoodRescueIL Database Schema
-- Supabase SQL Migration Script
-- Run this in: Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geolocation features (future use)
CREATE EXTENSION IF NOT EXISTS "postgis";


-- =====================================================
-- 2. CREATE ENUMS
-- =====================================================

-- User role enum
CREATE TYPE user_role AS ENUM ('customer', 'store_owner', 'admin');

-- Store status enum
CREATE TYPE store_status AS ENUM ('pending', 'active', 'rejected');

-- Item status enum
CREATE TYPE item_status AS ENUM ('active', 'sold_out');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'ready', 'collected', 'cancelled');

-- Item tags enum (for dietary preferences)
CREATE TYPE item_tag AS ENUM ('meaty', 'dairy', 'vegan', 'vegetarian', 'gluten_free', 'kosher', 'halal');


-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- PROFILES TABLE
-- Extends auth.users with application-specific data
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_profiles_role ON profiles(role);

-- STORES TABLE
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326), -- PostGIS: lat/long for geolocation
    image_url TEXT,
    is_kosher BOOLEAN NOT NULL DEFAULT false,
    wolt_link TEXT,
    status store_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_location ON stores USING GIST(location);

-- ITEMS TABLE
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    original_price DECIMAL(10, 2) NOT NULL CHECK (original_price >= 0),
    discount_price DECIMAL(10, 2) NOT NULL CHECK (discount_price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    status item_status NOT NULL DEFAULT 'active',
    tags item_tag[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure discount price is less than or equal to original price
    CONSTRAINT valid_discount CHECK (discount_price <= original_price)
);

-- Add indexes for performance
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_tags ON items USING GIN(tags);

-- ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status NOT NULL DEFAULT 'pending',
    qr_code_hash TEXT UNIQUE, -- For QR code redemption
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    collected_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_qr_code_hash ON orders(qr_code_hash) WHERE qr_code_hash IS NOT NULL;


-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- -------------------------------------
-- PROFILES POLICIES
-- -------------------------------------

-- Users can view all profiles (for display purposes)
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- -------------------------------------
-- STORES POLICIES
-- -------------------------------------

-- Anyone can view active stores
CREATE POLICY "Active stores are viewable by everyone"
    ON stores FOR SELECT
    USING (status = 'active' OR owner_id = auth.uid() OR
           EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Store owners can insert their own stores
CREATE POLICY "Store owners can create stores"
    ON stores FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('store_owner', 'admin'))
    );

-- Store owners can update their own stores
CREATE POLICY "Store owners can update own stores"
    ON stores FOR UPDATE
    USING (auth.uid() = owner_id);

-- Admins can update any store (for approval/rejection)
CREATE POLICY "Admins can update any store"
    ON stores FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admins can delete any store
CREATE POLICY "Admins can delete any store"
    ON stores FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- -------------------------------------
-- ITEMS POLICIES
-- -------------------------------------

-- Anyone can view active items from active stores
CREATE POLICY "Active items are viewable by everyone"
    ON items FOR SELECT
    USING (
        status = 'active' OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = items.store_id AND stores.owner_id = auth.uid()
        )
    );

-- Store owners can insert items for their stores
CREATE POLICY "Store owners can create items"
    ON items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = store_id AND stores.owner_id = auth.uid()
        )
    );

-- Store owners can update items in their stores
CREATE POLICY "Store owners can update own items"
    ON items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = items.store_id AND stores.owner_id = auth.uid()
        )
    );

-- Store owners can delete items in their stores
CREATE POLICY "Store owners can delete own items"
    ON items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = items.store_id AND stores.owner_id = auth.uid()
        )
    );

-- -------------------------------------
-- ORDERS POLICIES
-- -------------------------------------

-- Customers can view their own orders
-- Store owners can view orders for their stores
CREATE POLICY "Users can view relevant orders"
    ON orders FOR SELECT
    USING (
        auth.uid() = customer_id OR
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Customers can create orders
CREATE POLICY "Customers can create orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own pending orders
CREATE POLICY "Customers can update own pending orders"
    ON orders FOR UPDATE
    USING (auth.uid() = customer_id AND status = 'pending');

-- Store owners can update orders for their stores
CREATE POLICY "Store owners can update store orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM stores
            WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
        )
    );


-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =====================================================
-- 6. SEED DATA (Dummy Content for Development)
-- =====================================================

-- Note: In production, you'll create actual users via Supabase Auth
-- For testing, we'll insert mock data with hardcoded UUIDs

-- Insert Admin Profile
INSERT INTO profiles (id, role, full_name, phone) VALUES
    ('00000000-0000-0000-0000-000000000001'::uuid, 'admin', 'Admin User', '+972501234567');

-- Insert Store Owners
INSERT INTO profiles (id, role, full_name, phone) VALUES
    ('00000000-0000-0000-0000-000000000002'::uuid, 'store_owner', 'Moshe Cohen', '+972502345678'),
    ('00000000-0000-0000-0000-000000000003'::uuid, 'store_owner', 'Sarah Levy', '+972503456789');

-- Insert Customer
INSERT INTO profiles (id, role, full_name, phone) VALUES
    ('00000000-0000-0000-0000-000000000004'::uuid, 'customer', 'David Israel', '+972504567890');

-- Insert Stores
INSERT INTO stores (id, owner_id, name, description, address, is_kosher, status, location) VALUES
    (
        '10000000-0000-0000-0000-000000000001'::uuid,
        '00000000-0000-0000-0000-000000000002'::uuid,
        'Mama Schnitzel',
        'The best schnitzel in Tel Aviv! Fresh, crispy, and delicious.',
        'Dizengoff St 123, Tel Aviv',
        true,
        'active',
        ST_SetSRID(ST_MakePoint(34.7748, 32.0853), 4326)::geography -- Tel Aviv coordinates
    ),
    (
        '10000000-0000-0000-0000-000000000002'::uuid,
        '00000000-0000-0000-0000-000000000003'::uuid,
        'Suzy''s Vegan Heaven',
        'Plant-based paradise. Healthy, sustainable, and incredibly tasty!',
        'Rothschild Blvd 45, Tel Aviv',
        false,
        'active',
        ST_SetSRID(ST_MakePoint(34.7678, 32.0667), 4326)::geography
    );

-- Insert Items
INSERT INTO items (store_id, name, description, original_price, discount_price, quantity, status, tags) VALUES
    (
        '10000000-0000-0000-0000-000000000001'::uuid,
        'Schnitzel Surprise Bag',
        '3-4 fresh schnitzels + side dish. Perfect for dinner!',
        60.00,
        25.00,
        5,
        'active',
        ARRAY['meaty', 'kosher']::item_tag[]
    ),
    (
        '10000000-0000-0000-0000-000000000001'::uuid,
        'Fresh Salad Box',
        'Mixed greens with house dressing',
        35.00,
        15.00,
        3,
        'active',
        ARRAY['vegetarian', 'kosher']::item_tag[]
    ),
    (
        '10000000-0000-0000-0000-000000000002'::uuid,
        'Vegan Buddha Bowl',
        'Quinoa, roasted veggies, tahini sauce, and love!',
        50.00,
        20.00,
        8,
        'active',
        ARRAY['vegan', 'gluten_free']::item_tag[]
    ),
    (
        '10000000-0000-0000-0000-000000000002'::uuid,
        'Plant-Based Burger Combo',
        '2 beyond burgers with sweet potato fries',
        55.00,
        22.00,
        4,
        'active',
        ARRAY['vegan', 'vegetarian']::item_tag[]
    );

-- Insert Sample Order
INSERT INTO orders (customer_id, store_id, item_id, quantity, total_amount, status, qr_code_hash) VALUES
    (
        '00000000-0000-0000-0000-000000000004'::uuid,
        '10000000-0000-0000-0000-000000000001'::uuid,
        (SELECT id FROM items WHERE name = 'Schnitzel Surprise Bag' LIMIT 1),
        1,
        25.00,
        'confirmed',
        encode(digest('order-' || gen_random_uuid()::text, 'sha256'), 'hex')
    );


-- =====================================================
-- 7. UTILITY FUNCTIONS (OPTIONAL - FOR FUTURE USE)
-- =====================================================

-- Function to calculate distance between two points (for future "nearby stores" feature)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
    RETURN ST_Distance(
        ST_SetSRID(ST_MakePoint(lon1, lat1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)::geography
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================

-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Generate TypeScript types: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
-- 3. Start building your app!

-- Test queries to verify setup:
-- SELECT * FROM profiles;
-- SELECT * FROM stores;
-- SELECT * FROM items;
-- SELECT * FROM orders;
