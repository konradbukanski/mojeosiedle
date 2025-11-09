"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabasePublic = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
const supabaseOptions = {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
};
exports.supabaseAdmin = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY, supabaseOptions);
exports.supabasePublic = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_ANON_KEY, supabaseOptions);
//# sourceMappingURL=supabase.js.map