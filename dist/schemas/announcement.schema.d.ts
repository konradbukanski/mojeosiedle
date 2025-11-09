import { z } from "zod";
export declare const announcementCategorySchema: z.ZodEnum<{
    awaria: "awaria";
    zgubione: "zgubione";
    sprzedaż: "sprzedaż";
    ogólne: "ogólne";
}>;
export declare const announcementStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    rejected: "rejected";
}>;
export declare const announcementScopeSchema: z.ZodEnum<{
    building: "building";
    estate: "estate";
}>;
export declare const announcementSchema: z.ZodObject<{
    id: z.ZodString;
    estate_id: z.ZodString;
    author_id: z.ZodString;
    title: z.ZodString;
    body: z.ZodString;
    category: z.ZodEnum<{
        awaria: "awaria";
        zgubione: "zgubione";
        sprzedaż: "sprzedaż";
        ogólne: "ogólne";
    }>;
    scope: z.ZodEnum<{
        building: "building";
        estate: "estate";
    }>;
    building: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    staircase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
    }>;
    published_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expires_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const createAnnouncementSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        body: z.ZodString;
        category: z.ZodEnum<{
            awaria: "awaria";
            zgubione: "zgubione";
            sprzedaż: "sprzedaż";
            ogólne: "ogólne";
        }>;
        scope: z.ZodDefault<z.ZodEnum<{
            building: "building";
            estate: "estate";
        }>>;
        building: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        staircase: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        publishAt: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodString>;
        mediaIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateAnnouncementStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
        }>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const listAnnouncementsSchema: z.ZodObject<{
    query: z.ZodObject<{
        scope: z.ZodOptional<z.ZodEnum<{
            building: "building";
            estate: "estate";
        }>>;
        category: z.ZodOptional<z.ZodEnum<{
            awaria: "awaria";
            zgubione: "zgubione";
            sprzedaż: "sprzedaż";
            ogólne: "ogólne";
        }>>;
        building: z.ZodOptional<z.ZodString>;
        estateId: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
        includePending: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type Announcement = z.infer<typeof announcementSchema>;
//# sourceMappingURL=announcement.schema.d.ts.map