import { z } from "zod";
import { type Resident } from "../schemas/resident.schema";
declare const insertResidentSchema: z.ZodObject<{
    auth_user_id: z.ZodString;
    first_name: z.ZodString;
    last_name: z.ZodString;
    estate_id: z.ZodString;
    building: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    staircase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    floor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    apartment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodDefault<z.ZodEnum<{
        resident: "resident";
        moderator: "moderator";
        admin: "admin";
    }>>;
}, z.core.$strip>;
declare const updateResidentSchema: z.ZodObject<{
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    staircase: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    floor: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    apartment: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
export type CreateResidentInput = z.infer<typeof insertResidentSchema>;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;
export declare function getResidentByAuthId(authUserId: string): Promise<Resident | null>;
export declare function getResidentById(id: string): Promise<Resident | null>;
export declare function createResident(input: CreateResidentInput): Promise<Resident>;
export declare function updateResident(id: string, input: UpdateResidentInput): Promise<Resident>;
export declare function ensureResident(authUserId: string): Promise<Resident>;
export {};
//# sourceMappingURL=resident.service.d.ts.map