import { type MediaAsset } from "../schemas/media-asset.schema";
import type { MediaEntityType } from "../schemas/media.schema";
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
export declare function createPresignedUploadUrl(input: CreatePresignedInput): Promise<PresignedUploadResponse>;
export declare function attachMediaAssets(assetIds: string[], entityType: string, entityId: string): Promise<MediaAsset[]>;
export declare function listMediaForEntity(entityType: string, entityId: string): Promise<MediaAsset[]>;
export declare function getMediaAssetById(assetId: string): Promise<MediaAsset | null>;
export {};
//# sourceMappingURL=media.service.d.ts.map