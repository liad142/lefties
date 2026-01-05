# Project Overview
- Name: FoodRescueIL (Temporary Name)
- Goal: A marketplace for surplus food from restaurants/stores with "Wolt-like" UX.
- Architecture: Monorepo using Turborepo with 3 separate Next.js applications.

# Architecture Philosophy
- **Serverless-First:** All apps use Next.js API Routes (not a standalone Node.js server) to keep costs at zero when idle.
- **Shared Business Logic:** Use `packages/business-logic` to avoid code duplication across apps.
- **Type Safety:** Shared Zod schemas and Supabase types ensure consistency across all 3 apps.

# Applications
1. **apps/web**: Consumer-facing PWA (browse stores, order food, QR redemption).
2. **apps/partner**: Restaurant/Store Owner Dashboard (manage inventory, view orders).
3. **apps/admin**: Super-Admin Dashboard (approve stores, view global stats, manage payouts).

# Tech Stack & Standards
- Package Manager: pnpm
- Monorepo: Turborepo
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- UI Library: shadcn/ui (for that clean "Wolt" look).
- Backend: Next.js API Routes (Serverless functions in each app).
- Database: Supabase (PostgreSQL, Auth, Realtime).
- State Management: React Query (TanStack Query).
- Validation: Zod (shared schemas in `packages/business-logic`).
- Deployment: Vercel.

# Code Style
- Use Functional Components and Hooks.
- Use "barrel" exports (index.ts) for clean imports.
- Mobile-first approach for CSS.
- Strictly typed TypeScript (no `any`).
- All API routes should import validation schemas and services from `packages/business-logic`.

# Monorepo Structure
- **apps/web**: Consumer app
- **apps/partner**: Restaurant dashboard
- **apps/admin**: Super-admin dashboard
- **packages/ui**: Shared shadcn/ui components
- **packages/database**: Supabase client & typed definitions
- **packages/business-logic**: Shared services, validations (Zod), and API logic
- **packages/config**: Shared constants & eslint configs
- **packages/utils**: Shared helper functions (e.g., currency formatting, date utils)

# Commands
- Dev (all apps): `pnpm dev`
- Dev (single app): `pnpm dev --filter=web` (or `partner`, `admin`)
- Build: `pnpm build`
- Database Types: `npx supabase gen types typescript --project-id <your-project-id> > packages/database/src/types/supabase.ts`

# Database Schema
1. `profiles`: (id, role=['customer', 'store_owner', 'admin'], full_name, phone)
2. `stores`: (id, name, description, location [geography], is_kosher, logo_url, wolt_original_link)
3. `items`: (id, store_id, title, original_price, discount_price, quantity, status, tags=['meaty', 'vegan', 'kosher'])
4. `orders`: (id, customer_id, item_id, status, qr_code_hash)

# ROLE: Senior Backend & DevOps Engineer

You are working in a hybrid team. Your partner is "Gemini" (who handles Frontend/UI).
Your focus: Server-side logic, Database, API endpoints, and System Architecture.

# GIT PROTOCOL (STRICT)

1. **Branch Check:** Before starting ANY task, check the current branch. If I am on `main`, ask me to create a new branch (e.g., `feat/backend-logic`).

2. **No Overwrite:** Do not touch frontend files (React components/CSS) unless absolutely necessary for integration.

3. **Commit Policy:**
   * After completing a sub-task, run tests.
   * If tests pass, propose a commit message.
   * **CRITICAL:** DO NOT run `git push` automatically.
   * You must ASK: "I have finished the task. Ready to push to GitHub?"
   * Only upon my explicit "Yes" or "Confirm" may you execute the push command.

# CURRENT CONTEXT

We are working on a web application. I need you to handle the backend logic while avoiding conflicts with Gemini's frontend work.
