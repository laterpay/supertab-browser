import { defineConfig } from "tsup";

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
    AUTH_URL: "https://signon.supertab.co/oauth2/auth",
    TOKEN_URL: "https://auth.supertab.co/oauth2/token",
    SSO_BASE_URL: "https://signon.supertab.co",
    TAPI_BASE_URL: "https://tapi.supertab.co",
    CHECKOUT_BASE_URL: "https://checkout.supertab.co",
  },
  noExternal: ["zod", "@getsupertab/tapper-sdk"],
});
