import { z } from "zod";

export const mediaEntityTypeSchema = z.enum([
  "announcement",
  "event",
  "marketplace",
  "issue",
  "shop",
  "profile",
]);

export const createPresignedUrlSchema = z.object({
  body: z
    .object({
      fileName: z.string().min(3).max(200),
      fileType: z.string().min(3).max(120),
      fileSize: z.number().int().positive(),
      entityType: mediaEntityTypeSchema,
      entityId: z.string().uuid().optional(),
    })
    .strict(),
});

export type MediaEntityType = z.infer<typeof mediaEntityTypeSchema>;
