import { handleChildWindow } from "@/window";
import { describe, it, expect, mock } from "bun:test";

const setup = () => {
  const windowOpen = mock<
    (url: string, target: string, features: string) => void
  >(() => {
    return;
  });
  Object.defineProperty(window, "open", {
    value: windowOpen,
    writable: true,
  });

  return {
    windowOpen,
  };
};

describe("window", () => {
  describe("handleChildWindow", () => {
    it("opens authentication URL in a new tab", async () => {
      const { windowOpen } = setup();

      handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net"),
        target: "ssoWindow",
      });
      expect(windowOpen.mock.lastCall?.[0]).toEqual(
        "https://auth.sbx.laterpaytest.net/",
      );
      expect(windowOpen.mock.lastCall?.[1]).toEqual("ssoWindow");
      expect(windowOpen.mock.lastCall?.[2]).toEqual("");
    });

    it("opens authentication URL in a popup", async () => {
      const { windowOpen } = setup();

      handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net"),
        target: "ssoWindow",
        width: 400,
        height: 800,
      });
      expect(windowOpen.mock.lastCall?.[0]).toEqual(
        "https://auth.sbx.laterpaytest.net/",
      ); // window URL
      expect(windowOpen.mock.lastCall?.[1]).toEqual("ssoWindow"); // window name
      expect(windowOpen.mock.lastCall?.[2]).toInclude("popup"); // window features
    });

    it("listens for 'message' event", async () => {
      const addEventListener = mock<
        (type: string, callback: () => void) => void
      >(() => {
        return;
      });

      Object.defineProperty(window, "addEventListener", {
        value: addEventListener,
        writable: true,
      });

      handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net"),
        target: "ssoWindow",
      });
      expect(addEventListener.mock.lastCall).toEqual([
        "message",
        expect.any(Function),
      ]);
    });

    it("success if receive correct message", async () => {
      const authWindow = {
        close: () => {
          return;
        },
      } as MessageEventSource;
      const open = mock<(url: string, target: string) => void>(() => {
        return authWindow;
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          value: () => {
            return;
          },
          writable: true,
        },
      });

      const authentication = await handleChildWindow({
        url: new URL(
          "https://auth.sbx.laterpaytest.net?state=test-state&scope=test-scope",
        ),
        target: "ssoWindow",
        onMessage: (ev: MessageEvent) => ev.data.authCode,
      });

      expect(authentication).toEqual("test-auth-code");
    });

    it("fails if auth window is closed", async () => {
      const open = mock(() => ({ closed: true }));

      Object.defineProperty(window, "open", {
        value: open,
        writable: true,
      });

      expect(
        async () =>
          await handleChildWindow({
            url: new URL("https://auth.sbx.laterpaytest.net"),
            target: "ssoWindow",
          }),
      ).toThrow("window closed");
    });
  });
});
