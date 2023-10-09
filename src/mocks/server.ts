import { rest } from "msw";
import { type SetupServer, setupServer } from "msw/node";
import { handlers } from "./handlers";
import {
  ClientConfig,
  ClientConfigToJSON,
} from "@laterpay/tapper-sdk";

const withClientConfig = (clientConfig: ClientConfig) => {
  server.use(
    rest.get(
      "https://tapi.sbx.laterpay.net/v1/public/items/client/:id/config",
      (_, res, ctx) =>
        res(ctx.status(200), ctx.json(ClientConfigToJSON(clientConfig))),
    ),
  );

  return server;
};
// Setup requests interception using the given handlers.
const server = Object.assign(setupServer(...handlers), {
  withClientConfig,
});

export { server, rest };
