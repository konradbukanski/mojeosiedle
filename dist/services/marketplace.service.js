"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMarketplaceItems = listMarketplaceItems;
exports.getMarketplaceItemById = getMarketplaceItemById;
exports.createMarketplaceItem = createMarketplaceItem;
exports.updateMarketplaceStatus = updateMarketplaceStatus;
exports.updateMarketplaceItem = updateMarketplaceItem;
exports.deleteMarketplaceItem = deleteMarketplaceItem;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const marketplace_schema_1 = require("../schemas/marketplace.schema");
const supabase_service_1 = require("./supabase.service");
const media_service_1 = require("./media.service");
async function listMarketplaceItems(options) {
    const limit = options.limit ?? 20;
    let query = supabase_1.supabaseAdmin
        .from("marketplace_items")
        .select("*")
        .eq("estate_id", options.estateId)
        .order("created_at", { ascending: false })
        .limit(limit + 1);
    if (!options.includePending) {
        query = query.eq("status", "approved");
    }
    if (options.status) {
        query = query.eq("status", options.status);
    }
    if (options.category) {
        query = query.eq("category", options.category);
    }
    if (options.listingType) {
        query = query.eq("listing_type", options.listingType);
    }
    if (options.cursor) {
        query = query.lt("created_at", options.cursor);
    }
    if (options.sellerId) {
        query = query.eq("seller_id", options.sellerId);
    }
    const response = await query;
    const data = (0, supabase_service_1.unwrap)(response);
    const items = data.slice(0, limit).map((record) => marketplace_schema_1.marketplaceItemSchema.parse(record));
    const nextCursor = data.length > limit ? data[limit].created_at : null;
    return { items, nextCursor };
}
async function getMarketplaceItemById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("marketplace_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (!response.data) {
        return null;
    }
    return marketplace_schema_1.marketplaceItemSchema.parse(response.data);
}
async function createMarketplaceItem(input) {
    const payload = {
        estate_id: input.estateId,
        seller_id: input.sellerId,
        title: input.title,
        description: input.description,
        price: input.price ?? null,
        currency: input.currency,
        category: input.category,
        listing_type: input.listingType,
        status: "approved",
    };
    const response = await supabase_1.supabaseAdmin
        .from("marketplace_items")
        .insert(payload)
        .select("*")
        .maybeSingle();
    const itemRecord = (0, supabase_service_1.unwrapMaybe)(response);
    if (!itemRecord) {
        throw new app_error_1.AppError("Failed to create marketplace item", 500);
    }
    const parsedItem = marketplace_schema_1.marketplaceItemSchema.parse(itemRecord);
    if (input.mediaIds?.length) {
        await (0, media_service_1.attachMediaAssets)(input.mediaIds, "marketplace", parsedItem.id);
    }
    return parsedItem;
}
async function updateMarketplaceStatus(input) {
    const response = await supabase_1.supabaseAdmin
        .from("marketplace_items")
        .update({ status: input.status })
        .eq("id", input.id)
        .select("*")
        .single();
    const item = (0, supabase_service_1.unwrap)(response);
    return marketplace_schema_1.marketplaceItemSchema.parse(item);
}
async function updateMarketplaceItem(input) {
    const payload = {};
    if (input.title !== undefined)
        payload.title = input.title;
    if (input.description !== undefined)
        payload.description = input.description;
    if (input.price !== undefined)
        payload.price = input.price;
    if (input.currency !== undefined)
        payload.currency = input.currency;
    if (input.category !== undefined)
        payload.category = input.category;
    if (input.listingType !== undefined)
        payload.listing_type = input.listingType;
    if (input.status !== undefined)
        payload.status = input.status;
    const response = await supabase_1.supabaseAdmin
        .from("marketplace_items")
        .update(payload)
        .eq("id", input.id)
        .eq("seller_id", input.sellerId)
        .select("*")
        .single();
    const item = (0, supabase_service_1.unwrap)(response);
    const parsed = marketplace_schema_1.marketplaceItemSchema.parse(item);
    if (input.mediaIds?.length) {
        await (0, media_service_1.attachMediaAssets)(input.mediaIds, "marketplace", parsed.id);
    }
    return parsed;
}
async function deleteMarketplaceItem(id, sellerId) {
    const response = await supabase_1.supabaseAdmin
        .from("marketplace_items")
        .delete()
        .eq("id", id)
        .eq("seller_id", sellerId)
        .select("*")
        .single();
    return marketplace_schema_1.marketplaceItemSchema.parse((0, supabase_service_1.unwrap)(response));
}
//# sourceMappingURL=marketplace.service.js.map