import { z } from "zod";

const envSchema = z.object({
  AUTH_BASE_URL: z.string(),
  AUTH_URL: z.string().optional(),
  TOKEN_URL: z.string().optional(),
  SSO_BASE_URL: z.string(),
  TAPI_BASE_URL: z.string(),
  CHECKOUT_BASE_URL: z.string(),
});

export const {
  AUTH_BASE_URL,
  AUTH_URL,
  TOKEN_URL,
  SSO_BASE_URL,
  TAPI_BASE_URL,
  CHECKOUT_BASE_URL,
} = envSchema.parse({
  AUTH_BASE_URL: process.env.AUTH_BASE_URL,
  AUTH_URL: process.env.AUTH_URL ?? undefined,
  TOKEN_URL: process.env.TOKEN_URL ?? undefined,
  SSO_BASE_URL: process.env.SSO_BASE_URL,
  TAPI_BASE_URL: process.env.TAPI_BASE_URL,
  CHECKOUT_BASE_URL: process.env.CHECKOUT_BASE_URL,
});
