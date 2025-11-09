import { randomUUID } from "crypto";
import { supabaseAdmin } from "../config/supabase";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { mediaAssetSchema, type MediaAsset } from "../schemas/media-asset.schema";
import type { MediaEntityType } from "../schemas/media.schema";
import { unwrap, unwrapMaybe } from "./supabase.service";

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-");
}

interface CreatePresignedInput {
  fileName: string;
  fileType: string;
  fileSize: number;
  entityType: MediaEntityType;
  entityId?: string;
  uploaderId: string;
  estateId: string;
}

interface PresignedUploadResponse {
  asset: MediaAsset;
  signedUrl: string;
  uploadToken: string;
  path: string;
}

export async function createPresignedUploadUrl(input: CreatePresignedInput): Promise<PresignedUploadResponse> {
  const bucket = env.SUPABASE_STORAGE_BUCKET;
  const assetId = randomUUID();
  const sanitized = sanitizeFileName(input.fileName);
  const entityFolder = input.entityId ?? "pending";
  const path = `${input.entityType}/${entityFolder}/${assetId}-${sanitized}`;

  const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(path, { upsert: false });
  if (error || !data) {
    throw new AppError(error?.message ?? "Failed to create signed upload URL", 500, { details: error });
  }

  const insertResponse = await supabaseAdmin
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

  const asset = mediaAssetSchema.parse(unwrap(insertResponse));

  return {
    asset,
    signedUrl: data.signedUrl,
    uploadToken: data.token,
    path: data.path,
  };
}

export async function attachMediaAssets(assetIds: string[], entityType: string, entityId: string): Promise<MediaAsset[]> {
  if (assetIds.length === 0) {
    return [];
  }

  const response = await supabaseAdmin
    .from("media_assets")
    .update({ entity_id: entityId, status: "linked" })
    .in("id", assetIds)
    .eq("entity_type", entityType)
    .select("*");

  const data = unwrap(response);
  return data.map((item) => mediaAssetSchema.parse(item));
}

export async function listMediaForEntity(entityType: string, entityId: string): Promise<MediaAsset[]> {
  const response = await supabaseAdmin
    .from("media_assets")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  const data = unwrap(response);
  return data.map((item) => mediaAssetSchema.parse(item));
}

export async function getMediaAssetById(assetId: string): Promise<MediaAsset | null> {
  const response = await supabaseAdmin
    .from("media_assets")
    .select("*")
    .eq("id", assetId)
    .maybeSingle();

  const asset = unwrapMaybe(response);
  return asset ? mediaAssetSchema.parse(asset) : null;
}
