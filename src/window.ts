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

    newWindowDoc.write("<html><head><title>Loading...</title>");
    newWindowDoc.write("<style>");
    newWindowDoc.write(
      ".loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 12px; }",
    );
    newWindowDoc.write(
      '.loading-img {background-image: url("./assets/loading.png"); width: 128px; height: 106px;}',
    );

    // *** Commented for adding loading animation later on ***
    // newWindowDoc.write(
    //   "@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"
    // );
    newWindowDoc.write("</style>");
    newWindowDoc.write(
      '<body class="loading"><div class="loading-img"></div>Loading your Supertab...</body></html>',
    );
    // Simulate some loading time (you can replace this with actual loading logic)
    setTimeout(() => {
      newWindowDoc.body.innerHTML =
        "<html><head><title>New Window</title></head><body>Hello World</body></html>";
      // Close the document for writing
      newWindowDoc.close();
    }, 2000); // Simulate a 2-second loading time (adjust as needed)
  } else {
    alert("Pop-up blocked! Please allow pop-ups for this website.");
  }
};
