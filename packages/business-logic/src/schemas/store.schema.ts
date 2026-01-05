import { z } from "zod";

export const storeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Store name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  location: z.unknown(), // PostGIS geography type
  is_kosher: z.boolean().default(false),
  logo_url: z.string().url().nullable().optional(),
  wolt_original_link: z.string().url().nullable().optional(),
  owner_id: z.string().uuid(),
  is_approved: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createStoreSchema = storeSchema.omit({
  id: true,
  is_approved: true,
  created_at: true,
  updated_at: true,
});

export const updateStoreSchema = storeSchema
  .omit({
    id: true,
    owner_id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export const approveStoreSchema = z.object({
  is_approved: z.boolean(),
});

export type Store = z.infer<typeof storeSchema>;
export type CreateStore = z.infer<typeof createStoreSchema>;
export type UpdateStore = z.infer<typeof updateStoreSchema>;
export type ApproveStore = z.infer<typeof approveStoreSchema>;
