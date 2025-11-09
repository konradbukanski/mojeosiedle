import type { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { shopSchema, shopStatusSchema } from "../schemas/shop.schema";
import { unwrap } from "./supabase.service";

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

export async function listShops(options: ListShopsOptions) {
  let query = supabaseAdmin
    .from("shops")
    .select("*")
    .eq("estate_id", options.estateId)
    .order("name", { ascending: true });

  if (options.status) {
    query = query.eq("status", options.status);
  } else {
    query = query.eq("status", "approved");
  }

  const response = await query;
  const data = unwrap(response);
  return data.map((record) => shopSchema.parse(record));
}

export async function getShopById(id: string): Promise<Shop | null> {
  const response = await supabaseAdmin
    .from("shops")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (response.error) {
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (!response.data) {
    return null;
  }

  return shopSchema.parse(response.data);
}

export async function createShop(input: CreateShopInput): Promise<Shop> {
  const response = await supabaseAdmin
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

  const shop = unwrap(response);
  return shopSchema.parse(shop);
}

export async function updateShopStatus(input: UpdateShopStatusInput): Promise<Shop> {
  const response = await supabaseAdmin
    .from("shops")
    .update({ status: input.status })
    .eq("id", input.id)
    .select("*")
    .single();

  const shop = unwrap(response);
  return shopSchema.parse(shop);
}

