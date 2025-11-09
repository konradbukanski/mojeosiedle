"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPushTokenSchema = exports.pushPlatformSchema = void 0;
const zod_1 = require("zod");
exports.pushPlatformSchema = zod_1.z.enum(["android", "ios", "web"]);
exports.registerPushTokenSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        token: zod_1.z.string().min(20),
        device: zod_1.z.string().max(120).optional(),
        platform: exports.pushPlatformSchema,
    })
        .strict(),
});
//# sourceMappingURL=push-token.schema.js.map