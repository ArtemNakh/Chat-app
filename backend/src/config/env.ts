import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  /** PostgreSQL connection string (Supabase). */
  DATABASE_URL: z.url({ protocol: /^(postgresql|postgres)$/ }),

  /** Comma-separated list of allowed origins for CORS. */
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((val) => val.split(",").map((origin) => origin.trim())),

  /** Secret used to sign and verify JSON Web Tokens. */
  JWT_SECRET: z.string().min(32, {
    error: "JWT_SECRET must be at least 32 characters for security",
  }),

  /** JWT expiry duration (e.g. "7d", "24h"). */
  JWT_EXPIRES_IN: z.string().default("7d"),

  /**
   * Number of reverse proxies to trust for X-Forwarded-For.
   * Set to 0 to disable proxy trust; 1 for a single proxy (e.g. nginx).
   */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),

  /**
   * Disables every rate limiter. Only for load testing from a single IP,
   * where the per-IP limits would otherwise throttle the measurement itself.
   */
  RATE_LIMIT_DISABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
});

function validateEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse({ ...process.env });
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => ` * ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `[config/env] Invalid environment variables:\n ${formatted}\n\n` +
        "Check your .env file against .env.example",
    );
  }
  return result.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
