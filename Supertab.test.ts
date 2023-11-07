import { test, expect, describe, mock, spyOn } from "bun:test";
import { server } from "@/mocks/server";
import EventEmitter from "events";
import Supertab from ".";
import {
  Currency,
  SiteOffering,
  TabStatus,
  UserResponse,
} from "@laterpay/tapper-sdk";

const setup = ({ authenticated = true, authExpiresIn = 100000 }: { authenticated?: boolean, authExpiresIn?: number } = {}) => {
  const emitter = new EventEmitter();

  const checkoutWindow = {
    close: () => {},
    closed: false,
  }
  const windowOpen = mock((url: string, target: string) => {
    if (target === "supertabCheckout") {
      return checkoutWindow;
    }
  });
  const client = new Supertab({ clientId: "test-client-id" });

  window.addEventListener = emitter.addListener.bind(emitter) as any;
  window.removeEventListener = emitter.removeListener.bind(emitter) as any;
  window.open = windowOpen as any;

  if (authenticated) {
    localStorage.setItem(
      "supertab-auth",
      JSON.stringify({
        expiresAt: Date.now() + authExpiresIn,
      })
    );
  }

  return {
    client,
    windowOpen,
    checkoutWindow,
    emitter,
  }
}

describe("Supertab", () => {
  describe("SupertabInit", () => {
    test("assign window.Supertab", () => {
      const client = window.SupertabInit({ clientId: "test-client-id" });
      expect(window.Supertab).toBe(client);
    });
  });

  describe(".getApiVersion", () => {
    test("return api version from tapper", async () => {
      const client = new Supertab({ clientId: "test-client-id" });
      server.withHealth({
        status: "ok",
        version: "1.0.0",
      });
      expect(await client.getApiVersion()).toBe("1.0.0");
    });
  });

  describe(".getCurrentUser", () => {
    test("return logged user from tapper", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        })
      );

      const client = new Supertab({ clientId: "test-client-id" });

      const user: UserResponse = {
        id: "test-user-id",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
        deletedAt: new Date("2021-01-01T00:00:00.000Z"),
        active: true,
        isEmailVerified: true,
      };

      server.withCurrentUser(user);

      expect(await client.getCurrentUser()).toEqual({ id: user.id });
    });
  });

  describe(".getOfferings", () => {
    test("return offerings with default currency", async () => {
      const client = new Supertab({
        clientId: "test-client-id",
        language: "en-US",
      });

      server.withClientConfig({
        contentKeys: [],
        redirectUri: "",
        siteName: "",
        testMode: false,
        offerings: [
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            price: {
              amount: 100,
              currency: "USD",
            },
          } as SiteOffering,
        ],
        currencies: [
          {
            isoCode: "USD",
            baseUnit: 100,
          },
        ] as Currency[],
        suggestedCurrency: "USD",
      });

      expect(await client.getOfferings()).toEqual([
        {
          id: "test-offering-id",
          description: "Test Offering Description",
          price: "$1.00",
        },
      ]);
    });

    test("return offerings with given currency", async () => {
      const client = new Supertab({
        clientId: "test-client-id",
        language: "pt-BR",
      });

      server.withClientConfig({
        contentKeys: [],
        redirectUri: "",
        siteName: "",
        testMode: false,
        offerings: [
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            price: {
              amount: 100,
              currency: "BRL",
            },
          } as SiteOffering,
        ],
        currencies: [
          {
            isoCode: "USD",
            baseUnit: 100,
          },
          {
            isoCode: "BRL",
            baseUnit: 100,
          },
        ] as Currency[],
        suggestedCurrency: "USD",
      });

      expect(await client.getOfferings({ currency: "BRL" })).toEqual([
        {
          id: "test-offering-id",
          description: "Test Offering Description",
          price: "R$ 1,00",
        },
      ]);
    });
  });

  describe(".checkAccess", () => {
    const accessClientConfig = {
      contentKeys: [
        {
          contentKey: "test-content-key",
          offeringIds: ["test-offering-id"],
          productId: "test-product-id",
        },
      ],
      redirectUri: "",
      siteName: "",
      testMode: false,
      offerings: [
        {
          id: "test-offering-id",
          description: "Test Offering Description",
          price: {
            amount: 100,
            currency: "USD",
          },
        } as SiteOffering,
      ],
      currencies: [
        {
          isoCode: "USD",
          baseUnit: 100,
        },
      ] as Currency[],
      suggestedCurrency: "USD",
    };

    test("return access granted", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        })
      );

      const client = new Supertab({ clientId: "test-client-id" });

      server.withClientConfig(accessClientConfig);

      server.withAccessCheck({
        access: {
          status: "Granted",
          contentKey: "test-content-key",
          validTo: 1700119519,
        },
      });

      expect(await client.checkAccess()).toEqual({
        validTo: new Date(1700119519 * 1000),
      });
    });
  });

  describe(".getUserTab", () => {
    test.each([TabStatus.Open, TabStatus.Full])(
      "return user's %s tab",
      async (status) => {
        localStorage.setItem(
          "supertab-auth",
          JSON.stringify({
            expiresAt: Date.now() + 100000,
          })
        );

        const client = new Supertab({ clientId: "test-client-id" });

        server.withGetTab({
          data: [
            {
              id: "test-tab-id",
              createdAt: new Date("2023-11-03T15:34:44.852Z"),
              updatedAt: new Date("2023-11-03T15:34:44.852Z"),
              merchantId: "test-merchant-id",
              userId: "test-user-id",
              status,
              paidAt: null,
              total: 50,
              limit: 500,
              currency: "USD",
              paymentModel: "pay_later",
              purchases: [
                {
                  id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
                  createdAt: new Date("2023-11-03T15:34:44.852Z"),
                  updatedAt: new Date("2023-11-03T15:34:44.852Z"),
                  purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
                  merchantId: "test-merchant-id",
                  summary: "test-summary",
                  price: {
                    amount: 50,
                    currency: "USD",
                  },
                  salesModel: "time_pass",
                  paymentModel: "pay_later",
                  metadata: {
                    additionalProp1: {},
                    additionalProp2: {},
                    additionalProp3: {},
                  },
                  attributedTo: "test-id",
                  offeringId: "test-offering-id",
                  contentKey: "test-content-key",
                  testMode: false,
                  merchantName: "test-merchant-name",
                },
              ],
              metadata: {
                additionalProp1: {},
                additionalProp2: {},
                additionalProp3: {},
              },
              testMode: false,
              tabStatistics: {
                purchasesCount: 0,
                obfuscatedPurchasesCount: 0,
                obfuscatedPurchasesTotal: 0,
              },
            },
          ],
          metadata: {
            count: 1,
            perPage: 1,
            links: {
              previous: "",
              next: "",
            },
            numberPages: 1,
          },
        });

        expect(await client.getUserTab()).toEqual({
          status,
          total: 50,
          limit: 500,
          currency: "USD",
          purchases: [
            {
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              summary: "test-summary",
              price: {
                amount: 50,
                currency: "USD",
              },
            },
          ],
        });
      }
    );

    test("throw an error if no tabs", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        })
      );

      const client = new Supertab({ clientId: "test-client-id" });

      server.withGetTab({
        data: [],
        metadata: {
          count: 1,
          perPage: 1,
          links: {
            previous: "",
            next: "",
          },
          numberPages: 1,
        },
      });

      expect(async () => {
        await client.getUserTab();
      }).toThrow(Error);
    });

    test("throw an error if no open tab", async () => {
      localStorage.setItem(
        "supertab-auth",
        JSON.stringify({
          expiresAt: Date.now() + 100000,
        })
      );

      const client = new Supertab({ clientId: "test-client-id" });

      server.withGetTab({
        data: [
          {
            id: "test-tab-id",
            createdAt: new Date("2023-11-03T15:34:44.852Z"),
            updatedAt: new Date("2023-11-03T15:34:44.852Z"),
            merchantId: "test-merchant-id",
            userId: "test-user-id",
            status: "closed",
            paidAt: null,
            total: 50,
            limit: 500,
            currency: "USD",
            paymentModel: "pay_later",
            purchases: [
              {
                id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
                createdAt: new Date("2023-11-03T15:34:44.852Z"),
                updatedAt: new Date("2023-11-03T15:34:44.852Z"),
                purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
                merchantId: "test-merchant-id",
                summary: "test-summary",
                price: {
                  amount: 50,
                  currency: "USD",
                },
                salesModel: "time_pass",
                paymentModel: "pay_later",
                metadata: {
                  additionalProp1: {},
                  additionalProp2: {},
                  additionalProp3: {},
                },
                attributedTo: "test-id",
                offeringId: "test-offering-id",
                contentKey: "test-content-key",
                testMode: false,
                merchantName: "test-merchant-name",
              },
            ],
            metadata: {
              additionalProp1: {},
              additionalProp2: {},
              additionalProp3: {},
            },
            testMode: false,
            tabStatistics: {
              purchasesCount: 0,
              obfuscatedPurchasesCount: 0,
              obfuscatedPurchasesTotal: 0,
            },
          },
        ],
        metadata: {
          count: 1,
          perPage: 1,
          links: {
            previous: "",
            next: "",
          },
          numberPages: 1,
        },
      });

      expect(async () => {
        await client.getUserTab();
      }).toThrow(Error);
    });
  });

  describe(".pay", () => {
    test("opens checkout page", async () => {
      const { client, windowOpen } = setup();
      client.pay("test-tab-id")

      expect(windowOpen.mock.calls[0]).toEqual([
        "https://checkout.sbx.supertab.co/?tab_id=test-tab-id&language=en-US&testmode=false",
        "supertabCheckout"
      ]);
    });

    test("return success if checkout page succeeds", async () => {
      const { client, checkoutWindow, emitter } = setup();
      const payment = client.pay("test-tab-id")

      emitter.emit("message", {
        source: checkoutWindow,
        origin: "https://checkout.sbx.supertab.co",
        data: {
          status: "payment_completed"
        }
      });

      expect(async () => await payment).not.toThrow(Error);
    });

    test("throw an error if not authenticated", () => {
      const { client } = setup({ authenticated: false });
      expect(async () => await client.pay("test-tab-id")).toThrow(/Missing auth/);
    });

    test("throw an error if checkout page fails", async () => {
      const { client, checkoutWindow, emitter } = setup();

      expect(async () => {
        const payment = client.pay("test-tab-id")

        emitter.emit("message", {
          source: checkoutWindow,
          origin: "https://checkout.sbx.supertab.co",
          data: {
            status: "something else"
          }
        });

        await payment;
      }).toThrow(/Payment failed/);
    });

    test("throw an error if checkout page closes", async () => {
      const { client, checkoutWindow } = setup();
      checkoutWindow.closed = true;

      expect(async () => {
        const payment = client.pay("test-tab-id")

        await payment;
      }).toThrow(/window closed/);
    });
  });
});
