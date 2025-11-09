import { type Announcement as AnnouncementModel, announcementStatusSchema, announcementScopeSchema } from "../schemas/announcement.schema";
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
export declare function listAnnouncements(options: ListAnnouncementsOptions): Promise<{
    items: {
        id: string;
        estate_id: string;
        author_id: string;
        title: string;
        body: string;
        category: "awaria" | "zgubione" | "sprzedaż" | "ogólne";
        scope: "building" | "estate";
        status: "pending" | "approved" | "rejected";
        created_at: string;
        updated_at: string;
        building?: string | null | undefined;
        staircase?: string | null | undefined;
        published_at?: string | null | undefined;
        expires_at?: string | null | undefined;
    }[];
    nextCursor: any;
}>;
export declare function getAnnouncementById(id: string): Promise<Announcement | null>;
export declare function createAnnouncement(input: CreateAnnouncementInput): Promise<{
    id: string;
    estate_id: string;
    author_id: string;
    title: string;
    body: string;
    category: "awaria" | "zgubione" | "sprzedaż" | "ogólne";
    scope: "building" | "estate";
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
    building?: string | null | undefined;
    staircase?: string | null | undefined;
    published_at?: string | null | undefined;
    expires_at?: string | null | undefined;
}>;
export declare function updateAnnouncementStatus(input: UpdateAnnouncementStatusInput): Promise<{
    id: string;
    estate_id: string;
    author_id: string;
    title: string;
    body: string;
    category: "awaria" | "zgubione" | "sprzedaż" | "ogólne";
    scope: "building" | "estate";
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
    building?: string | null | undefined;
    staircase?: string | null | undefined;
    published_at?: string | null | undefined;
    expires_at?: string | null | undefined;
}>;
export {};
//# sourceMappingURL=announcement.service.d.ts.map