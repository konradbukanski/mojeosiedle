import { z } from "zod";
export declare const pushPlatformSchema: z.ZodEnum<{
    android: "android";
    ios: "ios";
    web: "web";
}>;
export declare const registerPushTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        device: z.ZodOptional<z.ZodString>;
        platform: z.ZodEnum<{
            android: "android";
            ios: "ios";
            web: "web";
        }>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type PushPlatform = z.infer<typeof pushPlatformSchema>;
//# sourceMappingURL=push-token.schema.d.ts.map