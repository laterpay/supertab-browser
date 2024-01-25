import { handleChildWindow, openBlankChildWindow } from "@/window";
import { describe, it, expect, mock } from "bun:test";
import { Window } from "happy-dom";

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

  Object.defineProperty(window, "location", {
    value: {
      href: "",
    },
    writable: true,
  });

  return {
    windowOpen,
  };
};

describe("window", () => {
  describe("openBlankChildWindow", () => {
    it("opens a new blank window", async () => {
      const { windowOpen } = setup();

      openBlankChildWindow({
        target: "testTarget",
      });

      expect(windowOpen.mock.lastCall?.[0]).toEqual("");
      expect(windowOpen.mock.lastCall?.[1]).toEqual("testTarget");
      expect(windowOpen.mock.lastCall?.[2]).toEqual(undefined);
    });

    it("opens a new blank window as a popup", async () => {
      const { windowOpen } = setup();

      openBlankChildWindow({
        width: 400,
        height: 800,
        target: "testTarget",
      });

      expect(windowOpen.mock.lastCall?.[0]).toEqual("");
      expect(windowOpen.mock.lastCall?.[1]).toEqual("testTarget");
      expect(windowOpen.mock.lastCall?.[2]).toInclude("popup");
    });
  });

  describe("handleChildWindow", () => {
    it("throws if window is null", async () => {
      const childWindow = null;

      expect(
        async () =>
          await handleChildWindow({
            url: new URL("https://auth.sbx.laterpaytest.net"),
            childWindow,
          }),
      ).toThrow("Window is null");
    });

    it("opens authentication URL", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childWindow = new Window() as any;

      handleChildWindow({
        url: new URL("https://auth.sbx.laterpaytest.net"),
        childWindow,
      });

      expect(childWindow.location.href).toEqual(
        "https://auth.sbx.laterpaytest.net/",
      );
    });

    it("listens for 'message' event", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childWindow = new Window() as any;

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
        childWindow,
      });

      expect(addEventListener.mock.lastCall).toEqual([
        "message",
        expect.any(Function),
      ]);
    });

    it("succeeds when correct message is received", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childWindow = new Window() as any;

      Object.defineProperties(childWindow, {
        close: {
          value: mock<() => void>(() => {
            return;
          }),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addEventListener = mock((_: string, listener: (evt: any) => void) =>
        listener({
          data: {
            authCode: "test-auth-code",
          },
          source: childWindow,
        }),
      );

      Object.defineProperties(window, {
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
        childWindow,
        onMessage: (ev: MessageEvent) => ev.data.authCode,
      });

      expect(authentication).toEqual("test-auth-code");
    });

    it("fails if auth window is closed", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childWindow = new Window() as any;

      const open = mock(() => ({ closed: true }));

      Object.defineProperty(window, "open", {
        value: open,
        writable: true,
      });

      Object.defineProperty(childWindow, "closed", {
        value: true,
      });

      expect(
        async () =>
          await handleChildWindow({
            url: new URL("https://auth.sbx.laterpaytest.net"),
            childWindow,
          }),
      ).toEqual(() => {
        return { error: "Window closed" };
      });
    });
  });
});
