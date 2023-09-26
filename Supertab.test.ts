import { test, expect, describe } from "bun:test";
import { rest, server } from "@/mocks/server";
import Supertab from ".";

describe("Supertab", () => {
  test("assign window.Supertab", () => {
    expect(window.Supertab).toBe(Supertab);
  });

  describe(".getApiVersion", () => {
    test("return api version from tapper", async () => {
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
      expect(await Supertab.getApiVersion()).toBe("1.0.0");
    });
  });
});
