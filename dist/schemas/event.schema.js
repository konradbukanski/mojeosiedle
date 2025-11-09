"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEventsSchema = exports.registerForEventSchema = exports.createEventSchema = exports.eventSchema = exports.eventStatusSchema = void 0;
const zod_1 = require("zod");
exports.eventStatusSchema = zod_1.z.enum(["pending", "approved", "cancelled"]);
exports.eventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    creator_id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    location: zod_1.z.string(),
    start_at: zod_1.z.string().datetime({ offset: true }),
    end_at: zod_1.z.string().datetime({ offset: true }),
    capacity: zod_1.z.number().int().nullish(),
    status: exports.eventStatusSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.createEventSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(120),
        description: zod_1.z.string().min(3),
        location: zod_1.z.string().min(1),
        startAt: zod_1.z.string().datetime(),
        endAt: zod_1.z.string().datetime(),
        capacity: zod_1.z.number().int().positive().optional(),
        mediaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    })
        .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
        message: "Event end time must be after start time",
        path: ["endAt"],
    }),
});
exports.registerForEventSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z
        .object({
        status: zod_1.z.enum(["going", "interested", "not_going"]).default("going"),
    })
        .strict(),
});
exports.listEventsSchema = zod_1.z.object({
    query: zod_1.z.object({
        estateId: zod_1.z.string().uuid().optional(),
        status: exports.eventStatusSchema.optional(),
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).optional(),
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
//# sourceMappingURL=event.schema.js.map