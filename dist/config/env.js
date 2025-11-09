"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const booleanSchema = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.string()])
    .transform((value) => {
    if (typeof value === "boolean") {
        return value;
    }
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
});
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    APP_ENV: zod_1.z.string().default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_ANON_KEY: zod_1.z.string(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string(),
    SUPABASE_JWT_SECRET: zod_1.z.string(),
    SUPABASE_STORAGE_BUCKET: zod_1.z.string().default("media"),
    FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().email().optional(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().optional(),
    MEDIA_MAX_FILE_SIZE_MB: zod_1.z.coerce.number().default(10),
    ENABLE_MODERATION_WORKFLOWS: booleanSchema.default(true),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment configuration", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
}
const env = parsed.data;
exports.env = env;
if (env.FIREBASE_PRIVATE_KEY) {
    env.FIREBASE_PRIVATE_KEY = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
}
//# sourceMappingURL=env.js.map