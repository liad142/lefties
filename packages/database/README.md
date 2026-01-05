# Database Package

Supabase client configuration and TypeScript types for FoodRescueIL.

## Setup Instructions

### 1. Run the SQL Migration Script

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/afpgxnypxlaenrfogfmn/editor
2. Click on **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

### 2. Verify Tables Were Created

Run this query in the SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `profiles`
- `stores`
- `items`
- `orders`

### 3. Generate TypeScript Types

After the tables are created, generate TypeScript types:

**Option A - From Dashboard (Easiest):**
1. Go to: https://supabase.com/dashboard/project/afpgxnypxlaenrfogfmn/api
2. Scroll to "Generate TypeScript Types"
3. Click "Generate Types"
4. Copy the generated code
5. Replace the contents of `packages/database/src/types/supabase.ts`

**Option B - Using CLI:**
```bash
npx supabase gen types typescript --project-id afpgxnypxlaenrfogfmn > packages/database/src/types/supabase.ts
```

## Database Schema

### Tables

#### `profiles`
- Extends `auth.users` with application-specific data
- One-to-one relationship with Supabase Auth users
- Auto-created when user signs up (via trigger)

#### `stores`
- Restaurant/store information
- Owned by users with `store_owner` or `admin` role
- Requires admin approval (status: pending → active)
- Includes PostGIS geography point for location-based queries

#### `items`
- Surplus food items available for purchase
- Belongs to a store
- Supports tags for dietary preferences
- Automatically marked as `sold_out` when quantity reaches 0

#### `orders`
- Customer orders
- Includes QR code hash for redemption
- Links customer, store, and item

### Enums

- `user_role`: `customer`, `store_owner`, `admin`
- `store_status`: `pending`, `active`, `rejected`
- `item_status`: `active`, `sold_out`
- `order_status`: `pending`, `confirmed`, `ready`, `collected`, `cancelled`
- `item_tag`: `meaty`, `dairy`, `vegan`, `vegetarian`, `gluten_free`, `kosher`, `halal`

### Row Level Security (RLS)

All tables have RLS enabled with policies:

**Profiles:**
- ✅ Anyone can view public profiles
- ✅ Users can update their own profile
- ✅ Admins can update any profile

**Stores:**
- ✅ Public can view active stores
- ✅ Store owners can create/update their own stores
- ✅ Admins can approve/reject/delete any store

**Items:**
- ✅ Public can view active items
- ✅ Store owners can manage items in their stores

**Orders:**
- ✅ Customers can view/create their own orders
- ✅ Store owners can view/update orders for their stores

## Usage

### Browser Client (Client-Side)

```typescript
import { createBrowserClient } from '@food-rescue/database';

const supabase = createBrowserClient();

// Fetch active stores
const { data: stores } = await supabase
  .from('stores')
  .select('*')
  .eq('status', 'active');
```

### Server Client (Server-Side / API Routes)

```typescript
import { createServerClient } from '@food-rescue/database/client';

const supabase = createServerClient();

// Admin operation - approve a store
const { data } = await supabase
  .from('stores')
  .update({ status: 'active' })
  .eq('id', storeId);
```

### TypeScript Types

```typescript
import type { Database } from '@food-rescue/database/types';

type Store = Database['public']['Tables']['stores']['Row'];
type InsertStore = Database['public']['Tables']['stores']['Insert'];
type UpdateStore = Database['public']['Tables']['stores']['Update'];
```

## Seed Data

The migration script includes test data:

**Profiles:**
- 1 Admin
- 2 Store Owners (Moshe Cohen, Sarah Levy)
- 1 Customer (David Israel)

**Stores:**
- Mama Schnitzel (Kosher, Meaty)
- Suzy's Vegan Heaven (Vegan)

**Items:**
- 4 sample items with different tags

**Note:** These use hardcoded UUIDs for testing. In production, actual users will sign up via Supabase Auth.

## PostGIS (Geolocation)

The schema enables PostGIS for future location-based features:

```sql
-- Find stores within 5km radius
SELECT name,
       ST_Distance(location, ST_SetSRID(ST_MakePoint(34.7748, 32.0853), 4326)::geography) as distance
FROM stores
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(34.7748, 32.0853), 4326)::geography,
    5000 -- 5km in meters
)
ORDER BY distance;
```

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the migration script in Supabase SQL Editor
- Check that you're querying the correct table name

### "permission denied" error
- Check RLS policies in Supabase Dashboard
- Verify user is authenticated (`auth.uid()` is set)

### Type errors after schema changes
- Regenerate TypeScript types after any schema changes
- Restart your dev server to pick up new types

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostGIS Documentation](https://postgis.net/documentation/)
