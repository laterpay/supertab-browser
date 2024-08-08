import { SENTRY_DSN } from "./env";

export const sendErrorToSentry = async (error: Error) => {
  if (SENTRY_DSN) {
    const { captureException } = await import("./sentry");
    captureException(error);
  }
};

window.addEventListener("error", (event) => {
  sendErrorToSentry(event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  sendErrorToSentry(event.reason);
});
