import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: true,
  clean: true,
  tsconfig: "tsconfig.json",
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist/stg",
  minify: false,
  env: {
    AUTH_URL: "https://signon.stg.supertab.co/oauth2/auth",
    TOKEN_URL: "https://auth.stg.supetab.co/oauth2/token",
    SSO_BASE_URL: "https://signon.stg.supertab.co",
    TAPI_BASE_URL: "https://tapi.stg.supertab.co",
    CHECKOUT_BASE_URL: "https://checkout.stg.supertab.co",
  },
});
