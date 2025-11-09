"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPresignedUrlSchema = exports.mediaEntityTypeSchema = void 0;
const zod_1 = require("zod");
exports.mediaEntityTypeSchema = zod_1.z.enum([
    "announcement",
    "event",
    "marketplace",
    "issue",
    "shop",
    "profile",
]);
exports.createPresignedUrlSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        fileName: zod_1.z.string().min(3).max(200),
        fileType: zod_1.z.string().min(3).max(120),
        fileSize: zod_1.z.number().int().positive(),
        entityType: exports.mediaEntityTypeSchema,
        entityId: zod_1.z.string().uuid().optional(),
    })
        .strict(),
});
//# sourceMappingURL=media.schema.js.map