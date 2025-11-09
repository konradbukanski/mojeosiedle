"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEstates = listEstates;
const supabase_1 = require("../config/supabase");
const supabase_service_1 = require("./supabase.service");
async function listEstates() {
    const response = await supabase_1.supabaseAdmin
        .from("estates")
        .select("id, name, city, address")
        .order("name", { ascending: true });
    const data = (0, supabase_service_1.unwrap)(response);
    return data;
}
//# sourceMappingURL=estate.service.js.map