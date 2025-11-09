import { z } from "zod";

export const shopStatusSchema = z.enum(["pending", "approved", "hidden"]);

export const shopSchema = z.object({
  id: z.string().uuid(),
  estate_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  category: z.string(),
  phone: z.string().nullish(),
  website: z.string().url().nullish(),
  address: z.string().nullish(),
  opening_hours: z.record(z.string(), z.string()).nullish(),
  status: shopStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createShopSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120),
      description: z.string().max(500).optional(),
      category: z.string().min(2).max(60),
      phone: z.string().max(32).optional(),
      website: z.string().url().optional(),
      address: z.string().max(160).optional(),
      openingHours: z.record(z.string(), z.string()).optional(),
    })
    .strict(),
});

export const updateShopStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      status: shopStatusSchema,
    })
    .strict(),
});
