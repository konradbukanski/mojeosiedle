import type { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { marketplaceItemSchema, marketplaceStatusSchema, marketplaceListingTypeSchema } from "../schemas/marketplace.schema";
import { unwrap, unwrapMaybe } from "./supabase.service";
import { attachMediaAssets } from "./media.service";

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

export async function listMarketplaceItems(options: ListMarketplaceOptions) {
  const limit = options.limit ?? 20;

  let query = supabaseAdmin
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
  const data = unwrap(response);

  const items = data.slice(0, limit).map((record) => marketplaceItemSchema.parse(record));
  const nextCursor = data.length > limit ? data[limit].created_at : null;

  return { items, nextCursor };
}

export async function getMarketplaceItemById(id: string): Promise<MarketplaceItem | null> {
  const response = await supabaseAdmin
    .from("marketplace_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (!response.data) {
    return null;
  }

  return marketplaceItemSchema.parse(response.data);
}

export async function createMarketplaceItem(input: CreateMarketplaceItemInput) {
  const payload = {
    estate_id: input.estateId,
    seller_id: input.sellerId,
    title: input.title,
    description: input.description,
    price: input.price ?? null,
    currency: input.currency,
    category: input.category,
    listing_type: input.listingType,
    status: "approved" as const,
  };

  const response = await supabaseAdmin
    .from("marketplace_items")
    .insert(payload)
    .select("*")
    .maybeSingle();

  const itemRecord = unwrapMaybe(response);
  if (!itemRecord) {
    throw new AppError("Failed to create marketplace item", 500);
  }

  const parsedItem = marketplaceItemSchema.parse(itemRecord);

  if (input.mediaIds?.length) {
    await attachMediaAssets(input.mediaIds, "marketplace", parsedItem.id);
  }

  return parsedItem;
}

export async function updateMarketplaceStatus(input: UpdateMarketplaceStatusInput) {
  const response = await supabaseAdmin
    .from("marketplace_items")
    .update({ status: input.status })
    .eq("id", input.id)
    .select("*")
    .single();

  const item = unwrap(response);
  return marketplaceItemSchema.parse(item);
}

export async function updateMarketplaceItem(input: UpdateMarketplaceItemInput) {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.price !== undefined) payload.price = input.price;
  if (input.currency !== undefined) payload.currency = input.currency;
  if (input.category !== undefined) payload.category = input.category;
  if (input.listingType !== undefined) payload.listing_type = input.listingType;
  if (input.status !== undefined) payload.status = input.status;

  const response = await supabaseAdmin
    .from("marketplace_items")
    .update(payload)
    .eq("id", input.id)
    .eq("seller_id", input.sellerId)
    .select("*")
    .single();

  const item = unwrap(response);
  const parsed = marketplaceItemSchema.parse(item);

  if (input.mediaIds?.length) {
    await attachMediaAssets(input.mediaIds, "marketplace", parsed.id);
  }

  return parsed;
}

export async function deleteMarketplaceItem(id: string, sellerId: string) {
  const response = await supabaseAdmin
    .from("marketplace_items")
    .delete()
    .eq("id", id)
    .eq("seller_id", sellerId)
    .select("*")
    .single();

  return marketplaceItemSchema.parse(unwrap(response));
}
