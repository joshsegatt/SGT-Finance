import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL"),
  TRUELAYER_CLIENT_ID: z.string().optional(),
  TRUELAYER_CLIENT_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([k, v]) => `  ${k}: ${v?.join(", ")}`)
      .join("\n");
    throw new Error(`❌ Invalid environment variables:\n${messages}`);
  }
  return parsed.data;
}

// Only validate on the server, once at module load
export const env = typeof window === "undefined" ? validateEnv() : ({} as ReturnType<typeof validateEnv>);
