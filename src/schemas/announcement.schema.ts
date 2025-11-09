import { z } from "zod";

export const announcementCategorySchema = z.enum(["awaria", "zgubione", "sprzedaż", "ogólne", "wydarzenia"]);
export const announcementStatusSchema = z.enum(["pending", "approved", "rejected"]);
export const announcementScopeSchema = z.enum(["estate", "building"]);

export const announcementSchema = z.object({
  id: z.string().uuid(),
  estate_id: z.string().uuid(),
  author_id: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  category: announcementCategorySchema,
  scope: announcementScopeSchema,
  building: z.string().nullish(),
  staircase: z.string().nullish(),
  status: announcementStatusSchema,
  published_at: z.string().datetime({ offset: true }).nullish(),
  expires_at: z.string().datetime({ offset: true }).nullish(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createAnnouncementSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(120),
      body: z.string().min(3),
      category: announcementCategorySchema,
      scope: announcementScopeSchema.default("estate"),
      building: z.string().max(16).optional().nullable(),
      staircase: z.string().max(8).optional().nullable(),
      publishAt: z.string().datetime().optional(),
      expiresAt: z.string().datetime().optional(),
      mediaIds: z.array(z.string().uuid()).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.scope === "building" && !data.building) {
        ctx.addIssue({
          code: "custom",
          message: "Building must be provided when scope is building",
          path: ["building"],
        });
      }
    }),
});

export const updateAnnouncementStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      status: announcementStatusSchema,
      reason: z.string().max(280).optional(),
    })
    .strict(),
});

export const listAnnouncementsSchema = z.object({
  query: z.object({
    scope: announcementScopeSchema.optional(),
    category: announcementCategorySchema.optional(),
    building: z.string().optional(),
    estateId: z.string().uuid().optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    cursor: z.string().optional(),
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

export type Announcement = z.infer<typeof announcementSchema>;
