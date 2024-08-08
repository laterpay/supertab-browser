import * as Sentry from "@sentry/browser";
import {
  PACKAGE_NAME,
  PACKAGE_VERSION,
  SENTRY_DSN,
  TAPI_BASE_URL,
} from "./env";

Sentry.init({
  dsn: SENTRY_DSN,
  release: `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
  environment: TAPI_BASE_URL.includes("sbx")
    ? "sbx"
    : TAPI_BASE_URL.includes("stg")
      ? "stg"
      : "prod",
  integrations: [Sentry.browserTracingIntegration()],
  beforeSend: (event: Sentry.ErrorEvent) => {
    const found = event.exception?.values?.some(
      (value) =>
        value.stacktrace?.frames?.some(
          (frame) => frame.filename?.match(/dist\/(prod|sbx|stg)\/index\.js/),
        ),
    );

    return found ? event : null;
  },
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
});

export const captureException = (error: Error) =>
  Sentry.captureException(error);
