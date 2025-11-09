"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPresignedUploadUrl = createPresignedUploadUrl;
exports.attachMediaAssets = attachMediaAssets;
exports.listMediaForEntity = listMediaForEntity;
exports.getMediaAssetById = getMediaAssetById;
const crypto_1 = require("crypto");
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
const app_error_1 = require("../utils/app-error");
const media_asset_schema_1 = require("../schemas/media-asset.schema");
const supabase_service_1 = require("./supabase.service");
function sanitizeFileName(name) {
    return name.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-");
}
async function createPresignedUploadUrl(input) {
    const bucket = env_1.env.SUPABASE_STORAGE_BUCKET;
    const assetId = (0, crypto_1.randomUUID)();
    const sanitized = sanitizeFileName(input.fileName);
    const entityFolder = input.entityId ?? "pending";
    const path = `${input.entityType}/${entityFolder}/${assetId}-${sanitized}`;
    const { data, error } = await supabase_1.supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path, { upsert: false });
    if (error || !data) {
        throw new app_error_1.AppError(error?.message ?? "Failed to create signed upload URL", 500, { details: error });
    }
    const insertResponse = await supabase_1.supabaseAdmin
        .from("media_assets")
        .insert({
        id: assetId,
        entity_type: input.entityType,
        entity_id: input.entityId ?? null,
        storage_path: path,
        file_name: input.fileName,
        file_type: input.fileType,
        file_size: input.fileSize,
        uploader_id: input.uploaderId,
        estate_id: input.estateId,
        status: input.entityId ? "linked" : "pending",
    })
        .select("*")
        .single();
    const asset = media_asset_schema_1.mediaAssetSchema.parse((0, supabase_service_1.unwrap)(insertResponse));
    return {
        asset,
        signedUrl: data.signedUrl,
        uploadToken: data.token,
        path: data.path,
    };
}
async function attachMediaAssets(assetIds, entityType, entityId) {
    if (assetIds.length === 0) {
        return [];
    }
    const response = await supabase_1.supabaseAdmin
        .from("media_assets")
        .update({ entity_id: entityId, status: "linked" })
        .in("id", assetIds)
        .eq("entity_type", entityType)
        .select("*");
    const data = (0, supabase_service_1.unwrap)(response);
    return data.map((item) => media_asset_schema_1.mediaAssetSchema.parse(item));
}
async function listMediaForEntity(entityType, entityId) {
    const response = await supabase_1.supabaseAdmin
        .from("media_assets")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId);
    const data = (0, supabase_service_1.unwrap)(response);
    return data.map((item) => media_asset_schema_1.mediaAssetSchema.parse(item));
}
async function getMediaAssetById(assetId) {
    const response = await supabase_1.supabaseAdmin
        .from("media_assets")
        .select("*")
        .eq("id", assetId)
        .maybeSingle();
    const asset = (0, supabase_service_1.unwrapMaybe)(response);
    return asset ? media_asset_schema_1.mediaAssetSchema.parse(asset) : null;
}
//# sourceMappingURL=media.service.js.map