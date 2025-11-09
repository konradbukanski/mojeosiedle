import { z } from "zod";

export const residentRoleSchema = z.enum(["resident", "moderator", "admin"]);

export const residentSchema = z.object({
  id: z.string().uuid(),
  auth_user_id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  estate_id: z.string().uuid(),
  building: z.string().nullish(),
  staircase: z.string().nullish(),
  floor: z.string().nullish(),
  apartment: z.string().nullish(),
  role: residentRoleSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const updateResidentProfileSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      estateId: z.string().uuid().optional(),
      building: z.string().max(16).optional().nullable(),
      staircase: z.string().max(8).optional().nullable(),
      floor: z.string().max(8).optional().nullable(),
      apartment: z.string().max(8).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
      path: [],
    }),
});

export const updateResidentLocationSchema = z.object({
  body: z
    .object({
      building: z.string().max(16),
      staircase: z.string().max(8).optional().nullable(),
      floor: z.string().max(8).optional().nullable(),
      apartment: z.string().max(8).optional().nullable(),
    })
    .strict(),
});

export type Resident = z.infer<typeof residentSchema>;
export type ResidentRole = z.infer<typeof residentRoleSchema>;
