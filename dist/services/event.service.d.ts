import type { z } from "zod";
import { eventSchema, eventStatusSchema } from "../schemas/event.schema";
import { eventParticipantStatusSchema } from "../schemas/event-participant.schema";
type EventStatus = z.infer<typeof eventStatusSchema>;
type EventParticipantStatus = z.infer<typeof eventParticipantStatusSchema>;
type Event = z.infer<typeof eventSchema>;
interface ListEventsOptions {
    estateId: string;
    status?: EventStatus;
    includePending?: boolean;
    limit?: number;
    cursor?: string;
}
interface CreateEventInput {
    estateId: string;
    creatorId: string;
    title: string;
    description: string;
    location: string;
    startAt: string;
    endAt: string;
    capacity?: number;
    mediaIds?: string[];
}
interface RegisterForEventInput {
    eventId: string;
    residentId: string;
    status: EventParticipantStatus;
}
interface UpdateEventStatusInput {
    eventId: string;
    status: EventStatus;
    moderatorId: string;
}
export declare function listEvents(options: ListEventsOptions): Promise<{
    items: {
        id: string;
        estate_id: string;
        creator_id: string;
        title: string;
        description: string;
        location: string;
        start_at: string;
        end_at: string;
        status: "pending" | "approved" | "cancelled";
        created_at: string;
        updated_at: string;
        capacity?: number | null | undefined;
    }[];
    nextCursor: any;
}>;
export declare function getEventById(id: string): Promise<Event | null>;
export declare function createEvent(input: CreateEventInput): Promise<Event>;
export declare function updateEventStatus(input: UpdateEventStatusInput): Promise<Event>;
export declare function registerForEvent(input: RegisterForEventInput): Promise<{
    event_id: string;
    resident_id: string;
    status: "going" | "interested" | "not_going";
    created_at: string;
    updated_at: string;
}>;
export {};
//# sourceMappingURL=event.service.d.ts.map