import type { PostgrestError } from "@supabase/supabase-js";
interface SupabaseResponse<T> {
    data: T | null;
    error: PostgrestError | null;
}
export declare function unwrap<T>(response: SupabaseResponse<T>): T;
export declare function unwrapMaybe<T>(response: SupabaseResponse<T>): T | null;
export {};
//# sourceMappingURL=supabase.service.d.ts.map