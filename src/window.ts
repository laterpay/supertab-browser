export const handleChildWindow = async <T>({
  url,
  target,
  onMessage,
}: {
  url: URL;
  target: string;
  onMessage: (ev: MessageEvent) => T;
}): Promise<T> => {
  const childWindow = window.open(url.toString(), target);

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
