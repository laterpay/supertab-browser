import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: true,
  clean: true,
  tsconfig: "tsconfig.json",
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist/prod",
  minify: true,
  env: {
    AUTH_BASE_URL: "https://auth.laterpay.net",
    SSO_BASE_URL: "https://signon.supertab.co",
    TAPI_BASE_URL: "https://tapi.laterpay.net",
    CHECKOUT_BASE_URL: "https://checkout.supertab.co",
  },
});
