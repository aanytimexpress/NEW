import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  ALLOW_IN_MEMORY_DB: z.string().default("auto"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  COOKIE_DOMAIN: z.string().default(""),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:3001"),
  ADMIN_IP_WHITELIST: z.string().default("127.0.0.1,::1"),
  CSRF_SECRET: z.string().min(1),
  TOTP_ISSUER: z.string().default("BoguraKothon"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  MAILCHIMP_API_KEY: z.string().optional().default(""),
  MAILCHIMP_AUDIENCE_ID: z.string().optional().default(""),
  MAILCHIMP_SERVER_PREFIX: z.string().optional().default("")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issueList = parsed.error.issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`
  );
  throw new Error(`Environment validation failed:\n${issueList.join("\n")}`);
}

export const env = {
  ...parsed.data,
  allowInMemoryDb:
    parsed.data.ALLOW_IN_MEMORY_DB === "true" ||
    (parsed.data.ALLOW_IN_MEMORY_DB === "auto" && parsed.data.NODE_ENV !== "production"),
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
  adminIpWhitelist: parsed.data.ADMIN_IP_WHITELIST.split(",").map((ip) => ip.trim())
};
