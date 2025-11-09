import type { z } from "zod";
import { marketplaceItemSchema, marketplaceStatusSchema, marketplaceListingTypeSchema } from "../schemas/marketplace.schema";
type MarketplaceStatus = z.infer<typeof marketplaceStatusSchema>;
type MarketplaceItem = z.infer<typeof marketplaceItemSchema>;
type MarketplaceListingType = z.infer<typeof marketplaceListingTypeSchema>;
interface ListMarketplaceOptions {
    estateId: string;
    status?: MarketplaceStatus;
    category?: MarketplaceItem["category"];
    listingType?: MarketplaceListingType;
    includePending?: boolean;
    cursor?: string;
    limit?: number;
    sellerId?: string;
}
interface CreateMarketplaceItemInput {
    estateId: string;
    sellerId: string;
    title: string;
    description: string;
    price?: number | null;
    currency: string;
    category: MarketplaceItem["category"];
    listingType: MarketplaceListingType;
    mediaIds?: string[];
}
interface UpdateMarketplaceStatusInput {
    id: string;
    status: MarketplaceStatus;
}
interface UpdateMarketplaceItemInput {
    id: string;
    sellerId: string;
    title?: string;
    description?: string;
    price?: number | null;
    currency?: string;
    category?: MarketplaceItem["category"];
    listingType?: MarketplaceListingType;
    status?: MarketplaceStatus;
    mediaIds?: string[];
}
export declare function listMarketplaceItems(options: ListMarketplaceOptions): Promise<{
    items: {
        id: string;
        estate_id: string;
        seller_id: string;
        title: string;
        description: string;
        currency: string;
        category: "electronics" | "home" | "services" | "other";
        listing_type: "offer" | "request";
        status: "pending" | "approved" | "rejected" | "sold";
        created_at: string;
        updated_at: string;
        price?: number | null | undefined;
    }[];
    nextCursor: any;
}>;
export declare function getMarketplaceItemById(id: string): Promise<MarketplaceItem | null>;
export declare function createMarketplaceItem(input: CreateMarketplaceItemInput): Promise<{
    id: string;
    estate_id: string;
    seller_id: string;
    title: string;
    description: string;
    currency: string;
    category: "electronics" | "home" | "services" | "other";
    listing_type: "offer" | "request";
    status: "pending" | "approved" | "rejected" | "sold";
    created_at: string;
    updated_at: string;
    price?: number | null | undefined;
}>;
export declare function updateMarketplaceStatus(input: UpdateMarketplaceStatusInput): Promise<{
    id: string;
    estate_id: string;
    seller_id: string;
    title: string;
    description: string;
    currency: string;
    category: "electronics" | "home" | "services" | "other";
    listing_type: "offer" | "request";
    status: "pending" | "approved" | "rejected" | "sold";
    created_at: string;
    updated_at: string;
    price?: number | null | undefined;
}>;
export declare function updateMarketplaceItem(input: UpdateMarketplaceItemInput): Promise<{
    id: string;
    estate_id: string;
    seller_id: string;
    title: string;
    description: string;
    currency: string;
    category: "electronics" | "home" | "services" | "other";
    listing_type: "offer" | "request";
    status: "pending" | "approved" | "rejected" | "sold";
    created_at: string;
    updated_at: string;
    price?: number | null | undefined;
}>;
export declare function deleteMarketplaceItem(id: string, sellerId: string): Promise<{
    id: string;
    estate_id: string;
    seller_id: string;
    title: string;
    description: string;
    currency: string;
    category: "electronics" | "home" | "services" | "other";
    listing_type: "offer" | "request";
    status: "pending" | "approved" | "rejected" | "sold";
    created_at: string;
    updated_at: string;
    price?: number | null | undefined;
}>;
export {};
//# sourceMappingURL=marketplace.service.d.ts.map