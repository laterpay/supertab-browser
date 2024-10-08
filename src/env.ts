import { z } from "zod";

const envSchema = z.object({
  AUTH_URL: z.string(),
  TOKEN_URL: z.string(),
  SSO_BASE_URL: z.string(),
  TAPI_BASE_URL: z.string(),
  CHECKOUT_BASE_URL: z.string(),
});

export const {
  AUTH_URL,
  TOKEN_URL,
  SSO_BASE_URL,
  TAPI_BASE_URL,
  CHECKOUT_BASE_URL,
} = envSchema.parse({
  AUTH_URL: process.env.AUTH_URL,
  TOKEN_URL: process.env.TOKEN_URL,
  SSO_BASE_URL: process.env.SSO_BASE_URL,
  TAPI_BASE_URL: process.env.TAPI_BASE_URL,
  CHECKOUT_BASE_URL: process.env.CHECKOUT_BASE_URL,
});
