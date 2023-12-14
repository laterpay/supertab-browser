export const handleChildWindow = async <T>({
  url,
  target,
  width,
  height,
  onMessage = (ev: MessageEvent) => ev.data as T,
}: {
  url: URL;
  target: string;
  width?: number;
  height?: number;
  onMessage?: (ev: MessageEvent) => T;
}): Promise<T> => {
  let windowFeatures;

  if (width && height) {
    const topOffset = window.outerHeight / 2 - height / 2;
    const leftOffset = window.outerWidth / 2 - width / 2;

    windowFeatures = `popup=true&width=${width},height=${height},top=${topOffset},left=${leftOffset}`;
  }

  const childWindow = window.open(url.toString(), target, windowFeatures);

  let receivedPostMessage = false;

  return new Promise<T>((resolve, reject) => {
    function eventListener(ev: MessageEvent) {
      if (ev.source === childWindow) {
        window.removeEventListener("message", eventListener as EventListener);
        childWindow?.close();
        receivedPostMessage = true;
        Promise.resolve(onMessage(ev)).then(resolve).catch(reject);
      }
    }

    const checkChildWindowState = setInterval(() => {
      if (childWindow?.closed) {
        clearInterval(checkChildWindowState);

        if (!receivedPostMessage) {
          reject(new Error("window closed"));
        }
      }
    }, 500);

    window.addEventListener("message", eventListener);
  });
};
