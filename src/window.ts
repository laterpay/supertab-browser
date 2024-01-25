export const handleChildWindow = async <T>({
  url,
  childWindow,
  onMessage = (ev: MessageEvent) => ev.data as T,
  onClose = () => {
    return { error: "Window closed" };
  },
}: {
  url: URL;
  childWindow: Window | null;
  onMessage?: (ev: MessageEvent) => T;
  onClose?: () => void;
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
          console.log("uf");
          Promise.resolve(onClose() as T)
            .then(resolve)
            .catch(reject);
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

  return window.open("", target ?? "_blank", windowFeatures);
};
