import { z } from "zod";
export declare const shopStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    hidden: "hidden";
}>;
export declare const shopSchema: z.ZodObject<{
    id: z.ZodString;
    estate_id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    opening_hours: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        hidden: "hidden";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const createShopSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        openingHours: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const updateShopStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            hidden: "hidden";
        }>;
    }, z.core.$strict>;
}, z.core.$strip>;
//# sourceMappingURL=shop.schema.d.ts.map