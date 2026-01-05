# Phase 3: Database & Security Strategy - COMPLETE ✅

## What Was Created

### 1. SQL Migration Script (`packages/database/supabase_schema.sql`)

A comprehensive, production-ready SQL script that includes:

#### ✅ Extensions
- **uuid-ossp** - UUID generation
- **postgis** - Geolocation features for finding nearby stores

#### ✅ Type-Safe Enums
- `user_role` - customer, store_owner, admin
- `store_status` - pending, active, rejected
- `item_status` - active, sold_out
- `order_status` - pending, confirmed, ready, collected, cancelled
- `item_tag` - meaty, dairy, vegan, vegetarian, gluten_free, kosher, halal

#### ✅ Tables with Proper Constraints

**profiles** (extends auth.users)
- Links to Supabase Auth users (1:1)
- Auto-created on signup via trigger
- Stores: role, full_name, phone, avatar_url

**stores**
- Owner-based (references profiles)
- Status workflow: pending → active (admin approval)
- PostGIS geography point for location queries
- Fields: name, description, address, is_kosher, wolt_link, image_url

**items**
- Belongs to stores
- Price validation (discount ≤ original)
- Quantity tracking
- Array of dietary tags

**orders**
- Links customer, store, and item
- QR code hash for redemption
- Status tracking workflow

#### ✅ Row Level Security (RLS) - CRITICAL FOR SECURITY

**Why RLS is Essential:**
- Direct API access from frontend means ANYONE can call your database
- Without RLS, users could read/modify ANY data
- RLS enforces permissions at the database level

**Policies Created:**

| Table | Who | Can Do What |
|-------|-----|-------------|
| **profiles** | Anyone | Read public profiles |
| | Users | Update own profile |
| | Admins | Update any profile |
| **stores** | Anyone | View active stores |
| | Store Owners | Create/update own stores |
| | Admins | Approve/reject/delete any store |
| **items** | Anyone | View active items |
| | Store Owners | Manage items in their stores |
| **orders** | Customers | View/create own orders |
| | Store Owners | View/update orders for their stores |
| | Admins | View all orders |

#### ✅ Automatic Triggers
- **Auto-create profile** when user signs up via Supabase Auth
- **Auto-update timestamps** on all table updates

#### ✅ Performance Indexes
- UUID foreign keys
- Status fields
- PostGIS location (for spatial queries)
- Tags (GIN index for array queries)

#### ✅ Seed Data
Pre-populated test data:
- 1 Admin user
- 2 Store owners (Mama Schnitzel, Suzy's Vegan Heaven)
- 1 Customer
- 2 Active stores
- 4 Sample items (with various tags)
- 1 Sample order

### 2. Database Package README (`packages/database/README.md`)

Comprehensive documentation including:
- Setup instructions
- Schema overview
- Usage examples
- TypeScript type examples
- PostGIS geolocation queries
- Troubleshooting guide

## What You Need to Do Next

### Step 1: Run the Migration Script ⚡

1. **Open Supabase SQL Editor:**
   https://supabase.com/dashboard/project/afpgxnypxlaenrfogfmn/editor

2. **Create New Query:**
   Click "New Query" in the SQL Editor

3. **Copy & Paste:**
   Copy the entire contents of `packages/database/supabase_schema.sql`

4. **Run:**
   Click **Run** (or Ctrl/Cmd + Enter)

5. **Verify:**
   You should see "Success. No rows returned" (this is normal!)

### Step 2: Verify Tables Were Created

Run this verification query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
- items
- orders
- profiles
- stores

### Step 3: Check Seed Data

```sql
-- Should return 4 profiles (1 admin, 2 store owners, 1 customer)
SELECT * FROM profiles;

-- Should return 2 stores
SELECT * FROM stores;

-- Should return 4 items
SELECT * FROM items;

-- Should return 1 order
SELECT * FROM orders;
```

### Step 4: Generate TypeScript Types

**Option A - Dashboard (Recommended):**
1. Go to: https://supabase.com/dashboard/project/afpgxnypxlaenrfogfmn/api
2. Scroll to "Generate TypeScript Types"
3. Click "Generate Types"
4. Copy the code and replace `packages/database/src/types/supabase.ts`

**Option B - CLI:**
```bash
npx supabase gen types typescript --project-id afpgxnypxlaenrfogfmn > packages/database/src/types/supabase.ts
```

## Security Notes 🔐

### Why Row Level Security Matters

Your app uses Supabase's **direct database access** from the frontend:
- Users connect directly to PostgreSQL via Supabase API
- The anon/publishable key is public (in your JavaScript bundle)
- **WITHOUT RLS, anyone could read/modify ALL data**

### How RLS Protects You

Every query is automatically filtered by policies:

```typescript
// Customer tries to read orders
const { data } = await supabase.from('orders').select('*');
// RLS automatically filters to: WHERE customer_id = auth.uid()

// Store owner tries to update a store
const { data } = await supabase
  .from('stores')
  .update({ status: 'active' })
  .eq('id', storeId);
// RLS checks: Does owner_id = auth.uid()? If NO → permission denied
```

### Testing RLS (Important!)

Before going live, test that users **cannot** access data they shouldn't:

1. Sign up as a regular customer
2. Try to update someone else's order
3. Try to approve a store (admin-only action)
4. Verify you get permission denied errors

## Database Schema Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐
│    profiles     │
│  id, role,      │
│  full_name      │
└────────┬────────┘
         │
         │ owner_id
         │
┌────────▼────────┐
│     stores      │
│  name, address, │
│  status, etc    │
└────────┬────────┘
         │
         │ store_id
         │
┌────────▼────────┐
│     items       │
│  name, price,   │
│  quantity       │
└────────┬────────┘
         │
         │ item_id
         │
┌────────▼────────┐
│     orders      │
│  customer_id,   │
│  qr_code_hash   │
└─────────────────┘
```

## Next Steps (Phase 4)

Once your database is set up, you're ready for:

1. **Auth Flow** - Sign up, login, role-based routing
2. **Customer App** - Browse stores, order items, QR redemption
3. **Partner Dashboard** - Manage inventory, view orders
4. **Admin Dashboard** - Approve stores, view analytics

## Useful SQL Queries

### Find all pending stores (Admin view)
```sql
SELECT s.name, p.full_name as owner
FROM stores s
JOIN profiles p ON s.owner_id = p.id
WHERE s.status = 'pending';
```

### Find items about to sell out
```sql
SELECT i.name, s.name as store, i.quantity
FROM items i
JOIN stores s ON i.store_id = s.id
WHERE i.quantity <= 2 AND i.status = 'active';
```

### Customer order history
```sql
SELECT o.*, i.name as item_name, s.name as store_name
FROM orders o
JOIN items i ON o.item_id = i.id
JOIN stores s ON o.store_id = s.id
WHERE o.customer_id = 'USER_UUID_HERE';
```

## Support

If you encounter issues:
- Check `packages/database/README.md` for troubleshooting
- Verify RLS policies in Supabase Dashboard: Settings > Database > Policies
- Test queries in SQL Editor before running in app

---

**Database setup is complete! Ready to build features! 🚀**
