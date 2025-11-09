import { z } from "zod";
export declare const eventStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    cancelled: "cancelled";
}>;
export declare const eventSchema: z.ZodObject<{
    id: z.ZodString;
    estate_id: z.ZodString;
    creator_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    start_at: z.ZodString;
    end_at: z.ZodString;
    capacity: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        cancelled: "cancelled";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const createEventSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        location: z.ZodString;
        startAt: z.ZodString;
        endAt: z.ZodString;
        capacity: z.ZodOptional<z.ZodNumber>;
        mediaIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const registerForEventSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodDefault<z.ZodEnum<{
            going: "going";
            interested: "interested";
            not_going: "not_going";
        }>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const listEventsSchema: z.ZodObject<{
    query: z.ZodObject<{
        estateId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            cancelled: "cancelled";
        }>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        includePending: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=event.schema.d.ts.map