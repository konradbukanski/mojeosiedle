"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushTokenRecordSchema = void 0;
const zod_1 = require("zod");
const push_token_schema_1 = require("./push-token.schema");
exports.pushTokenRecordSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    resident_id: zod_1.z.string().uuid(),
    fcm_token: zod_1.z.string().min(10),
    device: zod_1.z.string().nullish(),
    platform: push_token_schema_1.pushPlatformSchema,
    last_used_at: zod_1.z.string().datetime({ offset: true }).nullish(),
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=push-token-record.schema.js.map