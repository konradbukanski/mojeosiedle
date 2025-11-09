import { z } from "zod";

export const eventParticipantStatusSchema = z.enum(["going", "interested", "not_going"]);

export const eventParticipantSchema = z.object({
  event_id: z.string().uuid(),
  resident_id: z.string().uuid(),
  status: eventParticipantStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type EventParticipant = z.infer<typeof eventParticipantSchema>;
