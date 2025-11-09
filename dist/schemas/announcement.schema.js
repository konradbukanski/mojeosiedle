"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAnnouncementsSchema = exports.updateAnnouncementStatusSchema = exports.createAnnouncementSchema = exports.announcementSchema = exports.announcementScopeSchema = exports.announcementStatusSchema = exports.announcementCategorySchema = void 0;
const zod_1 = require("zod");
exports.announcementCategorySchema = zod_1.z.enum(["awaria", "zgubione", "sprzedaż", "ogólne"]);
exports.announcementStatusSchema = zod_1.z.enum(["pending", "approved", "rejected"]);
exports.announcementScopeSchema = zod_1.z.enum(["estate", "building"]);
exports.announcementSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    author_id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    body: zod_1.z.string(),
    category: exports.announcementCategorySchema,
    scope: exports.announcementScopeSchema,
    building: zod_1.z.string().nullish(),
    staircase: zod_1.z.string().nullish(),
    status: exports.announcementStatusSchema,
    published_at: zod_1.z.string().datetime({ offset: true }).nullish(),
    expires_at: zod_1.z.string().datetime({ offset: true }).nullish(),
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.createAnnouncementSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(120),
        body: zod_1.z.string().min(3),
        category: exports.announcementCategorySchema,
        scope: exports.announcementScopeSchema.default("estate"),
        building: zod_1.z.string().max(16).optional().nullable(),
        staircase: zod_1.z.string().max(8).optional().nullable(),
        publishAt: zod_1.z.string().datetime().optional(),
        expiresAt: zod_1.z.string().datetime().optional(),
        mediaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    })
        .superRefine((data, ctx) => {
        if (data.scope === "building" && !data.building) {
            ctx.addIssue({
                code: "custom",
                message: "Building must be provided when scope is building",
                path: ["building"],
            });
        }
    }),
});
exports.updateAnnouncementStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z
        .object({
        status: exports.announcementStatusSchema,
        reason: zod_1.z.string().max(280).optional(),
    })
        .strict(),
});
exports.listAnnouncementsSchema = zod_1.z.object({
    query: zod_1.z.object({
        scope: exports.announcementScopeSchema.optional(),
        category: exports.announcementCategorySchema.optional(),
        building: zod_1.z.string().optional(),
        estateId: zod_1.z.string().uuid().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).optional(),
        cursor: zod_1.z.string().optional(),
        includePending: zod_1.z
            .union([zod_1.z.boolean(), zod_1.z.string()])
            .optional()
            .transform((value) => {
            if (value === undefined)
                return false;
            if (typeof value === "boolean")
                return value;
            return ["true", "1", "yes"].includes(value.toLowerCase());
        }),
    }),
});
//# sourceMappingURL=announcement.schema.js.map