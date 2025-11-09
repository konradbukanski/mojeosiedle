import { z } from "zod";

export const pushPlatformSchema = z.enum(["android", "ios", "web"]);

export const registerPushTokenSchema = z.object({
  body: z
    .object({
      token: z.string().min(20),
      device: z.string().max(120).optional(),
      platform: pushPlatformSchema,
    })
    .strict(),
});

export type PushPlatform = z.infer<typeof pushPlatformSchema>;
