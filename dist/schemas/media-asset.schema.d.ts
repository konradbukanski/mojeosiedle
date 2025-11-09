import { z } from "zod";
export declare const mediaAssetStatusSchema: z.ZodEnum<{
    pending: "pending";
    linked: "linked";
}>;
export declare const mediaAssetSchema: z.ZodObject<{
    id: z.ZodString;
    entity_type: z.ZodEnum<{
        announcement: "announcement";
        event: "event";
        marketplace: "marketplace";
        issue: "issue";
        shop: "shop";
        profile: "profile";
    }>;
    entity_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    storage_path: z.ZodString;
    file_name: z.ZodString;
    file_type: z.ZodString;
    file_size: z.ZodNumber;
    uploader_id: z.ZodString;
    estate_id: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        linked: "linked";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
//# sourceMappingURL=media-asset.schema.d.ts.map