import type { z } from "zod";
import { shopSchema, shopStatusSchema } from "../schemas/shop.schema";
export type Shop = z.infer<typeof shopSchema>;
export type ShopStatus = z.infer<typeof shopStatusSchema>;
interface ListShopsOptions {
    estateId: string;
    status?: ShopStatus;
}
interface CreateShopInput {
    estateId: string;
    name: string;
    description?: string;
    category: string;
    phone?: string;
    website?: string;
    address?: string;
    openingHours?: Record<string, string>;
}
interface UpdateShopStatusInput {
    id: string;
    status: ShopStatus;
}
export declare function listShops(options: ListShopsOptions): Promise<{
    id: string;
    estate_id: string;
    name: string;
    category: string;
    status: "pending" | "approved" | "hidden";
    created_at: string;
    updated_at: string;
    description?: string | null | undefined;
    phone?: string | null | undefined;
    website?: string | null | undefined;
    address?: string | null | undefined;
    opening_hours?: Record<string, string> | null | undefined;
}[]>;
export declare function getShopById(id: string): Promise<Shop | null>;
export declare function createShop(input: CreateShopInput): Promise<Shop>;
export declare function updateShopStatus(input: UpdateShopStatusInput): Promise<Shop>;
export {};
//# sourceMappingURL=shop.service.d.ts.map