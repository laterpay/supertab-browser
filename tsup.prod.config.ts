import { defineConfig } from "tsup";
import { name, version } from "./package.json";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: false,
  clean: true,
  tsconfig: "tsconfig.json",
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist/prod",
  minify: true,
  splitting: true,
  env: {
    AUTH_URL: "https://auth.laterpay.net/oauth2/auth",
    TOKEN_URL: "https://auth.laterpay.net/oauth2/token",
    SSO_BASE_URL: "https://signon.supertab.co",
    TAPI_BASE_URL: "https://tapi.laterpay.net",
    CHECKOUT_BASE_URL: "https://checkout.supertab.co",
    SENTRY_DSN:
      "https://52977a2775f03e0a17133cee24848baa@o23455.ingest.us.sentry.io/4507741231448064",
    PACKAGE_NAME: JSON.stringify(name),
    PACKAGE_VERSION: JSON.stringify(version),
  },
  noExternal: ["zod", "@laterpay/tapper-sdk", "@sentry/browser"],
});
