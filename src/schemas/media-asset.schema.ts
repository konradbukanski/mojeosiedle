import { z } from "zod";
import { mediaEntityTypeSchema } from "./media.schema";

export const mediaAssetStatusSchema = z.enum(["pending", "linked"]);

export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  entity_type: mediaEntityTypeSchema,
  entity_id: z.string().uuid().nullish(),
  storage_path: z.string(),
  file_name: z.string(),
  file_type: z.string(),
  file_size: z.number(),
  uploader_id: z.string().uuid(),
  estate_id: z.string().uuid(),
  status: mediaAssetStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
