import { omegaAnimation } from "./omegaAnimation";

export const handleChildWindow = async <T>({
  url,
  childWindow,
  onMessage = (ev: MessageEvent) => ev.data as T,
}: {
  url: URL;
  childWindow: Window | null;
  onMessage?: (ev: MessageEvent) => T;
}): Promise<T> => {
  const openedWindow = childWindow ?? window.open("", "_blank");

  if (!openedWindow) {
    throw new Error("Window is null");
  }

  openedWindow.location.href = url.toString();

  let receivedPostMessage = false;

  return new Promise<T>((resolve, reject) => {
    function eventListener(ev: MessageEvent) {
      if (ev.source === openedWindow) {
        window.removeEventListener("message", eventListener as EventListener);
        openedWindow?.close();
        receivedPostMessage = true;
        Promise.resolve(onMessage(ev)).then(resolve).catch(reject);
      }
    }

    const checkChildWindowState = setInterval(() => {
      if (openedWindow?.closed) {
        clearInterval(checkChildWindowState);

        if (!receivedPostMessage) {
          reject(new Error("window closed"));
        }
      }
    }, 500);

    window.addEventListener("message", eventListener);
  });
};

export const openBlankChildWindow = ({
  width,
  height,
  target,
}: {
  width?: number;
  height?: number;
  target?: string;
}) => {
  let windowFeatures;

  if (width && height) {
    const topOffset = window.outerHeight / 2 - height / 2 + window.screenTop;
    const leftOffset = window.outerWidth / 2 - width / 2 + window.screenLeft;

    windowFeatures = `popup=true,width=${width},height=${height},top=${topOffset},left=${leftOffset}`;
  }

  const newWindow = window.open("", target ?? "_blank", windowFeatures);

  if (newWindow) {
    const newWindowDoc = newWindow.document;

    if (newWindowDoc) {
      newWindowDoc.write("<html><head><title>Supertab...</title>");
      newWindowDoc.write(
        `<body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%" >
        <img style="width: 180px; height: auto" src="${omegaAnimation}" />
        <p style="margin-top: -10px; font-size: 16px; font-weight: 400; color: #555; font-family: Helvetica">Loading your Supertab...</p></body></html>`,
      );
    }
  }
  return newWindow;
};
