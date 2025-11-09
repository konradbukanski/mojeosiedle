"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAnnouncements = listAnnouncements;
exports.getAnnouncementById = getAnnouncementById;
exports.createAnnouncement = createAnnouncement;
exports.updateAnnouncementStatus = updateAnnouncementStatus;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const announcement_schema_1 = require("../schemas/announcement.schema");
const supabase_service_1 = require("./supabase.service");
const media_service_1 = require("./media.service");
async function listAnnouncements(options) {
    const limit = options.limit ?? 20;
    let query = supabase_1.supabaseAdmin
        .from("announcements")
        .select("*")
        .eq("estate_id", options.estateId)
        .order("created_at", { ascending: false })
        .limit(limit + 1);
    if (!options.includePending) {
        query = query.eq("status", "approved");
    }
    if (options.scope) {
        query = query.eq("scope", options.scope);
    }
    if (options.category) {
        query = query.eq("category", options.category);
    }
    if (options.scope === "building" && options.building) {
        query = query.eq("building", options.building);
    }
    if (options.cursor) {
        query = query.lt("created_at", options.cursor);
    }
    const response = await query;
    const data = (0, supabase_service_1.unwrap)(response);
    const items = data.slice(0, limit).map((record) => announcement_schema_1.announcementSchema.parse(record));
    const nextCursor = data.length > limit ? data[limit].created_at : null;
    return {
        items,
        nextCursor,
    };
}
async function getAnnouncementById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("announcements")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (!response.data) {
        return null;
    }
    return announcement_schema_1.announcementSchema.parse(response.data);
}
async function createAnnouncement(input) {
    const payload = {
        estate_id: input.estateId,
        author_id: input.authorId,
        title: input.title,
        body: input.body,
        category: input.category,
        scope: input.scope,
        building: input.scope === "building" ? input.building ?? null : null,
        staircase: input.scope === "building" ? input.staircase ?? null : null,
        status: "pending",
        published_at: input.publishAt ?? null,
        expires_at: input.expiresAt ?? null,
    };
    const response = await supabase_1.supabaseAdmin
        .from("announcements")
        .insert(payload)
        .select("*")
        .single();
    const announcement = announcement_schema_1.announcementSchema.parse((0, supabase_service_1.unwrap)(response));
    if (input.mediaIds?.length) {
        await (0, media_service_1.attachMediaAssets)(input.mediaIds, "announcement", announcement.id);
    }
    return announcement;
}
async function updateAnnouncementStatus(input) {
    const { announcementId, status, reason, moderatorId } = input;
    const response = await supabase_1.supabaseAdmin
        .from("announcements")
        .update({ status, moderation_reason: reason ?? null, moderated_by: moderatorId })
        .eq("id", announcementId)
        .select("*")
        .single();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    return announcement_schema_1.announcementSchema.parse(response.data);
}
//# sourceMappingURL=announcement.service.js.map