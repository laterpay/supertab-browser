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
  splitting: true,
  env: {
    AUTH_URL: "https://auth.sbx.supertab.co/oauth2/auth",
    TOKEN_URL: "https://auth.sbx.supertab.co/oauth2/token",
    SSO_BASE_URL: "https://signon.sbx.supertab.co",
    TAPI_BASE_URL: "https://tapi.sbx.supertab.co",
    CHECKOUT_BASE_URL: "https://checkout.sbx.supertab.co",
  },
  noExternal: ["zod", "@getsupertab/tapper-sdk"],
});
