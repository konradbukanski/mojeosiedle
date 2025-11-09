"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopStatusSchema = exports.createShopSchema = exports.shopSchema = exports.shopStatusSchema = void 0;
const zod_1 = require("zod");
exports.shopStatusSchema = zod_1.z.enum(["pending", "approved", "hidden"]);
exports.shopSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    estate_id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullish(),
    category: zod_1.z.string(),
    phone: zod_1.z.string().nullish(),
    website: zod_1.z.string().url().nullish(),
    address: zod_1.z.string().nullish(),
    opening_hours: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).nullish(),
    status: exports.shopStatusSchema,
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
exports.createShopSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().min(2).max(120),
        description: zod_1.z.string().max(500).optional(),
        category: zod_1.z.string().min(2).max(60),
        phone: zod_1.z.string().max(32).optional(),
        website: zod_1.z.string().url().optional(),
        address: zod_1.z.string().max(160).optional(),
        openingHours: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    })
        .strict(),
});
exports.updateShopStatusSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z
        .object({
        status: exports.shopStatusSchema,
    })
        .strict(),
});
//# sourceMappingURL=shop.schema.js.map