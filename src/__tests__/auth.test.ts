import { describe, it, expect } from "bun:test";
import { authorize, authenticate, getAuthStatus, AuthStatus } from "../auth";
import { rest, server } from "@/mocks/server";

describe("auth", () => {
  describe("authorize", () => {
    it("returns authentication URL and codeVerifier", async () => {
      const { url, codeVerifier } = await authorize({
        clientId: "clientId",
        redirectUri: "redirectUri",
        screenHint: "screenHint",
        authBaseUrl: "https://auth.sbx.laterpaytest.net",
      });

      const params = Object.fromEntries(url.searchParams.entries());

      expect(params).toMatchObject({
        code_challenge: expect.stringMatching(/^.{43}$/),
        code_challenge_method: "S256",
        scope: "read write offline_access",
        response_type: "code",
        state: "eyJvcmlnaW4iOiJudWxsIn0=",
        client_id: "clientId",
        redirect_uri: "redirectUri",
        audience_hint: "consumer",
        screen_hint: "screenHint",
      });

      expect(codeVerifier).toBeDefined();
    });
  });

  describe("authenticate", () => {
    it("exchanges auth code for access token", async () => {
      server.use(
        rest.post(
          "https://auth.sbx.laterpaytest.net/oauth2/token",
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                access_token: "test-access-token",
                refresh_token: "test-refresh-token",
                expires_in: 3600,
                token_type: "Bearer",
              }),
            ),
        ),
      );

      const authentication = await authenticate({
        codeVerifier: "codeVerifier",
        authCode: "authCode",
        clientId: "clientId",
        redirectUri: "redirectUri",
        authBaseUrl: "https://auth.sbx.laterpaytest.net",
      });

      expect(authentication).toEqual({
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
        expiresAt: expect.any(Number),
        tokenType: "Bearer",
      });
    });

    it("throws error if auth code is invalid", async () => {
      server.use(
        rest.post(
          "https://auth.sbx.laterpaytest.net/oauth2/token",
          (_, res, ctx) =>
            res(
              ctx.status(400),
              ctx.json({
                error: {
                  message: "Invalid code",
                },
              }),
            ),
        ),
      );

      expect(
        async () =>
          await authenticate({
            codeVerifier: "codeVerifier",
            authCode: "authCode",
            clientId: "clientId",
            redirectUri: "redirectUri",
            authBaseUrl: "https://auth.sbx.laterpaytest.net",
          }),
      ).toThrow("Invalid code");
    });
  });

  describe("getAuthStatus", () => {
    it("returns 'valid' if access token is valid", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        }),
      );
      expect(getAuthStatus()).toBe(AuthStatus.VALID);
    });

    it("returns 'missing' if access token is invalid", async () => {
      localStorage.removeItem("supertab-auth");
      expect(getAuthStatus()).toBe(AuthStatus.MISSING);
    });

    it("returns 'expired' if access token is expired", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() - 100000,
        }),
      );
      expect(getAuthStatus()).toBe(AuthStatus.EXPIRED);
    });
  });
});
