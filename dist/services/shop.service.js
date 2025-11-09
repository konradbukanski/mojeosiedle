"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShops = listShops;
exports.getShopById = getShopById;
exports.createShop = createShop;
exports.updateShopStatus = updateShopStatus;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const shop_schema_1 = require("../schemas/shop.schema");
const supabase_service_1 = require("./supabase.service");
async function listShops(options) {
    let query = supabase_1.supabaseAdmin
        .from("shops")
        .select("*")
        .eq("estate_id", options.estateId)
        .order("name", { ascending: true });
    if (options.status) {
        query = query.eq("status", options.status);
    }
    else {
        query = query.eq("status", "approved");
    }
    const response = await query;
    const data = (0, supabase_service_1.unwrap)(response);
    return data.map((record) => shop_schema_1.shopSchema.parse(record));
}
async function getShopById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("shops")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (response.error) {
        throw new app_error_1.AppError(response.error.message, 500, { details: response.error });
    }
    if (!response.data) {
        return null;
    }
    return shop_schema_1.shopSchema.parse(response.data);
}
async function createShop(input) {
    const response = await supabase_1.supabaseAdmin
        .from("shops")
        .insert({
        estate_id: input.estateId,
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        phone: input.phone ?? null,
        website: input.website ?? null,
        address: input.address ?? null,
        opening_hours: input.openingHours ?? null,
        status: "pending",
    })
        .select("*")
        .single();
    const shop = (0, supabase_service_1.unwrap)(response);
    return shop_schema_1.shopSchema.parse(shop);
}
async function updateShopStatus(input) {
    const response = await supabase_1.supabaseAdmin
        .from("shops")
        .update({ status: input.status })
        .eq("id", input.id)
        .select("*")
        .single();
    const shop = (0, supabase_service_1.unwrap)(response);
    return shop_schema_1.shopSchema.parse(shop);
}
//# sourceMappingURL=shop.service.js.map