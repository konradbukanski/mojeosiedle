import { z } from "zod";

export const registerRequestSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      estateId: z.string().uuid().optional(),
      building: z.string().max(16).optional().nullable(),
      staircase: z.string().max(8).optional().nullable(),
      floor: z.string().max(8).optional().nullable(),
      apartment: z.string().max(8).optional().nullable(),
    })
    .strict(),
});

export const loginRequestSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    .strict(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>["body"];
export type LoginRequest = z.infer<typeof loginRequestSchema>["body"];
