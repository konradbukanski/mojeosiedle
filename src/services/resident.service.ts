import { z } from "zod";
import { supabaseAdmin } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { residentSchema, type Resident, residentRoleSchema } from "../schemas/resident.schema";
import { unwrap, unwrapMaybe } from "./supabase.service";

const insertResidentSchema = z.object({
  auth_user_id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  estate_id: z.string().uuid(),
  building: z.string().nullish(),
  staircase: z.string().nullish(),
  floor: z.string().nullish(),
  apartment: z.string().nullish(),
  role: residentRoleSchema.default("resident"),
});

const updateResidentSchema = insertResidentSchema.partial().omit({ auth_user_id: true, estate_id: true, role: true });

export type CreateResidentInput = z.infer<typeof insertResidentSchema>;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;

export async function getResidentByAuthId(authUserId: string): Promise<Resident | null> {
  const response = await supabaseAdmin
    .from("residents")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  const data = unwrapMaybe(response);
  return data ? residentSchema.parse(data) : null;
}

export async function getResidentById(id: string): Promise<Resident | null> {
  const response = await supabaseAdmin
    .from("residents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const data = unwrapMaybe(response);
  return data ? residentSchema.parse(data) : null;
}

export async function createResident(input: CreateResidentInput): Promise<Resident> {
  const payload = insertResidentSchema.parse(input);

  const response = await supabaseAdmin
    .from("residents")
    .insert(payload)
    .select("*")
    .single();

  return residentSchema.parse(unwrap(response));
}

export async function updateResident(id: string, input: UpdateResidentInput): Promise<Resident> {
  if (Object.keys(input).length === 0) {
    throw new AppError("No fields provided", 400);
  }

  const payload = updateResidentSchema.parse(input);

  const response = await supabaseAdmin
    .from("residents")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  return residentSchema.parse(unwrap(response));
}

export async function ensureResident(authUserId: string): Promise<Resident> {
  const resident = await getResidentByAuthId(authUserId);
  if (!resident) {
    throw new AppError("Resident profile not found", 404);
  }
  return resident;
}
