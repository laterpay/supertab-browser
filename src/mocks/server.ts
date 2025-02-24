import { rest } from "msw";
import * as node from "msw/node";
import { handlers } from "./handlers";
import {
  AccessResponse,
  AccessResponseToJSON,
  ClientConfigResponse,
  ClientConfigResponseToJSON,
  ClientExperiencesConfigResponse,
  ClientExperiencesConfigResponseToJSON,
  HealthResponse,
  HealthResponseToJSON,
  PaginatedTabResponse,
  PaginatedTabResponseToJSON,
  PurchaseEventResponse,
  PurchaseEventResponseToJSON,
  TabResponse,
  TabResponseToJSON,
  UserResponse,
  UserResponseToJSON,
} from "@getsupertab/tapper-sdk";

// typed mocks handlers
const withClientConfig = (clientConfig: ClientConfigResponse) => {
  server.use(
    rest.get(
      "https://tapi.sbx.supertab.co/v1/public/items/client/:id/config",
      (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json(ClientConfigResponseToJSON(clientConfig)),
        ),
    ),
  );

  return server;
};

const withClientExperiencesConfig = (
  clientExperiencesConfig: ClientExperiencesConfigResponse,
) => {
  server.use(
    rest.get(
      "https://tapi.sbx.supertab.co/v1/public/experiences/:id/config",
      (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json(
            ClientExperiencesConfigResponseToJSON(clientExperiencesConfig),
          ),
        ),
    ),
  );

  return server;
};

const withCurrentUser = (user: UserResponse) => {
  server.use(
    rest.get("https://tapi.sbx.supertab.co/v1/identity/me", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(UserResponseToJSON(user))),
    ),
  );

  return server;
};

const withHealth = (health: HealthResponse) => {
  server.use(
    rest.get("https://tapi.sbx.supertab.co/health", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(HealthResponseToJSON(health))),
    ),
  );

  return server;
};

let lastAccessCheckRequest: { contentKey?: string } | null = null;

const withAccessCheck = (accessCheck: AccessResponse) => {
  server.use(
    rest.get(
      "https://tapi.sbx.supertab.co/v2/access/check",
      (req, res, ctx) => {
        const contentKey = req.url.searchParams.get("content_key") || undefined;
        lastAccessCheckRequest = { contentKey };

        return res(
          ctx.status(200),
          ctx.json(AccessResponseToJSON(accessCheck)),
        );
      },
    ),
  );
};

const withGetTab = (tab: PaginatedTabResponse) => {
  server.use(
    rest.get("https://tapi.sbx.supertab.co/v1/tabs", (_, res, ctx) =>
      res(ctx.status(200), ctx.json(PaginatedTabResponseToJSON(tab))),
    ),
  );
};

const withGetTabById = (tab: TabResponse) => {
  server.use(
    rest.get(`https://tapi.sbx.supertab.co/v1/tabs/${tab.id}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(TabResponseToJSON(tab))),
    ),
  );
};

const withPurchase = (purchase: PurchaseEventResponse, status = 200) => {
  server.use(
    rest.post(
      "https://tapi.sbx.supertab.co/v1/purchase/test-offering-id",
      (_, res, ctx) =>
        res(
          ctx.status(status),
          ctx.json(PurchaseEventResponseToJSON(purchase)),
        ),
    ),
  );
};

const getLastAccessCheckRequest = () => {
  if (!lastAccessCheckRequest) {
    throw new Error("No access check request has been made");
  }
  return lastAccessCheckRequest;
};

// Setup requests interception using the given handlers.
const server = Object.assign(node.setupServer(...handlers), {
  withClientConfig,
  withClientExperiencesConfig,
  withCurrentUser,
  withHealth,
  withAccessCheck,
  withGetTab,
  withGetTabById,
  withPurchase,
  getLastAccessCheckRequest,
});

export { server, rest };
