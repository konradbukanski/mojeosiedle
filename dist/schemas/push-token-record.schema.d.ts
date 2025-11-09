import { z } from "zod";
export declare const pushTokenRecordSchema: z.ZodObject<{
    id: z.ZodString;
    resident_id: z.ZodString;
    fcm_token: z.ZodString;
    device: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    platform: z.ZodEnum<{
        android: "android";
        ios: "ios";
        web: "web";
    }>;
    last_used_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export type PushTokenRecord = z.infer<typeof pushTokenRecordSchema>;
//# sourceMappingURL=push-token-record.schema.d.ts.map