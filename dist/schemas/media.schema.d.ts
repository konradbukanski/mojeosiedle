import { z } from "zod";
export declare const mediaEntityTypeSchema: z.ZodEnum<{
    announcement: "announcement";
    event: "event";
    marketplace: "marketplace";
    issue: "issue";
    shop: "shop";
    profile: "profile";
}>;
export declare const createPresignedUrlSchema: z.ZodObject<{
    body: z.ZodObject<{
        fileName: z.ZodString;
        fileType: z.ZodString;
        fileSize: z.ZodNumber;
        entityType: z.ZodEnum<{
            announcement: "announcement";
            event: "event";
            marketplace: "marketplace";
            issue: "issue";
            shop: "shop";
            profile: "profile";
        }>;
        entityId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type MediaEntityType = z.infer<typeof mediaEntityTypeSchema>;
//# sourceMappingURL=media.schema.d.ts.map