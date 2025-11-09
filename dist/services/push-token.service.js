"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPushToken = registerPushToken;
exports.listEstatePushTokens = listEstatePushTokens;
exports.listTokensByResidentIds = listTokensByResidentIds;
const supabase_1 = require("../config/supabase");
const supabase_service_1 = require("./supabase.service");
const push_token_record_schema_1 = require("../schemas/push-token-record.schema");
async function registerPushToken(input) {
    const response = await supabase_1.supabaseAdmin
        .from("push_tokens")
        .upsert({
        resident_id: input.residentId,
        estate_id: input.estateId,
        fcm_token: input.token,
        platform: input.platform,
        device: input.device ?? null,
        last_used_at: new Date().toISOString(),
    }, {
        onConflict: "fcm_token",
    })
        .select("*")
        .single();
    return push_token_record_schema_1.pushTokenRecordSchema.parse((0, supabase_service_1.unwrap)(response));
}
async function listEstatePushTokens(estateId) {
    const response = await supabase_1.supabaseAdmin
        .from("push_tokens")
        .select("*")
        .eq("estate_id", estateId);
    const data = (0, supabase_service_1.unwrap)(response);
    return data.map((item) => push_token_record_schema_1.pushTokenRecordSchema.parse(item));
}
async function listTokensByResidentIds(residentIds) {
    if (residentIds.length === 0) {
        return [];
    }
    const response = await supabase_1.supabaseAdmin
        .from("push_tokens")
        .select("*")
        .in("resident_id", residentIds);
    const data = (0, supabase_service_1.unwrap)(response);
    return data.map((item) => push_token_record_schema_1.pushTokenRecordSchema.parse(item));
}
//# sourceMappingURL=push-token.service.js.map