import { supabaseAdmin } from "../config/supabase";
import { unwrap } from "./supabase.service";

interface EstateRecord {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
}

export async function listEstates(): Promise<EstateRecord[]> {
  const response = await supabaseAdmin
    .from("estates")
    .select("id, name, city, address")
    .order("name", { ascending: true });

  const data = unwrap(response);
  return data as EstateRecord[];
}

