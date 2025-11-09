import { z } from "zod";
export declare const eventParticipantStatusSchema: z.ZodEnum<{
    going: "going";
    interested: "interested";
    not_going: "not_going";
}>;
export declare const eventParticipantSchema: z.ZodObject<{
    event_id: z.ZodString;
    resident_id: z.ZodString;
    status: z.ZodEnum<{
        going: "going";
        interested: "interested";
        not_going: "not_going";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export type EventParticipant = z.infer<typeof eventParticipantSchema>;
//# sourceMappingURL=event-participant.schema.d.ts.map