"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResident = registerResident;
exports.loginResident = loginResident;
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const resident_service_1 = require("./resident.service");
const supabase_service_1 = require("./supabase.service");
async function resolveEstateId(explicitEstateId) {
    if (explicitEstateId) {
        const estate = await supabase_1.supabaseAdmin
            .from("estates")
            .select("id")
            .eq("id", explicitEstateId)
            .maybeSingle();
        const data = (0, supabase_service_1.unwrapMaybe)(estate);
        if (!data) {
            throw new app_error_1.AppError("Wybrane osiedle nie istnieje", 400);
        }
        return data.id;
    }
    const defaultEstate = await supabase_1.supabaseAdmin
        .from("estates")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
    const estateData = (0, supabase_service_1.unwrapMaybe)(defaultEstate);
    if (!estateData) {
        throw new app_error_1.AppError("Brak skonfigurowanego osiedla. Dodaj osiedle w bazie.", 400);
    }
    return estateData.id;
}
async function registerResident(payload) {
    const { email, password, firstName, lastName, estateId, building, staircase, floor, apartment } = payload;
    const createUserResponse = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (createUserResponse.error || !createUserResponse.data?.user) {
        throw new app_error_1.AppError(createUserResponse.error?.message ?? "Unable to create user", 400, {
            details: createUserResponse.error,
        });
    }
    const authUser = createUserResponse.data.user;
    const resolvedEstateId = await resolveEstateId(estateId);
    const fallbackFirstName = firstName?.trim() || email.split("@")[0] || "Mieszkaniec";
    const fallbackLastName = lastName?.trim() || "Nowy";
    try {
        const resident = await (0, resident_service_1.createResident)({
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
    }
    catch (error) {
        await supabase_1.supabaseAdmin.auth.admin.deleteUser(authUser.id);
        throw error;
    }
}
async function loginResident(payload) {
    const { email, password } = payload;
    const { data, error } = await supabase_1.supabasePublic.auth.signInWithPassword({
        email,
        password,
    });
    if (error || !data.session || !data.user) {
        throw new app_error_1.AppError(error?.message ?? "Nieprawidłowe dane logowania", 401, { details: error });
    }
    const resident = await (0, resident_service_1.ensureResident)(data.user.id);
    return {
        user: data.user,
        resident,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? undefined,
    };
}
//# sourceMappingURL=auth.service.js.map