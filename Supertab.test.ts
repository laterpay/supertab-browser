import { test, expect, describe } from "bun:test";
import { rest, server } from "@/mocks/server";
import Supertab from ".";

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
});
