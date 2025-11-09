import { z } from "zod";
import { pushPlatformSchema } from "./push-token.schema";

export const pushTokenRecordSchema = z.object({
  id: z.string().uuid(),
  resident_id: z.string().uuid(),
  fcm_token: z.string().min(10),
  device: z.string().nullish(),
  platform: pushPlatformSchema,
  last_used_at: z.string().datetime({ offset: true }).nullish(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type PushTokenRecord = z.infer<typeof pushTokenRecordSchema>;
