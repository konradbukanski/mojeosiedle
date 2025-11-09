import type { User } from "@supabase/supabase-js";
import { supabaseAdmin, supabasePublic } from "../config/supabase";
import { AppError } from "../utils/app-error";
import { createResident, ensureResident } from "./resident.service";
import type { RegisterRequest, LoginRequest } from "../schemas/auth.schema";
import { unwrapMaybe } from "./supabase.service";

async function resolveEstateId(explicitEstateId?: string): Promise<string> {
  if (explicitEstateId) {
    const estate = await supabaseAdmin
      .from("estates")
      .select("id")
      .eq("id", explicitEstateId)
      .maybeSingle();

    const data = unwrapMaybe(estate);
    if (!data) {
      throw new AppError("Wybrane osiedle nie istnieje", 400);
    }
    return data.id as string;
  }

  const defaultEstate = await supabaseAdmin
    .from("estates")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const estateData = unwrapMaybe(defaultEstate);
  if (!estateData) {
    throw new AppError("Brak skonfigurowanego osiedla. Dodaj osiedle w bazie.", 400);
  }

  return estateData.id as string;
}

export interface RegisterResult {
  user: User;
  residentId: string;
}

export async function registerResident(payload: RegisterRequest): Promise<RegisterResult> {
  const { email, password, firstName, lastName, estateId, building, staircase, floor, apartment } = payload;

  const createUserResponse = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createUserResponse.error || !createUserResponse.data?.user) {
    throw new AppError(createUserResponse.error?.message ?? "Unable to create user", 400, {
      details: createUserResponse.error,
    });
  }

  const authUser = createUserResponse.data.user;

  const resolvedEstateId = await resolveEstateId(estateId);
  const fallbackFirstName = firstName?.trim() || email.split("@")[0] || "Mieszkaniec";
  const fallbackLastName = lastName?.trim() || "Nowy";

  try {
    const resident = await createResident({
      auth_user_id: authUser.id,
      first_name: fallbackFirstName,
      last_name: fallbackLastName,
      estate_id: resolvedEstateId,
      role: "resident",
      building: building ?? null,
      staircase: staircase ?? null,
      floor: floor ?? null,
      apartment: apartment ?? null,
    });

    return { user: authUser, residentId: resident.id };
  } catch (error) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.id);
    throw error;
  }
}

export interface LoginResult {
  user: User;
  resident: Awaited<ReturnType<typeof ensureResident>>;
  accessToken: string;
  refreshToken?: string;
}

export async function loginResident(payload: LoginRequest): Promise<LoginResult> {
  const { email, password } = payload;

  const { data, error } = await supabasePublic.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    throw new AppError(error?.message ?? "Nieprawidłowe dane logowania", 401, { details: error });
  }

  const resident = await ensureResident(data.user.id);

  return {
    user: data.user,
    resident,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token ?? undefined,
  };
}
