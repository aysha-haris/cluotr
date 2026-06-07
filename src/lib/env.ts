import { z } from "zod";

const envSchema = z.object({
  ADMIN_PASSWORD: z.string().min(1).optional(),
  DATABASE_URL: z
    .string()
    .refine((v) => v.startsWith("postgresql://"), "DATABASE_URL must be a PostgreSQL connection string")
    .optional(),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .transform((url) => url.replace(/\/$/, ""))
    .default("https://cloutr.com"),
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
