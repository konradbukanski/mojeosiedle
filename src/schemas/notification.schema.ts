import { z } from "zod";

const notificationTargetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("estate"), estateId: z.string().uuid() }),
  z.object({ type: z.literal("residents"), residentIds: z.array(z.string().uuid()).min(1) }),
  z.object({ type: z.literal("topic"), topic: z.string().min(1) }),
]);

export const sendNotificationSchema = z.object({
  body: z
    .object({
      title: z.string().min(1),
      body: z.string().min(1),
      target: notificationTargetSchema,
      data: z.record(z.string(), z.string()).optional(),
    })
    .strict(),
});
