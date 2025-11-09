import { z } from "zod";

export const marketplaceStatusSchema = z.enum(["pending", "approved", "sold", "rejected"]);
export const marketplaceCategorySchema = z.enum(["electronics", "home", "services", "other"]);
export const marketplaceListingTypeSchema = z.enum(["offer", "request"]);

export const marketplaceItemSchema = z.object({
  id: z.string().uuid(),
  estate_id: z.string().uuid(),
  seller_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  price: z.number().nullish(),
  currency: z.string(),
  category: marketplaceCategorySchema,
  listing_type: marketplaceListingTypeSchema,
  status: marketplaceStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createMarketplaceItemSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(120),
      description: z.string().min(3),
      price: z.number().positive().optional(),
      currency: z.string().length(3).default("PLN"),
      category: marketplaceCategorySchema.default("other"),
      listingType: marketplaceListingTypeSchema.default("offer"),
      mediaIds: z.array(z.string().uuid()).optional(),
    })
    .strict(),
});

export const updateMarketplaceStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      status: marketplaceStatusSchema,
    })
    .strict(),
});

export const listMarketplaceItemsSchema = z.object({
  query: z.object({
    estateId: z.string().uuid().optional(),
    status: marketplaceStatusSchema.optional(),
    category: marketplaceCategorySchema.optional(),
    listingType: marketplaceListingTypeSchema.optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    includePending: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((value) => {
        if (value === undefined) return false;
        if (typeof value === "boolean") return value;
        return ["true", "1", "yes"].includes(value.toLowerCase());
      }),
  }),
});

export type MarketplaceItem = z.infer<typeof marketplaceItemSchema>;
export type MarketplaceStatus = z.infer<typeof marketplaceStatusSchema>;
export type MarketplaceCategory = z.infer<typeof marketplaceCategorySchema>;
export type MarketplaceListingType = z.infer<typeof marketplaceListingTypeSchema>;

export const updateMarketplaceItemSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      title: z.string().min(3).max(120).optional(),
      description: z.string().min(3).optional(),
      price: z.number().positive().nullable().optional(),
      currency: z.string().length(3).optional(),
      category: marketplaceCategorySchema.optional(),
      listingType: marketplaceListingTypeSchema.optional(),
      status: marketplaceStatusSchema.optional(),
      mediaIds: z.array(z.string().uuid()).optional(),
    })
    .refine((values) => Object.keys(values).length > 0, {
      message: "At least one field must be provided",
    }),
});
