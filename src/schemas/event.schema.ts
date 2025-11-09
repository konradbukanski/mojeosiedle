import { z } from "zod";

export const eventStatusSchema = z.enum(["pending", "approved", "cancelled"]);

export const eventSchema = z.object({
  id: z.string().uuid(),
  estate_id: z.string().uuid(),
  creator_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  start_at: z.string().datetime({ offset: true }),
  end_at: z.string().datetime({ offset: true }),
  capacity: z.number().int().nullish(),
  status: eventStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createEventSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(120),
      description: z.string().min(3),
      location: z.string().min(1),
      startAt: z.string().datetime(),
      endAt: z.string().datetime(),
      capacity: z.number().int().positive().optional(),
      mediaIds: z.array(z.string().uuid()).optional(),
    })
    .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
      message: "Event end time must be after start time",
      path: ["endAt"],
    }),
});

export const registerForEventSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      status: z.enum(["going", "interested", "not_going"]).default("going"),
    })
    .strict(),
});

export const listEventsSchema = z.object({
  query: z.object({
    estateId: z.string().uuid().optional(),
    status: eventStatusSchema.optional(),
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
