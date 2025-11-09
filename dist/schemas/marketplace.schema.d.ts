import { z } from "zod";
export declare const marketplaceStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    rejected: "rejected";
    sold: "sold";
}>;
export declare const marketplaceCategorySchema: z.ZodEnum<{
    electronics: "electronics";
    home: "home";
    services: "services";
    other: "other";
}>;
export declare const marketplaceListingTypeSchema: z.ZodEnum<{
    offer: "offer";
    request: "request";
}>;
export declare const marketplaceItemSchema: z.ZodObject<{
    id: z.ZodString;
    estate_id: z.ZodString;
    seller_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodString;
    category: z.ZodEnum<{
        electronics: "electronics";
        home: "home";
        services: "services";
        other: "other";
    }>;
    listing_type: z.ZodEnum<{
        offer: "offer";
        request: "request";
    }>;
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
        sold: "sold";
    }>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export declare const createMarketplaceItemSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        price: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        category: z.ZodDefault<z.ZodEnum<{
            electronics: "electronics";
            home: "home";
            services: "services";
            other: "other";
        }>>;
        listingType: z.ZodDefault<z.ZodEnum<{
            offer: "offer";
            request: "request";
        }>>;
        mediaIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const updateMarketplaceStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
            sold: "sold";
        }>;
    }, z.core.$strict>;
}, z.core.$strip>;
export declare const listMarketplaceItemsSchema: z.ZodObject<{
    query: z.ZodObject<{
        estateId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
            sold: "sold";
        }>>;
        category: z.ZodOptional<z.ZodEnum<{
            electronics: "electronics";
            home: "home";
            services: "services";
            other: "other";
        }>>;
        listingType: z.ZodOptional<z.ZodEnum<{
            offer: "offer";
            request: "request";
        }>>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        includePending: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type MarketplaceItem = z.infer<typeof marketplaceItemSchema>;
export type MarketplaceStatus = z.infer<typeof marketplaceStatusSchema>;
export type MarketplaceCategory = z.infer<typeof marketplaceCategorySchema>;
export type MarketplaceListingType = z.infer<typeof marketplaceListingTypeSchema>;
export declare const updateMarketplaceItemSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        currency: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<{
            electronics: "electronics";
            home: "home";
            services: "services";
            other: "other";
        }>>;
        listingType: z.ZodOptional<z.ZodEnum<{
            offer: "offer";
            request: "request";
        }>>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            approved: "approved";
            rejected: "rejected";
            sold: "sold";
        }>>;
        mediaIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=marketplace.schema.d.ts.map