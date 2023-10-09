import { test, expect, describe } from "bun:test";
import { rest, server } from "@/mocks/server";
import Supertab from ".";
import { UserResponse, UserResponseToJSON } from "@laterpay/tapper-sdk";

describe("Supertab", () => {
  describe("SupertabInit", () => {
    test("assign window.Supertab", () => {
      const client = window.SupertabInit({ clientId: "test-client-id" });
      expect(window.Supertab).toBe(client);
    });
  });

  describe(".getApiVersion", () => {
    test("return api version from tapper", async () => {
      const client = new Supertab({ clientId: "test-client-id" });
      server.use(
        rest.get("https://tapi.sbx.laterpay.net/health", (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              status: "ok",
              version: "1.0.0",
            }),
          ),
        ),
      );
      expect(await client.getApiVersion()).toBe("1.0.0");
    });
  });

  describe(".getCurrentUser", () => {
    test("return logged user from tapper", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        }),
      );

      const client = new Supertab({ clientId: "test-client-id" });

      const user: UserResponse = {
        id: "test-user-id",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
        deletedAt: new Date("2021-01-01T00:00:00.000Z"),
        active: true,
        isEmailVerified: true,
      };

      server.use(
        rest.get(
          "https://tapi.sbx.laterpay.net/v1/identity/me",
          (_, res, ctx) =>
            res(ctx.status(200), ctx.json(UserResponseToJSON(user))),
        ),
      );
      expect(await client.getCurrentUser()).toEqual({
        id: user.id,
      });
    });
  });
});
