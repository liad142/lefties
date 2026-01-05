import { z } from "zod";
import { ROLES } from "@food-rescue/config";
import { isValidIsraeliPhone } from "@food-rescue/utils";

export const profileSchema = z.object({
  id: z.string().uuid(),
  role: z.enum([ROLES.CUSTOMER, ROLES.STORE_OWNER, ROLES.ADMIN]),
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().refine(isValidIsraeliPhone, {
    message: "Invalid Israeli phone number",
  }),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createProfileSchema = profileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateProfileSchema = profileSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial();

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
