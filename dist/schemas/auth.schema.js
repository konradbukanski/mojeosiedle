"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestSchema = exports.registerRequestSchema = void 0;
const zod_1 = require("zod");
exports.registerRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        firstName: zod_1.z.string().min(1).optional(),
        lastName: zod_1.z.string().min(1).optional(),
        estateId: zod_1.z.string().uuid().optional(),
        building: zod_1.z.string().max(16).optional().nullable(),
        staircase: zod_1.z.string().max(8).optional().nullable(),
        floor: zod_1.z.string().max(8).optional().nullable(),
        apartment: zod_1.z.string().max(8).optional().nullable(),
    })
        .strict(),
});
exports.loginRequestSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    })
        .strict(),
});
//# sourceMappingURL=auth.schema.js.map