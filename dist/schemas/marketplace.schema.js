"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarketplaceItemSchema = exports.listMarketplaceItemsSchema = exports.updateMarketplaceStatusSchema = exports.createMarketplaceItemSchema = exports.marketplaceItemSchema = exports.marketplaceListingTypeSchema = exports.marketplaceCategorySchema = exports.marketplaceStatusSchema = void 0;
const zod_1 = require("zod");
exports.marketplaceStatusSchema = zod_1.z.enum(["pending", "approved", "sold", "rejected"]);
exports.marketplaceCategorySchema = zod_1.z.enum(["electronics", "home", "services", "other"]);
exports.marketplaceListingTypeSchema = zod_1.z.enum(["offer", "request"]);
exports.marketplaceItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    seller_id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number().nullish(),
    currency: zod_1.z.string(),
    category: exports.marketplaceCategorySchema,
    listing_type: exports.marketplaceListingTypeSchema,
    status: exports.marketplaceStatusSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.createMarketplaceItemSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(120),
        description: zod_1.z.string().min(3),
        price: zod_1.z.number().positive().optional(),
        currency: zod_1.z.string().length(3).default("PLN"),
        category: exports.marketplaceCategorySchema.default("other"),
        listingType: exports.marketplaceListingTypeSchema.default("offer"),
        mediaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    })
        .strict(),
});
exports.updateMarketplaceStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z
        .object({
        status: exports.marketplaceStatusSchema,
    })
        .strict(),
});
exports.listMarketplaceItemsSchema = zod_1.z.object({
    query: zod_1.z.object({
        estateId: zod_1.z.string().uuid().optional(),
        status: exports.marketplaceStatusSchema.optional(),
        category: exports.marketplaceCategorySchema.optional(),
        listingType: exports.marketplaceListingTypeSchema.optional(),
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).optional(),
        includePending: zod_1.z
            .union([zod_1.z.boolean(), zod_1.z.string()])
            .optional()
            .transform((value) => {
            if (value === undefined)
                return false;
            if (typeof value === "boolean")
                return value;
            return ["true", "1", "yes"].includes(value.toLowerCase());
        }),
    }),
});
exports.updateMarketplaceItemSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(3).max(120).optional(),
        description: zod_1.z.string().min(3).optional(),
        price: zod_1.z.number().positive().nullable().optional(),
        currency: zod_1.z.string().length(3).optional(),
        category: exports.marketplaceCategorySchema.optional(),
        listingType: exports.marketplaceListingTypeSchema.optional(),
        status: exports.marketplaceStatusSchema.optional(),
        mediaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    })
        .refine((values) => Object.keys(values).length > 0, {
        message: "At least one field must be provided",
    }),
});
//# sourceMappingURL=marketplace.schema.js.map