import { supabaseAdmin } from "../config/supabase";
import { unwrap } from "./supabase.service";
import { pushTokenRecordSchema, type PushTokenRecord } from "../schemas/push-token-record.schema";
import type { PushPlatform } from "../schemas/push-token.schema";

interface RegisterPushTokenInput {
  residentId: string;
  estateId: string;
  token: string;
  platform: PushPlatform;
  device?: string;
}

export async function registerPushToken(input: RegisterPushTokenInput): Promise<PushTokenRecord> {
  const response = await supabaseAdmin
    .from("push_tokens")
    .upsert(
      {
        resident_id: input.residentId,
        estate_id: input.estateId,
        fcm_token: input.token,
        platform: input.platform,
        device: input.device ?? null,
        last_used_at: new Date().toISOString(),
      },
      {
        onConflict: "fcm_token",
      }
    )
    .select("*")
    .single();

  return pushTokenRecordSchema.parse(unwrap(response));
}

export async function listEstatePushTokens(estateId: string): Promise<PushTokenRecord[]> {
  const response = await supabaseAdmin
    .from("push_tokens")
    .select("*")
    .eq("estate_id", estateId);

  const data = unwrap(response);
  return data.map((item) => pushTokenRecordSchema.parse(item));
}

export async function listTokensByResidentIds(residentIds: string[]): Promise<PushTokenRecord[]> {
  if (residentIds.length === 0) {
    return [];
  }

  const response = await supabaseAdmin
    .from("push_tokens")
    .select("*")
    .in("resident_id", residentIds);

  const data = unwrap(response);
  return data.map((item) => pushTokenRecordSchema.parse(item));
}
