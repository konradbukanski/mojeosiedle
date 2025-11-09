"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaAssetSchema = exports.mediaAssetStatusSchema = void 0;
const zod_1 = require("zod");
const media_schema_1 = require("./media.schema");
exports.mediaAssetStatusSchema = zod_1.z.enum(["pending", "linked"]);
exports.mediaAssetSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    entity_type: media_schema_1.mediaEntityTypeSchema,
    entity_id: zod_1.z.string().uuid().nullish(),
    storage_path: zod_1.z.string(),
    file_name: zod_1.z.string(),
    file_type: zod_1.z.string(),
    file_size: zod_1.z.number(),
    uploader_id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    status: exports.mediaAssetStatusSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=media-asset.schema.js.map