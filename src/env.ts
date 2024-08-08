import { z } from "zod";

const envSchema = z.object({
  AUTH_URL: z.string(),
  TOKEN_URL: z.string(),
  SSO_BASE_URL: z.string(),
  TAPI_BASE_URL: z.string(),
  CHECKOUT_BASE_URL: z.string(),
  SENTRY_DSN: z.string().optional(),
  PACKAGE_NAME: z.string().optional(),
  PACKAGE_VERSION: z.string().optional(),
});

export const {
  AUTH_URL,
  TOKEN_URL,
  SSO_BASE_URL,
  TAPI_BASE_URL,
  CHECKOUT_BASE_URL,
  SENTRY_DSN,
  PACKAGE_NAME,
  PACKAGE_VERSION,
} = envSchema.parse({
  AUTH_URL: process.env.AUTH_URL,
  TOKEN_URL: process.env.TOKEN_URL,
  SSO_BASE_URL: process.env.SSO_BASE_URL,
  TAPI_BASE_URL: process.env.TAPI_BASE_URL,
  CHECKOUT_BASE_URL: process.env.CHECKOUT_BASE_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  PACKAGE_NAME: process.env.PACKAGE_NAME,
  PACKAGE_VERSION: process.env.PACKAGE_VERSION,
});
