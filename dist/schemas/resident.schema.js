"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResidentLocationSchema = exports.updateResidentProfileSchema = exports.residentSchema = exports.residentRoleSchema = void 0;
const zod_1 = require("zod");
exports.residentRoleSchema = zod_1.z.enum(["resident", "moderator", "admin"]);
exports.residentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    auth_user_id: zod_1.z.string().uuid(),
    first_name: zod_1.z.string().min(1),
    last_name: zod_1.z.string().min(1),
    estate_id: zod_1.z.string().uuid(),
    building: zod_1.z.string().nullish(),
    staircase: zod_1.z.string().nullish(),
    floor: zod_1.z.string().nullish(),
    apartment: zod_1.z.string().nullish(),
    role: exports.residentRoleSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.updateResidentProfileSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        estateId: zod_1.z.string().uuid().optional(),
        building: zod_1.z.string().max(16).optional().nullable(),
        staircase: zod_1.z.string().max(8).optional().nullable(),
        floor: zod_1.z.string().max(8).optional().nullable(),
        apartment: zod_1.z.string().max(8).optional().nullable(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
        path: [],
    }),
});
exports.updateResidentLocationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        building: zod_1.z.string().max(16),
        staircase: zod_1.z.string().max(8).optional().nullable(),
        floor: zod_1.z.string().max(8).optional().nullable(),
        apartment: zod_1.z.string().max(8).optional().nullable(),
    })
        .strict(),
});
//# sourceMappingURL=resident.schema.js.map