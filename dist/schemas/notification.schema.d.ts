import { z } from "zod";
export declare const sendNotificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"estate">;
            estateId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"residents">;
            residentIds: z.ZodArray<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"topic">;
            topic: z.ZodString;
        }, z.core.$strip>], "type">;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
//# sourceMappingURL=notification.schema.d.ts.map