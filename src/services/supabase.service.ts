import type { PostgrestError } from "@supabase/supabase-js";
import { AppError } from "../utils/app-error";
import { logger } from "../utils/logger";

interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export function unwrap<T>(response: SupabaseResponse<T>): T {
  if (response.error) {
    logger.error({ err: response.error }, "Supabase query failed");
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  if (response.data === null) {
    throw new AppError("Supabase query returned no data", 404);
  }

  return response.data;
}

export function unwrapMaybe<T>(response: SupabaseResponse<T>): T | null {
  if (response.error) {
    logger.error({ err: response.error }, "Supabase query failed");
    throw new AppError(response.error.message, 500, { details: response.error });
  }

  return response.data;
}

