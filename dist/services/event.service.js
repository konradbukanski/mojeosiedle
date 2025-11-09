"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
exports.getEventById = getEventById;
exports.createEvent = createEvent;
exports.updateEventStatus = updateEventStatus;
exports.registerForEvent = registerForEvent;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const event_schema_1 = require("../schemas/event.schema");
const event_participant_schema_1 = require("../schemas/event-participant.schema");
const supabase_service_1 = require("./supabase.service");
const media_service_1 = require("./media.service");
async function listEvents(options) {
    const limit = options.limit ?? 20;
    let query = supabase_1.supabaseAdmin
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
    const data = (0, supabase_service_1.unwrap)(response);
    const items = data.slice(0, limit).map((record) => event_schema_1.eventSchema.parse(record));
    const nextCursor = data.length > limit ? data[limit].start_at : null;
    return { items, nextCursor };
}
async function getEventById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (!response.data) {
        return null;
    }
    return event_schema_1.eventSchema.parse(response.data);
}
async function createEvent(input) {
    const payload = {
        estate_id: input.estateId,
        creator_id: input.creatorId,
        title: input.title,
        description: input.description,
        location: input.location,
        start_at: input.startAt,
        end_at: input.endAt,
        capacity: input.capacity ?? null,
        status: "pending",
    };
    const response = await supabase_1.supabaseAdmin
        .from("events")
        .insert(payload)
        .select("*")
        .single();
    const event = event_schema_1.eventSchema.parse((0, supabase_service_1.unwrap)(response));
    if (input.mediaIds?.length) {
        await (0, media_service_1.attachMediaAssets)(input.mediaIds, "event", event.id);
    }
    return event;
}
async function updateEventStatus(input) {
    const response = await supabase_1.supabaseAdmin
        .from("events")
        .update({ status: input.status, moderated_by: input.moderatorId })
        .eq("id", input.eventId)
        .select("*")
        .single();
    const event = (0, supabase_service_1.unwrap)(response);
    return event_schema_1.eventSchema.parse(event);
}
async function registerForEvent(input) {
    const { eventId, residentId, status } = input;
    const response = await supabase_1.supabaseAdmin
        .from("event_participants")
        .upsert({
        event_id: eventId,
        resident_id: residentId,
        status,
    })
        .select("*")
        .single();
    const participant = event_participant_schema_1.eventParticipantSchema.parse((0, supabase_service_1.unwrap)(response));
    return participant;
}
//# sourceMappingURL=event.service.js.map