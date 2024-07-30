import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: true,
  clean: true,
  tsconfig: "tsconfig.json",
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist/sbx",
  minify: false,
  env: {
    AUTH_URL: "https://auth.sbx.laterpay.net/oauth2/auth",
    TOKEN_URL: "https://auth.sbx.laterpay.net/oauth2/token",
    SSO_BASE_URL: "https://signon.sbx.supertab.co",
    TAPI_BASE_URL: "https://tapi.sbx.laterpay.net",
    CHECKOUT_BASE_URL: "https://checkout.sbx.supertab.co",
  },
});
