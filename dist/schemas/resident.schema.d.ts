import { z } from "zod";
export declare const residentRoleSchema: z.ZodEnum<{
    resident: "resident";
    moderator: "moderator";
    admin: "admin";
}>;
export declare const residentSchema: z.ZodObject<{
    id: z.ZodString;
    auth_user_id: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    estate_id: z.ZodString;
    building: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    staircase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    floor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apartment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodEnum<{
        resident: "resident";
        moderator: "moderator";
        admin: "admin";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const updateResidentProfileSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        estateId: z.ZodOptional<z.ZodString>;
        building: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        staircase: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        floor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        apartment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateResidentLocationSchema: z.ZodObject<{
    body: z.ZodObject<{
        building: z.ZodString;
        staircase: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        floor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        apartment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export type Resident = z.infer<typeof residentSchema>;
export type ResidentRole = z.infer<typeof residentRoleSchema>;
//# sourceMappingURL=resident.schema.d.ts.map