import { rest } from "msw";
import { type SetupServer, setupServer } from "msw/node";
import { handlers } from "./handlers";
import {
  AccessResponse,
  AccessResponseToJSON,
  ClientConfig,
  ClientConfigToJSON,
  HealthResponse,
  HealthResponseToJSON,
  PaginatedTabResponse,
  PaginatedTabResponseToJSON,
  PurchaseOfferingResponse,
  PurchaseOfferingResponseToJSON,
  ResponseError,
  TabResponse,
  TabResponseToJSON,
  UserResponse,
  UserResponseToJSON,
} from "@laterpay/tapper-sdk";

// typed mocks handlers
const withClientConfig = (clientConfig: ClientConfig) => {
  server.use(
    rest.get(
      "https://tapi.sbx.laterpay.net/v1/public/items/client/:id/config",
      (_, res, ctx) =>
        res(ctx.status(200), ctx.json(ClientConfigToJSON(clientConfig)))
    )
  );

  return server;
};

const withCurrentUser = (user: UserResponse) => {
  server.use(
    rest.get("https://tapi.sbx.laterpay.net/v1/identity/me", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(UserResponseToJSON(user)))
    )
  );

  return server;
};

const withHealth = (health: HealthResponse) => {
  server.use(
    rest.get("https://tapi.sbx.laterpay.net/health", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(HealthResponseToJSON(health)))
    )
  );

  return server;
};

const withAccessCheck = (accessCheck: AccessResponse) => {
  server.use(
    rest.get("https://tapi.sbx.laterpay.net/v2/access/check", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(AccessResponseToJSON(accessCheck)))
    )
  );
};

const withGetTab = (tab: PaginatedTabResponse) => {
  server.use(
    rest.get("https://tapi.sbx.laterpay.net/v1/tabs", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(PaginatedTabResponseToJSON(tab)))
    )
  );
};

const withGetTabById = (tab: TabResponse) => {
  server.use(
    rest.get(`https://tapi.sbx.laterpay.net/v1/tabs/${tab.id}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(TabResponseToJSON(tab)))
    )
  );
};

const withPurchase = (purchase: PurchaseOfferingResponse) => {
  server.use(
    rest.post(
      "https://tapi.sbx.laterpay.net/v1/purchase/test-offering-id",
      (_, res, ctx) =>
        res(ctx.status(200), ctx.json(PurchaseOfferingResponseToJSON(purchase)))
    )
  );
};

const withPurchaseResponseError = (error: any) => {
  server.use(
    rest.post(
      "https://tapi.sbx.laterpay.net/v1/purchase/test-offering-id",
      (_, res, ctx) => res(ctx.status(402), ctx.json(error as ResponseError))
    )
  );
};

// Setup requests interception using the given handlers.
const server = Object.assign(setupServer(...handlers), {
  withClientConfig,
  withCurrentUser,
  withHealth,
  withAccessCheck,
  withGetTab,
  withGetTabById,
  withPurchase,
  withPurchaseResponseError,
});

export { server, rest };
