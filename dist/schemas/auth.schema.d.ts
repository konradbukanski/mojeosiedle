import { z } from "zod";
export declare const registerRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        estateId: z.ZodOptional<z.ZodString>;
        building: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        staircase: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        floor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        apartment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const loginRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>["body"];
export type LoginRequest = z.infer<typeof loginRequestSchema>["body"];
//# sourceMappingURL=auth.schema.d.ts.map