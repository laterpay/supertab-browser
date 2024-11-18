const loadOmegaAnimation = async () => {
  const { default: omegaAnimation } = await import("./omegaAnimation.ts");
  return omegaAnimation;
};

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

  try {
    const isUrlOpened = openedWindow.location.href === url.toString();
    const setWindowLocation = () =>
      (openedWindow.location.href = url.toString());

    if (!isUrlOpened) {
      setWindowLocation();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

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
          resolve({ status: "error", error: "Window closed" } as T);
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
  let newWindowDocument = null;

  try {
    newWindowDocument = newWindow?.document;
    // eslint-disable-next-line no-empty
  } catch (e) {}

  loadOmegaAnimation().then((omegaAnimation) => {
    if (
      newWindowDocument &&
      newWindowDocument.getElementById("supertab-loading-animation") === null
    ) {
      newWindowDocument.write(
        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"><title>Supertab</title></head>',
      );
      newWindowDocument.write(
        `<body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%" id="supertab-loading-animation">
            <img style="width: 180px; height: auto" src="${omegaAnimation}" />
            <p style="margin-top: -10px; font-size: 16px; font-weight: 400; color: #555; font-family: Helvetica">Loading your Supertab...</p></body></html>`,
      );
    }
  });

  return newWindow;
};
