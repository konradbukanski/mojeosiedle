import type { User } from "@supabase/supabase-js";
import { ensureResident } from "./resident.service";
import type { RegisterRequest, LoginRequest } from "../schemas/auth.schema";
export interface RegisterResult {
    user: User;
    residentId: string;
}
export declare function registerResident(payload: RegisterRequest): Promise<RegisterResult>;
export interface LoginResult {
    user: User;
    resident: Awaited<ReturnType<typeof ensureResident>>;
    accessToken: string;
    refreshToken?: string;
}
export declare function loginResident(payload: LoginRequest): Promise<LoginResult>;
//# sourceMappingURL=auth.service.d.ts.map