import type { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { eventSchema, eventStatusSchema } from "../schemas/event.schema";
import { eventParticipantSchema, eventParticipantStatusSchema } from "../schemas/event-participant.schema";
import { unwrap } from "./supabase.service";
import { attachMediaAssets } from "./media.service";

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

export async function listEvents(options: ListEventsOptions) {
  const limit = options.limit ?? 20;

  let query = supabaseAdmin
    .from("events")
    .select("*")
    .eq("estate_id", options.estateId)
    .order("start_at", { ascending: true })
    .limit(limit + 1);

  if (!options.includePending) {
    query = query.eq("status", "approved");
  }

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.cursor) {
    query = query.gt("start_at", options.cursor);
  }

  const response = await query;
  const data = unwrap(response);

  const items = data.slice(0, limit).map((record) => eventSchema.parse(record));
  const nextCursor = data.length > limit ? data[limit].start_at : null;

  return { items, nextCursor };
}

export async function getEventById(id: string): Promise<Event | null> {
  const response = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (!response.data) {
    return null;
  }

  return eventSchema.parse(response.data);
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const payload = {
    estate_id: input.estateId,
    creator_id: input.creatorId,
    title: input.title,
    description: input.description,
    location: input.location,
    start_at: input.startAt,
    end_at: input.endAt,
    capacity: input.capacity ?? null,
    status: "pending" as const,
  };

  const response = await supabaseAdmin
    .from("events")
    .insert(payload)
    .select("*")
    .single();

  const event = eventSchema.parse(unwrap(response));

  if (input.mediaIds?.length) {
    await attachMediaAssets(input.mediaIds, "event", event.id);
  }

  return event;
}

export async function updateEventStatus(input: UpdateEventStatusInput): Promise<Event> {
  const response = await supabaseAdmin
    .from("events")
    .update({ status: input.status, moderated_by: input.moderatorId })
    .eq("id", input.eventId)
    .select("*")
    .single();

  const event = unwrap(response);
  return eventSchema.parse(event);
}

export async function registerForEvent(input: RegisterForEventInput) {
  const { eventId, residentId, status } = input;

  const response = await supabaseAdmin
    .from("event_participants")
    .upsert({
      event_id: eventId,
      resident_id: residentId,
      status,
    })
    .select("*")
    .single();

  const participant = eventParticipantSchema.parse(unwrap(response));
  return participant;
}
