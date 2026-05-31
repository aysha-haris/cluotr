import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql://", "DATABASE_URL must be a PostgreSQL connection string"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .transform((url) => url.replace(/\/$/, "")),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_GSC_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_PINTEREST_TAG_ID: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment variables:\n${formatted}`);
  }

  return parsed.data;
}

export const env = validateEnv();
