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
    AUTH_BASE_URL: "https://auth.stg.laterpay.net",
    SSO_BASE_URL: "https://signon.stg.supertab.co",
    TAPI_BASE_URL: "https://tapi.stg.laterpay.net",
    CHECKOUT_BASE_URL: "https://checkout.stg.supertab.co",
  },
});
