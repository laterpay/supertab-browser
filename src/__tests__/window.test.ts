import { handleChildWindow } from "@/window";
import { describe, it, expect, mock } from "bun:test";

describe("window", () => {
  describe("handleChildWindow", () => {
    it("opens authentication URL in a new window", async () => {
      const open = mock((url: string, target: string) => {});
      Object.defineProperty(window, "open", {
        value: open,
        writable: true,
      });

      handleChildWindow({ url: new URL("https://auth.sbx.laterpaytest.net"), target: "ssoWindow", onMessage: () => {} });
      expect(open.mock.lastCall).toEqual([
        "https://auth.sbx.laterpaytest.net/",
        "ssoWindow",
      ]);
    });

    it("listens for 'message' event", async () => {
      const addEventListener = mock((type: string, callback: any) => {});

      Object.defineProperty(window, "addEventListener", {
        value: addEventListener,
        writable: true,
      });

      handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net"),
        target: "ssoWindow",
        onMessage: () => {},
      });
      expect(addEventListener.mock.lastCall).toEqual([
        "message",
        expect.any(Function),
      ]);
    });

    it("success if receive correct message", async () => {
      const authWindow = {
        close: () => {},
      } as MessageEventSource;
      const open = mock((_: string) => authWindow);
      const addEventListener = mock((_: string, listener: (evt: any) => void) =>
        listener({
          data: {
            authCode: "test-auth-code",
          },
          source: authWindow,
        }),
      );

      Object.defineProperties(window, {
        open: {
          value: open,
          writable: true,
        },
        addEventListener: {
          value: addEventListener,
          writable: true,
        },
        removeEventListener: {
          value: () => {},
          writable: true,
        },
      });

      const authentication = await handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net?state=test-state&scope=test-scope"),
        target: "ssoWindow",
        onMessage: (ev:MessageEvent) => {
          return ev.data.authCode;
        },
      });

      expect(authentication).toEqual("test-auth-code");
    });

    it("fails if auth window is closed", async () => {
      const open = mock((_: string) => ({ closed: true }));

      Object.defineProperty(window, "open", {
        value: open,
        writable: true,
      });

      expect(
        async () =>
          await handleChildWindow({
            url: new URL("https://auth.sbx.laterpaytest.net"),
            target: "ssoWindow",
            onMessage: () => {},
          }),
      ).toThrow("window closed");
    });
  });
});
