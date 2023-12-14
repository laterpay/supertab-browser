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
  const windowWidth = width ?? 400;
  const windowHeight = height ?? 800;
  const topOffset = window.outerHeight / 2 - windowHeight / 2;
  const leftOffset = window.outerWidth / 2 - windowWidth / 2;

  const features =
    width && height
      ? `popup=true&width=${windowWidth},height=${windowHeight},top=${topOffset},left=${leftOffset}`
      : "";

  const childWindow = window.open(url.toString(), target, features);

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
