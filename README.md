# FoodRescueIL - Food Rescue Marketplace

A "Wolt-like" marketplace for surplus food from restaurants and stores in the Israeli market.

## Project Status

**Phase 1 Complete: Scaffolding & Shared Packages** ✅
**Phase 2 Complete: Applications Setup** ✅
**Phase 3 Complete: Database & Security Strategy** ✅

## Architecture

This is a **Turborepo monorepo** with 3 separate Next.js applications sharing common packages.

### Applications (✅ Complete)

- **apps/web**: Consumer-facing PWA (Port 3000)
- **apps/partner**: Restaurant/Store Owner Dashboard (Port 3001)
- **apps/admin**: Super-Admin Dashboard (Port 3002)

### Shared Packages (✅ Complete)

- **packages/config**: Shared TypeScript/ESLint configs and constants
- **packages/utils**: Helper functions (currency, date formatting, validation)
- **packages/database**: Supabase client and type definitions
- **packages/ui**: Shared UI components (shadcn/ui + Tailwind)
- **packages/business-logic**: Zod schemas, validation, and business services

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Library**: shadcn/ui
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Validation**: Zod
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development Commands

```bash
# Run all apps in development mode
pnpm dev

# Run a specific app
pnpm dev --filter=web
pnpm dev --filter=partner
pnpm dev --filter=admin

# Build all apps
pnpm build

# Lint
pnpm lint
```

## Database Schema

The project uses Supabase (PostgreSQL) with the following tables:

1. **profiles**: User profiles (customer, store_owner, admin) - extends auth.users
2. **stores**: Restaurant/store information with PostGIS geolocation
3. **items**: Surplus food items with dietary tags and pricing
4. **orders**: Customer orders with QR code redemption

**Row Level Security (RLS)** is enabled on all tables for secure data access.

See `packages/database/README.md` for detailed schema documentation.

## Project Structure

```
FoodRescueIL/
├── apps/                       # Next.js applications (Phase 2)
│   ├── web/                   # Consumer PWA
│   ├── partner/               # Restaurant Dashboard
│   └── admin/                 # Super-Admin Dashboard
├── packages/
│   ├── config/                # ✅ Shared configs & constants
│   ├── utils/                 # ✅ Helper functions
│   ├── database/              # ✅ Supabase client & types
│   ├── ui/                    # ✅ Shared UI components
│   └── business-logic/        # ✅ Zod schemas & services
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md                  # Project context & rules
```

## Quick Start

### 1. Set Up Database

Run the SQL migration script in Supabase:
1. Open: https://supabase.com/dashboard/project/afpgxnypxlaenrfogfmn/editor
2. Copy contents of `packages/database/supabase_schema.sql`
3. Run the script

See `PHASE-3-COMPLETE.md` for detailed setup instructions.

### 2. Generate TypeScript Types

```bash
# From Supabase dashboard or CLI
npx supabase gen types typescript --project-id afpgxnypxlaenrfogfmn > packages/database/src/types/supabase.ts
```

### 3. Start Development

```bash
pnpm dev
```

## Next Steps (Phase 4)

**Authentication & Core Features**:
1. Implement sign-up/login flows
2. Role-based routing and guards
3. Customer app: Browse stores, order items
4. Partner dashboard: Manage inventory
5. Admin dashboard: Approve stores

## Documentation

See `CLAUDE.md` for detailed project guidelines and architectural decisions.

### Change Log
- **StoreRescueCard UI Upgrade**: Re-built the `StoreRescueCard` component with a high-fidelity "SpareEat" style design, including floating logos, discount badges, and a cleaner footer.
- **Main Marketplace Page Refactor**: Overhauled the consumer marketplace feed with a modern `bg-gray-50` background, horizontally scrolling filter pills, a responsive grid, and a floating map button.
- **Mock Data Update**: Implemented real-world food imagery and store metadata using Unsplash and UI Avatars for a premium "app feel."
- **UI Refinement (Screenshot Match)**: Refined `StoreRescueCard` to feature centered logos and titles, a green-star rating badge, and a centered discount pill. Added top icon-based navigation (Filter/Search/Map) and a bottom app-style navigation bar (Menu/Orders/Save food/Profile) to match the mobile app visual reference exactly.
- **Ecological Hedonism Re-design**: Implemented the "Ultimate Store Card" (`StoreCard`) in `@food-rescue/ui` using Framer Motion, Glassmorphism, and immersive imagery. Updated the `web` app main feed to showcase this new high-fidelity, mobile-first design with RTL support and visual stock indicators.
- **"Netflix for Food" Discovery Feed**: Overhauled the `web` app homepage with a magazine-style discovery layout. Introduced horizontal scroll-snap sections (Hero carousel, compact Ending Soon cards, prominent highlights) and a sticky glassmorphism filter bar. Integrated Framer Motion staggered animations for a native-app discovery experience.
