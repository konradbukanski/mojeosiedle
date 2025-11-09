import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const booleanSchema = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  SUPABASE_STORAGE_BUCKET: z.string().default("media"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  MEDIA_MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  ENABLE_MODERATION_WORKFLOWS: booleanSchema.default(true),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

const env = parsed.data;

if (env.FIREBASE_PRIVATE_KEY) {
  env.FIREBASE_PRIVATE_KEY = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
}

export { env };

