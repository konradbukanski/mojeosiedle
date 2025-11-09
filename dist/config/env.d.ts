declare const env: {
    NODE_ENV: "development" | "test" | "production";
    APP_ENV: string;
    PORT: number;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_JWT_SECRET: string;
    SUPABASE_STORAGE_BUCKET: string;
    MEDIA_MAX_FILE_SIZE_MB: number;
    ENABLE_MODERATION_WORKFLOWS: boolean;
    FIREBASE_PROJECT_ID?: string | undefined;
    FIREBASE_CLIENT_EMAIL?: string | undefined;
    FIREBASE_PRIVATE_KEY?: string | undefined;
};
export { env };
//# sourceMappingURL=env.d.ts.map