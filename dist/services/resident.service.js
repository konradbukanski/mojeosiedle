"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResidentByAuthId = getResidentByAuthId;
exports.getResidentById = getResidentById;
exports.createResident = createResident;
exports.updateResident = updateResident;
exports.ensureResident = ensureResident;
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const app_error_1 = require("../utils/app-error");
const resident_schema_1 = require("../schemas/resident.schema");
const supabase_service_1 = require("./supabase.service");
const insertResidentSchema = zod_1.z.object({
    auth_user_id: zod_1.z.string().uuid(),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    estate_id: zod_1.z.string().uuid(),
    building: zod_1.z.string().nullish(),
    staircase: zod_1.z.string().nullish(),
    floor: zod_1.z.string().nullish(),
    apartment: zod_1.z.string().nullish(),
    role: resident_schema_1.residentRoleSchema.default("resident"),
});
const updateResidentSchema = insertResidentSchema.partial().omit({ auth_user_id: true, estate_id: true, role: true });
async function getResidentByAuthId(authUserId) {
    const response = await supabase_1.supabaseAdmin
        .from("residents")
        .select("*")
        .eq("auth_user_id", authUserId)
        .maybeSingle();
    const data = (0, supabase_service_1.unwrapMaybe)(response);
    return data ? resident_schema_1.residentSchema.parse(data) : null;
}
async function getResidentById(id) {
    const response = await supabase_1.supabaseAdmin
        .from("residents")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    const data = (0, supabase_service_1.unwrapMaybe)(response);
    return data ? resident_schema_1.residentSchema.parse(data) : null;
}
async function createResident(input) {
    const payload = insertResidentSchema.parse(input);
    const response = await supabase_1.supabaseAdmin
        .from("residents")
        .insert(payload)
        .select("*")
        .single();
    return resident_schema_1.residentSchema.parse((0, supabase_service_1.unwrap)(response));
}
async function updateResident(id, input) {
    if (Object.keys(input).length === 0) {
        throw new app_error_1.AppError("No fields provided", 400);
    }
    const payload = updateResidentSchema.parse(input);
    const response = await supabase_1.supabaseAdmin
        .from("residents")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
    return resident_schema_1.residentSchema.parse((0, supabase_service_1.unwrap)(response));
}
async function ensureResident(authUserId) {
    const resident = await getResidentByAuthId(authUserId);
    if (!resident) {
        throw new app_error_1.AppError("Resident profile not found", 404);
    }
    return resident;
}
//# sourceMappingURL=resident.service.js.map