import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import {
  announcementSchema,
  type Announcement as AnnouncementModel,
  announcementStatusSchema,
  announcementScopeSchema,
} from "../schemas/announcement.schema";
import { unwrap } from "./supabase.service";
import { attachMediaAssets } from "./media.service";
import type { z } from "zod";

type AnnouncementStatus = z.infer<typeof announcementStatusSchema>;
type AnnouncementScope = z.infer<typeof announcementScopeSchema>;

interface ListAnnouncementsOptions {
  estateId: string;
  scope?: AnnouncementScope;
  category?: Announcement["category"];
  building?: string;
  includePending?: boolean;
  limit?: number;
  cursor?: string;
}

type Announcement = AnnouncementModel;

interface CreateAnnouncementInput {
  estateId: string;
  authorId: string;
  title: string;
  body: string;
  category: Announcement["category"];
  scope: Announcement["scope"];
  building?: string | null;
  staircase?: string | null;
  publishAt?: string;
  expiresAt?: string;
  mediaIds?: string[];
}

interface UpdateAnnouncementStatusInput {
  announcementId: string;
  status: AnnouncementStatus;
  moderatorId: string;
  reason?: string;
}

export async function listAnnouncements(options: ListAnnouncementsOptions) {
  const limit = options.limit ?? 20;

  let query = supabaseAdmin
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
  const data = unwrap(response);

  const items = data.slice(0, limit).map((record) => announcementSchema.parse(record));
  const nextCursor = data.length > limit ? data[limit].created_at : null;

  return {
    items,
    nextCursor,
  };
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const response = await supabaseAdmin
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (!response.data) {
    return null;
  }

  return announcementSchema.parse(response.data);
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const payload = {
    estate_id: input.estateId,
    author_id: input.authorId,
    title: input.title,
    body: input.body,
    category: input.category,
    scope: input.scope,
    building: input.scope === "building" ? input.building ?? null : null,
    staircase: input.scope === "building" ? input.staircase ?? null : null,
    status: "pending" as const,
    published_at: input.publishAt ?? null,
    expires_at: input.expiresAt ?? null,
  };

  const response = await supabaseAdmin
    .from("announcements")
    .insert(payload)
    .select("*")
    .single();

  const announcement = announcementSchema.parse(unwrap(response));

  if (input.mediaIds?.length) {
    await attachMediaAssets(input.mediaIds, "announcement", announcement.id);
  }

  return announcement;
}

export async function updateAnnouncementStatus(input: UpdateAnnouncementStatusInput) {
  const { announcementId, status, reason, moderatorId } = input;

  const response = await supabaseAdmin
    .from("announcements")
    .update({ status, moderation_reason: reason ?? null, moderated_by: moderatorId })
    .eq("id", announcementId)
    .select("*")
    .single();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  return announcementSchema.parse(response.data);
}
