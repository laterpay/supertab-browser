const loadOmegaAnimation = async () => {
  const { default: omegaAnimation } = await import("./omegaAnimation");
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

  const setWindowLocation = () => {
    try {
      // Direct location assignment (like in handleChildWindow)
      openedWindow.location = url.toString();
      // eslint-disable-next-line
    } catch (e) {
      openedWindow.location.replace(url.toString());
    }
  };

  const isUrlOpened = openedWindow.location.href === url.toString();

  if (!isUrlOpened) {
    fetch(url.toString())
      .then(setWindowLocation)
      .catch(() => setWindowLocation());
  }

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

  const newWindow = window.open(
    "about:blank",
    target ?? "_blank",
    windowFeatures,
  );
  let newWindowDocument = null;

  try {
    newWindowDocument = newWindow?.document;
    // eslint-disable-next-line
  } catch (e) {}

  if (newWindowDocument) {
    newWindowDocument.write(
      '<html><head><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"><title>Supertab</title></head>',
    );
    newWindowDocument.close();

    loadOmegaAnimation()
      .then((omegaAnimation) => {
        if (
          newWindowDocument &&
          newWindowDocument.getElementById("supertab-loading-animation") ===
            null
        ) {
          const container = newWindowDocument.createElement("div");
          container.id = "supertab-loading-animation";
          container.style.cssText =
            "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%";

          const img = newWindowDocument.createElement("img");
          img.src = omegaAnimation;
          img.style.cssText = "width: 180px; height: auto";

          const text = newWindowDocument.createElement("p");
          text.style.cssText =
            "margin-top: -10px; font-size: 16px; font-weight: 400; color: #555; font-family: Helvetica";
          text.textContent = "Loading your Supertab...";

          container.appendChild(img);
          container.appendChild(text);
          newWindowDocument.body.appendChild(container);
        }
      })
      // eslint-disable-next-line
      .catch((e) => {});
  }

  return newWindow;
};
