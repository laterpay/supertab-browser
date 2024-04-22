import { test, expect, describe, mock, beforeEach } from "bun:test";
import { server } from "@/mocks/server";
import EventEmitter from "events";
import Supertab from ".";
import {
  Currency,
  SiteOffering,
  TabResponse,
  TabStatus,
  UserResponse,
} from "@laterpay/tapper-sdk";

const setup = ({
  authenticated = true,
  authExpiresIn = 100000,
  language = "en-US",
  preferredCurrencyCode,
  clientConfigProps,
}: {
  authenticated?: boolean;
  authExpiresIn?: number;
  language?: string;
  preferredCurrencyCode?: string;
  clientConfigProps?: {
    offeringCurrency?: string;
    suggestedCurrency?: string;
  };
} = {}) => {
  const emitter = new EventEmitter();

  const checkoutWindow = {
    close: () => {
      return;
    },
    location: {
      href: "",
    },
    closed: false,
  };
  const windowOpen = mock<typeof window.open>((_, target) => {
    if (target === "supertabCheckout") {
      return checkoutWindow as Window;
    }
    return null;
  });
  const client = new Supertab({
    clientId: "test-client-id",
    language,
    ...(preferredCurrencyCode && { preferredCurrencyCode }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.addEventListener = emitter.addListener.bind(emitter) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.removeEventListener = emitter.removeListener.bind(emitter) as any;
  window.open = windowOpen;

  if (authenticated) {
    localStorage.setItem(
      "supertab-auth",
      JSON.stringify({
        expiresAt: Date.now() + authExpiresIn,
      }),
    );
  }

  server.withClientConfig({
    contentKeys: [],
    redirectUri: "",
    siteName: "",
    testMode: false,
    offerings: [
      {
        id: "test-offering-id",
        description: "Test Offering Description",
        salesModel: "time_pass",
        price: {
          amount: 100,
          currency: clientConfigProps?.offeringCurrency ?? "USD",
        },
      } as SiteOffering,
    ],
    currencies: [
      {
        isoCode: "USD",
        baseUnit: 100,
      },
      {
        isoCode: "EUR",
        baseUnit: 100,
      },
      {
        isoCode: "BRL",
        baseUnit: 100,
      },
    ] as Currency[],
    suggestedCurrency: clientConfigProps?.suggestedCurrency ?? "USD",
  });

  return {
    client,
    windowOpen,
    checkoutWindow,
    emitter,
  };
};

describe("Supertab", () => {
  describe("SupertabInit", () => {
    test("assign window.Supertab", () => {
      const client = window.SupertabInit({ clientId: "test-client-id" });
      expect(window.Supertab).toBe(client);
    });
  });

  describe(".getApiVersion", () => {
    test("return api version from tapper", async () => {
      const { client } = setup();

      server.withHealth({
        status: "ok",
        version: "1.0.0",
      });

      expect(await client.getApiVersion()).toBe("1.0.0");
    });
  });

  describe(".getUser", () => {
    test("return logged user from tapper", async () => {
      const { client } = setup();

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

      expect(await client.getUser()).toEqual({ id: user.id });
    });
  });

  describe(".getOfferings", () => {
    describe("with no existing tab", () => {
      beforeEach(() => {
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
      });

      test("return offerings with default currency", async () => {
        const { client } = setup();

        expect(await client.getOfferings()).toMatchSnapshot();
      });

      test("return offerings in given locale", async () => {
        const { client } = setup({ language: "pt-BR" });

        expect(await client.getOfferings()).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "USD",
              text: "$ 1,00",
            },
          },
        ]);
      });

      test("return offering price in preferred currency passed as a global param", async () => {
        const { client } = setup({
          preferredCurrencyCode: "EUR",
          clientConfigProps: { suggestedCurrency: "USD" },
        });

        expect(await client.getOfferings()).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "EUR",
              text: "€1.00",
            },
          },
        ]);
      });

      test("return offering price in preferred currency passed as a local param", async () => {
        const { client } = setup({
          preferredCurrencyCode: "EUR",
          clientConfigProps: { suggestedCurrency: "EUR" },
        });

        expect(
          await client.getOfferings({ preferredCurrencyCode: "USD" }),
        ).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "USD",
              text: "$1.00",
            },
          },
        ]);
      });

      test("return offering price in suggested currency if preferred currency is not set", async () => {
        const { client } = setup({
          clientConfigProps: {
            suggestedCurrency: "BRL",
          },
        });

        expect(await client.getOfferings()).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "BRL",
              text: "R$1.00",
            },
          },
        ]);
      });
    });

    describe("with existing tab", () => {
      beforeEach(() => {
        server.withGetTab({
          data: [
            {
              id: "test-tab-id",
              createdAt: new Date("2023-11-03T15:34:44.852Z"),
              updatedAt: new Date("2023-11-03T15:34:44.852Z"),
              merchantId: "test-merchant-id",
              userId: "test-user-id",
              status: "open",
              paidAt: null,
              total: 50,
              limit: 500,
              currency: "EUR",
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
                    currency: "EUR",
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
      });

      test("return offerings in tab currency by default", async () => {
        const { client } = setup();

        expect(await client.getOfferings()).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "EUR",
              text: "€1.00",
            },
          },
        ]);
      });

      test("return offerings in tab currency when global currency param is set to different currency", async () => {
        const { client } = setup({ preferredCurrencyCode: "USD" });

        expect(await client.getOfferings()).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "EUR",
              text: "€1.00",
            },
          },
        ]);
      });

      test("return offerings in tab currency when local currency param is set to different currency", async () => {
        const { client } = setup();

        expect(
          await client.getOfferings({ preferredCurrencyCode: "BRL" }),
        ).toEqual([
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            salesModel: "time_pass",
            price: {
              amount: 100,
              currency: "EUR",
              text: "€1.00",
            },
          },
        ]);
      });
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
      const { client } = setup();

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

  describe(".getTab", () => {
    test.each([TabStatus.Open, TabStatus.Full])(
      "return user's %s tab",
      async (status) => {
        const { client } = setup();

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

        expect(await client.getTab()).toEqual({
          id: "test-tab-id",
          status,
          total: {
            amount: 50,
            text: "$0.50",
          },
          limit: {
            amount: 500,
            text: "$5",
          },
          currency: "USD",
          purchases: [
            {
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              summary: "test-summary",
              price: {
                amount: 50,
                currency: "USD",
                text: "$0.50",
              },
            },
          ],
        });
      },
    );

    test("return undefined if no tabs", async () => {
      const { client } = setup();

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

      expect(await client.getTab()).toBeUndefined();
    });

    test("return undefined if no open tab", async () => {
      const { client } = setup();

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

      expect(await client.getTab()).toBeUndefined();
    });
  });

  describe(".payTab", () => {
    beforeEach(() => {
      server.withGetTabById({
        id: "test-tab-id",
        createdAt: new Date("2023-11-03T15:34:44.852Z"),
        updatedAt: new Date("2023-11-03T15:34:44.852Z"),
        merchantId: "test-merchant-id",
        userId: "test-user-id",
        status: "full",
        paidAt: null,
        total: 50,
        limit: 500,
        currency: "USD",
        paymentModel: "pay_later",
        purchases: [],
        testMode: false,
        tabStatistics: {},
      });
    });

    test("opens checkout popup", async () => {
      const { client, windowOpen, emitter, checkoutWindow } = setup();
      const payment = client.payTab("test-tab-id");

      //wait a tick to interact with the window
      await nextTick();

      emitter.emit("message", {
        source: checkoutWindow,
        origin: "https://checkout.sbx.supertab.co",
        data: {
          status: "payment_completed",
        },
      });

      await payment;

      expect(windowOpen.mock.lastCall?.[1]).toEqual("supertabCheckout");
      expect(windowOpen.mock.lastCall?.[2]).toInclude("popup");

      setTimeout(() => {
        expect(checkoutWindow.location.href).toEqual(
          "https://checkout.sbx.supertab.co/?tab_id=test-tab-id&language=en-US&testmode=false",
        );
      }, 3000);
    });

    test("return success if checkout page succeeds", async () => {
      const { client, checkoutWindow, emitter } = setup();
      const payment = client.payTab("test-tab-id");

      //wait a tick to interact with the window
      await nextTick();

      emitter.emit("message", {
        source: checkoutWindow,
        origin: "https://checkout.sbx.supertab.co",
        data: {
          status: "payment_completed",
        },
      });

      expect(async () => await payment).not.toThrow(Error);
    });

    test("throw an error if not authenticated", () => {
      const { client } = setup({ authenticated: false });
      expect(async () => await client.payTab("test-tab-id")).toThrow(
        /Missing auth/,
      );
    });

    test("throw an error if checkout page fails", async () => {
      const { client, checkoutWindow, emitter } = setup();

      expect(async () => {
        const payment = client.payTab("test-tab-id");

        //wait a tick to interact with the window
        await nextTick();

        emitter.emit("message", {
          source: checkoutWindow,
          origin: "https://checkout.sbx.supertab.co",
          data: {
            status: "something else",
          },
        });

        await payment;
      }).toThrow(/Payment failed/);
    });

    test("throw an error if checkout page closes", async () => {
      const { client, checkoutWindow } = setup();
      checkoutWindow.closed = true;

      const payment = new Promise((resolve) => {
        return client.payTab("test-tab-id").then(resolve);
      });

      payment.then((res) => {
        expect(res).toEqual({ error: "Window closed" });
      });
    });

    test("throw an error if tab is not 'full'", async () => {
      const { client } = setup();

      server.withGetTabById({
        id: "test-tab-id",
        createdAt: new Date("2023-11-03T15:34:44.852Z"),
        updatedAt: new Date("2023-11-03T15:34:44.852Z"),
        merchantId: "test-merchant-id",
        userId: "test-user-id",
        status: "open",
        paidAt: null,
        total: 50,
        limit: 500,
        currency: "USD",
        paymentModel: "pay_later",
        purchases: [],
        testMode: false,
        tabStatistics: {},
      });

      expect(async () => {
        const payment = client.payTab("test-tab-id");

        await payment;
      }).toThrow(/Tab is not full/);
    });
  });

  describe(".purchase", () => {
    const tabData: TabResponse = {
      id: "test-tab-id",
      createdAt: new Date("2023-11-03T15:34:44.852Z"),
      updatedAt: new Date("2023-11-03T15:34:44.852Z"),
      merchantId: "test-merchant-id",
      userId: "test-user-id",
      status: "open",
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
    };

    const tabMetaData = {
      count: 1,
      perPage: 1,
      links: {
        previous: "",
        next: "",
      },
      numberPages: 1,
    };

    test("creates a purchase", async () => {
      const { client } = setup();

      server.withGetTab({
        data: [tabData],
        metadata: tabMetaData,
      });

      server.withPurchase({
        detail: {
          itemAdded: true,
        },
        tab: tabData,
      });

      expect(
        await client.purchase({
          offeringId: "test-offering-id",
          preferredCurrencyCode: "USD",
        }),
      ).toEqual({
        itemAdded: true,
        tab: {
          currency: "USD",
          id: "test-tab-id",
          limit: {
            amount: 500,
            text: "$5",
          },
          status: "open",
          total: {
            amount: 50,
            text: "$0.50",
          },
        },
      });
    });

    test("creates a purchase in tab currency if found no matter what is preferred currency", async () => {
      const { client } = setup();

      const euroTabData = { ...tabData, currency: "EUR" };

      server.withGetTab({
        data: [euroTabData],
        metadata: tabMetaData,
      });

      server.withPurchase({
        detail: {
          itemAdded: true,
        },
        tab: euroTabData,
      });

      expect(
        await client.purchase({
          offeringId: "test-offering-id",
          preferredCurrencyCode: "USD",
        }),
      ).toEqual({
        itemAdded: true,
        tab: {
          currency: "EUR",
          id: "test-tab-id",
          limit: {
            amount: 500,
            text: "€5",
          },
          status: "open",
          total: {
            amount: 50,
            text: "€0.50",
          },
        },
      });
    });

    test("creates a purchase in suggested currency if tab is not found", async () => {
      const { client } = setup({
        clientConfigProps: { suggestedCurrency: "BRL" },
      });

      server.withGetTab({
        data: [],
        metadata: tabMetaData,
      });

      server.withPurchase({
        detail: {
          itemAdded: true,
        },
        tab: {
          ...tabData,
          currency: "BRL",
        },
      });

      expect(await client.purchase({ offeringId: "test-offering-id" })).toEqual(
        {
          itemAdded: true,
          tab: {
            currency: "BRL",
            id: "test-tab-id",
            limit: {
              amount: 500,
              text: "R$5",
            },
            status: "open",
            total: {
              amount: 50,
              text: "R$0.50",
            },
          },
        },
      );
    });

    test("handle tab being full", async () => {
      const { client } = setup();

      server.withGetTab({
        data: [tabData],
        metadata: tabMetaData,
      });

      server.withPurchase(
        {
          detail: {
            itemAdded: false,
          },
          tab: {
            ...tabData,
            status: TabStatus.Full,
          },
        },
        402,
      );

      expect(
        await client.purchase({
          offeringId: "test-offering-id",
          preferredCurrencyCode: "USD",
        }),
      ).toEqual({
        itemAdded: false,
        tab: {
          currency: "USD",
          id: "test-tab-id",
          limit: {
            amount: 500,
            text: "$5",
          },
          status: "full",
          total: {
            amount: 50,
            text: "$0.50",
          },
        },
      });
    });

    test("throws an error when there is an error", () => {
      const { client } = setup();

      server.withGetTab({
        data: [tabData],
        metadata: tabMetaData,
      });

      server.withPurchase({} as never, 500);

      expect(
        async () =>
          await client.purchase({
            offeringId: "test-offering-id",
            preferredCurrencyCode: "USD",
          }),
      ).toThrow();
    });
  });

  describe(".formatAmount", () => {
    test("formats price", async () => {
      const { client } = setup();

      expect(await client.formatAmount(100, "USD")).toBe("$1.00");
    });

    test("formats price based on the locale", async () => {
      const { client } = setup({ language: "de-DE" });

      expect(await client.formatAmount(250, "USD")).toBe("2,50 $");
    });

    test("throws an error if currency is empty", async () => {
      const { client } = setup();

      expect(async () => await client.formatAmount(0, "")).toThrow();
    });

    test("throws an error if currency is unknown", async () => {
      const { client } = setup();

      expect(async () => await client.formatAmount(0, "ABC")).toThrow();
    });
  });
});
