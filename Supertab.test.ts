import { test, expect, describe, mock, beforeEach } from "bun:test";
import { server } from "@/mocks/server";
import EventEmitter from "events";
import Supertab from ".";
import {
  ClientConfig,
  ClientExperiencesConfig,
  Currency,
  CurrencyOperationalStatus,
  CurrencyRoundingRule,
  ExperienceType,
  Price,
  PurchaseDetail,
  PurchaseOutcome,
  SiteOffering,
  TabResponsePurchaseEnhanced,
  TabStatus,
  UserResponse,
} from "@getsupertab/tapper-sdk";

const setup = ({
  authenticated = true,
  authExpiresIn = 100000,
  language = "en-US",
  preferredCurrencyCode,
  clientConfigProps,
  hasExperiences = true,
}: {
  authenticated?: boolean;
  authExpiresIn?: number;
  language?: string;
  preferredCurrencyCode?: string;
  clientConfigProps?: {
    offeringCurrency?: string;
    suggestedCurrency?: string;
  };
  hasExperiences?: boolean;
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

  const clientConfig = {
    contentKeys: [
      {
        productId: "product.test-product-id",
        offeringIds: ["offering.test-offering-id"],
        contentKey: "test-content-key",
        contentKeyRequired: true,
      },
    ],
    redirectUri: "",
    siteName: "",
    offerings: [
      {
        id: "test-offering-id",
        description: "Test Offering Description",
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
        deletedAt: null,
        productId: "test-product-id",
        salesModel: "time_pass",
        paymentModel: "pay_later",
        summary: "test-summary",
        price: {
          amount: 100,
          currency: clientConfigProps?.offeringCurrency ?? "USD",
        },
        prices: [
          {
            amount: 100,
            currency: "USD",
          },
          {
            amount: 100,
            currency: "EUR",
          },
          {
            amount: 100,
            currency: "BRL",
          },
        ] as Price[],
        recurringDetails: null,
        timePassDetails: null,
        offeringPrices: [
          {
            id: "test-offering-price",
            createdAt: new Date("2021-01-01T00:00:00.000Z"),
            updatedAt: new Date("2021-01-01T00:00:00.000Z"),
            offeringId: "test-offering-id",
            price: {
              amount: 100,
              currency: clientConfigProps?.offeringCurrency ?? "USD",
            },
          },
        ],
        isActive: true,
        subscriptionOfferingId: null,
        connectedSubscriptionOffering: null,
      },
    ] as SiteOffering[],
    currencies: [
      {
        isoCode: "USD",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      {
        isoCode: "EUR",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      {
        isoCode: "BRL",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
    ] as Currency[],
    suggestedCurrency: clientConfigProps?.suggestedCurrency ?? "USD",
  } as ClientConfig;

  server.withClientConfig(clientConfig);

  const experience = {
    id: "test-experience-1",
    name: "My Experience",
    type: ExperienceType.BasicPaygate,
    paygateRedirectUrl: "https://example.com",
    uiConfig: {},
    product: {
      id: "test-product",
      name: "Test Product",
      contentKey: "test-content-key",
      contentKeyRequired: true,
    },
    offerings: [
      {
        id: "test-offering-id",
        description: "Test Offering Description",
        salesModel: "time_pass",
        paymentModel: "pay_later",
        suggestedCurrencyPrice: {
          amount: 100,
          currency: clientConfigProps?.offeringCurrency ?? "USD",
        },
        prices: [
          {
            amount: 100,
            currency: "USD",
          },
          {
            amount: 100,
            currency: "EUR",
          },
          {
            amount: 100,
            currency: "BRL",
          },
        ] as Price[],
        recurringDetails: undefined,
        timePassDetails: {
          validTimedelta: "1d",
        },
      },
    ],
    upsells: [],
  };

  const clientExperiencesConfig = {
    redirectUri: "",
    siteName: "",
    siteLogoUrl: "",
    experiences: hasExperiences
      ? [experience, { ...experience, id: "test-experience-2" }]
      : [],
    currencies: [
      {
        id: "usd-currency",
        name: "US Dollar",
        symbol: "$",
        isMainCurrency: true,
        operationalStatus: CurrencyOperationalStatus.Active,
        tabLimit: 500,
        firstTabLimit: 100,
        googlePayoutsEnabled: true,
        exchangeRate: 1,
        roundingRule: CurrencyRoundingRule.Hundredth,
        isoCode: "USD",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      {
        id: "eur-currency",
        name: "Euro",
        symbol: "€",
        isMainCurrency: false,
        operationalStatus: CurrencyOperationalStatus.Active,
        tabLimit: 500,
        firstTabLimit: 100,
        googlePayoutsEnabled: false,
        exchangeRate: 1,
        roundingRule: CurrencyRoundingRule.Hundredth,
        isoCode: "EUR",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      {
        id: "brl-currency",
        name: "Brazilian real",
        symbol: "$R",
        isMainCurrency: false,
        operationalStatus: CurrencyOperationalStatus.Active,
        tabLimit: 500,
        firstTabLimit: 100,
        googlePayoutsEnabled: false,
        exchangeRate: 1,
        roundingRule: CurrencyRoundingRule.Hundredth,
        isoCode: "BRL",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
      {
        id: "chf-currency",
        name: "Swiss Franc",
        symbol: "",
        isMainCurrency: false,
        operationalStatus: CurrencyOperationalStatus.Active,
        tabLimit: 500,
        firstTabLimit: 100,
        googlePayoutsEnabled: false,
        exchangeRate: 1,
        roundingRule: CurrencyRoundingRule.Hundredth,
        isoCode: "CHF",
        baseUnit: 100,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      },
    ] as Currency[],
    suggestedCurrency: clientConfigProps?.suggestedCurrency ?? "USD",
  } as ClientExperiencesConfig;

  server.withClientExperiencesConfig(clientExperiencesConfig);

  return {
    client,
    windowOpen,
    checkoutWindow,
    clientConfig,
    clientExperiencesConfig,
    emitter,
  };
};

function createTabData(currency: string): TabResponsePurchaseEnhanced {
  return {
    id: "test-tab-id",
    guestEmail: null,
    closesAt: new Date("2024-01-08T15:34:44.852Z"),
    createdAt: new Date("2023-11-03T15:34:44.852Z"),
    updatedAt: new Date("2023-11-03T15:34:44.852Z"),
    merchantId: "test-merchant-id",
    userId: "test-user-id",
    status: "open",
    paidAt: null,
    total: 50,
    limit: 500,
    currency,
    paymentModel: "pay_later",
    purchases: [
      {
        id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
        createdAt: new Date("2023-11-03T15:34:44.852Z"),
        updatedAt: new Date("2023-11-03T15:34:44.852Z"),
        purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
        purchaseIntentItemId: "test-purchase-intent-item-id",
        merchantId: "test-merchant-id",
        summary: "test-summary",
        price: {
          amount: 50,
          currency,
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
        validFrom: null,
        validTo: null,
        validTimedelta: null,
        recurringDetails: null,
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
  };
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
        email: "test@supertab.co",
        registrationOrigin: "supertab",
        isSuperuser: false,
        tabCurrency: "USD",
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
    const prices = [
      {
        amount: 100,
        currency: {
          isoCode: "USD",
          baseUnit: 100,
        },
        text: "$1.00",
      },
      {
        amount: 100,
        currency: {
          isoCode: "EUR",
          baseUnit: 100,
        },
        text: "€1.00",
      },
      {
        amount: 100,
        currency: {
          isoCode: "BRL",
          baseUnit: 100,
        },
        text: "R$1.00",
      },
    ];

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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "EUR",
                baseUnit: 100,
              },
              text: "€1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "USD",
                baseUnit: 100,
              },
              text: "$1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "BRL",
                baseUnit: 100,
              },
              text: "R$1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
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
              guestEmail: null,
              closesAt: new Date("2025-01-08T15:34:44.852Z"),
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
                  purchaseIntentItemId: "test-purchase-intent-item-id",
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
                  validFrom: null,
                  validTo: null,
                  validTimedelta: null,
                  recurringDetails: null,
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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "EUR",
                baseUnit: 100,
              },
              text: "€1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "EUR",
                baseUnit: 100,
              },
              text: "€1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
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
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: {
                isoCode: "EUR",
                baseUnit: 100,
              },
              text: "€1.00",
            },
            prices,
            recurringDetails: null,
            timePassDetails: null,
            connectedSubscriptionOffering: undefined,
          },
        ]);
      });
    });
  });

  describe(".checkAccess", () => {
    test("return access granted", async () => {
      const { client } = setup();

      server.withAccessCheck({
        access: {
          status: "Granted",
          contentKey: "test-content-key",
          validTo: 1700119519,
        },
      });

      expect(await client.checkAccess("test-content-key")).toEqual({
        access: {
          contentKey: "test-content-key",
          validTo: new Date(1700119519 * 1000),
          isSubscription: false,
        },
      });
    });

    test("set flag `isSubscription` for subscription based access", async () => {
      const { client } = setup();

      server.withAccessCheck({
        access: {
          status: "Granted",
          contentKey: "test-content-key",
          validTo: 1700119519,
          subscriptionId: "test-subscription-id",
        },
      });

      expect(await client.checkAccess("test-content-key")).toEqual({
        access: {
          contentKey: "test-content-key",
          validTo: new Date(1700119519 * 1000),
          isSubscription: true,
        },
      });
    });

    test("return empty access if no access is found", async () => {
      const { client } = setup();

      server.withAccessCheck({
        access: undefined,
      });

      expect(await client.checkAccess("test-content-key")).toEqual({
        access: null,
      });
    });

    test("use content key from client config if no content key is provided", async () => {
      const { client } = setup();

      server.withClientConfig({
        contentKeys: [
          {
            contentKey: "test-content-key-2",
            offeringIds: ["test-offering-id"],
            productId: "test-product-id",
            contentKeyRequired: true,
          },
        ],
        redirectUri: "",
        siteName: "",
        offerings: [
          {
            id: "test-offering-id",
            description: "Test Offering Description",
            createdAt: new Date("2023-11-03T15:34:44.852Z"),
            updatedAt: new Date("2023-11-03T15:34:44.852Z"),
            deletedAt: null,
            salesModel: "time_pass",
            paymentModel: "pay_later",
            price: {
              amount: 100,
              currency: "USD",
            },
            prices: [
              {
                amount: 100,
                currency: "USD",
              },
              {
                amount: 100,
                currency: "EUR",
              },
              {
                amount: 100,
                currency: "BRL",
              },
            ],
            offeringPrices: [
              {
                id: "test-offering-price",
                createdAt: new Date("2023-11-03T15:34:44.852Z"),
                updatedAt: new Date("2023-11-03T15:34:44.852Z"),
                price: {
                  amount: 100,
                  currency: "USD",
                },
              },
            ],
            isActive: true,
            connectedSubscriptionOffering: null,
            subscriptionOfferingId: null,
          } as SiteOffering,
        ],
        currencies: [
          {
            isoCode: "USD",
            baseUnit: 100,
            createdAt: new Date("2023-11-03T15:34:44.852Z"),
            updatedAt: new Date("2023-11-03T15:34:44.852Z"),
          },
        ] as Currency[],
        suggestedCurrency: "USD",
      });

      server.withAccessCheck({ access: undefined });

      await client.checkAccess();

      expect(server.getLastAccessCheckRequest().contentKey).toBe(
        "test-content-key-2",
      );
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
              guestEmail: null,
              closesAt: new Date("2024-01-08T15:34:44.852Z"),
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
                  purchaseIntentItemId: "test-purchase-intent-item-id",
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
                  validFrom: null,
                  validTo: null,
                  validTimedelta: null,
                  recurringDetails: null,
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
          currency: {
            isoCode: "USD",
            baseUnit: 100,
          },
          paymentModel: "pay_later",
          purchases: [
            {
              id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              summary: "test-summary",
              recurringDetails: null,
              validTo: null,
              price: {
                amount: 50,
                currency: {
                  isoCode: "USD",
                  baseUnit: 100,
                },
                text: "$0.50",
              },
            },
          ],
        });
      },
    );

    test("return null if no tabs", async () => {
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

      expect(await client.getTab()).toBeNull();
    });

    test("return null if no open tab", async () => {
      const { client } = setup();

      server.withGetTab({
        data: [
          {
            id: "test-tab-id",
            guestEmail: null,
            closesAt: new Date("2024-01-08T15:34:44.852Z"),
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
                purchaseIntentItemId: "test-purchase-intent-item-id",
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
                validFrom: null,
                validTo: null,
                validTimedelta: null,
                recurringDetails: null,
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

      expect(await client.getTab()).toBeNull();
    });
  });

  describe(".getTabs", () => {
    const createTabsResponse = (currency: string, count: number) => ({
      data: Array(count).fill(createTabData(currency)),
      metadata: {
        count,
        perPage: count,
        links: { previous: "", next: "" },
        numberPages: 1,
      },
    });

    beforeEach(() => {
      // Default setup with no tabs
      server.withGetTab({
        data: [],
        metadata: {
          count: 0,
          perPage: 1,
          links: { previous: "", next: "" },
          numberPages: 0,
        },
      });
    });

    test("returns empty array when no tabs exist", async () => {
      const { client } = setup();

      server.withGetTab({
        data: [],
        metadata: {
          count: 0,
          perPage: 1,
          links: { previous: "", next: "" },
          numberPages: 0,
        },
      });

      const tabs = await client.getTabs();
      expect(tabs).toEqual([]);
    });

    test("returns formatted tabs with default parameters", async () => {
      const { client } = setup();
      const tabsResponse = createTabsResponse("USD", 1);

      server.withGetTab(tabsResponse);

      const tabs = await client.getTabs();

      expect(tabs).toEqual([
        {
          id: "test-tab-id",
          status: "open",
          total: {
            amount: 50,
            text: "$0.50",
          },
          limit: {
            amount: 500,
            text: "$5",
          },
          currency: {
            isoCode: "USD",
            baseUnit: 100,
          },
          paymentModel: "pay_later",
          purchases: [
            {
              id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              summary: "test-summary",
              price: {
                amount: 50,
                text: "$0.50",
                currency: {
                  isoCode: "USD",
                  baseUnit: 100,
                },
              },
              validTo: null,
              recurringDetails: null,
            },
          ],
        },
      ]);
    });

    test("respects custom limit parameter", async () => {
      const { client } = setup();
      const tabsResponse = createTabsResponse("USD", 10);

      server.withGetTab(tabsResponse);

      const tabs = await client.getTabs({ limit: 10 });
      expect(tabs).toHaveLength(10);
    });

    test("formats tabs with different currencies", async () => {
      const { client } = setup();
      const tabsResponse = {
        data: [
          createTabData("USD"),
          createTabData("EUR"),
          createTabData("BRL"),
        ],
        metadata: {
          count: 3,
          perPage: 3,
          links: { previous: "", next: "" },
          numberPages: 1,
        },
      };

      server.withGetTab(tabsResponse);

      const tabs = await client.getTabs({ limit: 3 });

      expect(tabs[0].currency.isoCode).toBe("USD");
      expect(tabs[1].currency.isoCode).toBe("EUR");
      expect(tabs[2].currency.isoCode).toBe("BRL");
    });

    test("throws error when not authenticated", async () => {
      const { client } = setup({ authenticated: false });

      await expect(async () => client.getTabs()).toThrow(
        "Missing auth: getTabs",
      );
    });
  });

  describe(".payTab", () => {
    beforeEach(() => {
      server.withGetTabById({
        id: "test-tab-id",
        guestEmail: null,
        closesAt: new Date("2023-01-08T15:34:44.852Z"),
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
        tabStatistics: {
          purchasesCount: 0,
          obfuscatedPurchasesCount: null,
          obfuscatedPurchasesTotal: null,
        },
        metadata: {
          additionalProp1: {},
          additionalProp2: {},
          additionalProp3: {},
        },
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
  });

  describe(".purchase", () => {
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
        data: [createTabData("USD")],
        metadata: tabMetaData,
      });

      server.withPurchase({
        detail: {
          itemAdded: true,
          purchaseOutcome: PurchaseOutcome.Added,
        } as PurchaseDetail, // PurchaseDetail in @getsupertab/tapper-sdk@10.0.0 requires both `purchaseStatus` (deprecated) and `purchaseOutcome`. `purchaseStatus` is not an optional property, hence `as` here.
        tab: createTabData("USD"),
      });

      expect(
        await client.purchase({
          offeringId: "test-offering-id",
          preferredCurrencyCode: "USD",
        }),
      ).toEqual({
        itemAdded: true,
        purchaseOutcome: PurchaseOutcome.Added,
        tab: {
          currency: {
            isoCode: "USD",
            baseUnit: 100,
          },
          id: "test-tab-id",
          paymentModel: "pay_later",
          limit: {
            amount: 500,
            text: "$5",
          },
          purchases: [
            {
              id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
              price: {
                amount: 50,
                currency: {
                  isoCode: "USD",
                  baseUnit: 100,
                },
                text: "$0.50",
              },
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              recurringDetails: null,
              summary: "test-summary",
              validTo: null,
            },
          ],
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

      const euroTabData = createTabData("EUR");

      server.withGetTab({
        data: [euroTabData],
        metadata: tabMetaData,
      });

      server.withPurchase({
        detail: {
          itemAdded: true,
          purchaseOutcome: PurchaseOutcome.Added,
        } as PurchaseDetail,
        tab: euroTabData,
      });

      expect(
        await client.purchase({
          offeringId: "test-offering-id",
          preferredCurrencyCode: "USD",
        }),
      ).toEqual({
        itemAdded: true,
        purchaseOutcome: PurchaseOutcome.Added,
        tab: {
          currency: {
            isoCode: "EUR",
            baseUnit: 100,
          },
          id: "test-tab-id",
          paymentModel: "pay_later",
          limit: {
            amount: 500,
            text: "€5",
          },
          purchases: [
            {
              id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
              price: {
                amount: 50,
                currency: {
                  isoCode: "EUR",
                  baseUnit: 100,
                },
                text: "€0.50",
              },
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              recurringDetails: null,
              summary: "test-summary",
              validTo: null,
            },
          ],
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
          purchaseOutcome: PurchaseOutcome.Added,
        } as PurchaseDetail,
        tab: createTabData("BRL"),
      });

      expect(await client.purchase({ offeringId: "test-offering-id" })).toEqual(
        {
          itemAdded: true,
          purchaseOutcome: PurchaseOutcome.Added,
          tab: {
            currency: {
              isoCode: "BRL",
              baseUnit: 100,
            },
            id: "test-tab-id",
            limit: {
              amount: 500,
              text: "R$5",
            },
            paymentModel: "pay_later",
            purchases: [
              {
                id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
                price: {
                  amount: 50,
                  currency: {
                    isoCode: "BRL",
                    baseUnit: 100,
                  },
                  text: "R$0.50",
                },
                purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
                recurringDetails: null,
                summary: "test-summary",
                validTo: null,
              },
            ],
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
        data: [createTabData("USD")],
        metadata: tabMetaData,
      });

      server.withPurchase(
        {
          detail: {
            itemAdded: false,
            purchaseOutcome: PurchaseOutcome.Added,
          } as PurchaseDetail,
          tab: {
            ...createTabData("USD"),
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
        purchaseOutcome: PurchaseOutcome.Added,
        tab: {
          currency: {
            isoCode: "USD",
            baseUnit: 100,
          },
          id: "test-tab-id",
          paymentModel: "pay_later",
          limit: {
            amount: 500,
            text: "$5",
          },
          purchases: [
            {
              id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
              price: {
                amount: 50,
                currency: {
                  isoCode: "USD",
                  baseUnit: 100,
                },
                text: "$0.50",
              },
              purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
              recurringDetails: null,
              summary: "test-summary",
              validTo: null,
            },
          ],
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
        data: [createTabData("USD")],
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

  describe(".getExperience", () => {
    beforeEach(() => {
      server.withGetTab({
        data: [],
        metadata: {
          count: 0,
          perPage: 1,
          links: { previous: "", next: "" },
          numberPages: 0,
        },
      });
    });

    test("return null if no experience is found", async () => {
      const { client } = setup({ hasExperiences: false });

      expect(await client.getExperience()).toBeNull();
    });

    test("return first experience if id is not supplied", async () => {
      const { client } = setup();

      expect(await client.getExperience()).toMatchSnapshot();
    });

    test("return experience by id", async () => {
      const { client } = setup();

      expect(
        await client.getExperience({ id: "test-experience-2" }),
      ).toMatchSnapshot();
    });

    test("returns null for non-existent experience id", async () => {
      const { client } = setup();
      expect(await client.getExperience({ id: "non-existent-id" })).toBeNull();
    });

    describe("with no tab", () => {
      test("uses provided language for price formatting", async () => {
        const { client } = setup();

        const experience = await client.getExperience({ language: "de-DE" });

        expect(experience?.offerings[0].price.text).toBe("1,00\u00A0$");
      });

      test("uses provided preferred currency", async () => {
        const { client } = setup();

        const experience = await client.getExperience({
          preferredCurrencyCode: "EUR",
        });

        expect(experience?.offerings[0].price.currency.isoCode).toBe("EUR");
        expect(experience?.offerings[0].price.text).toBe("€1.00");
      });

      test("uses suggested currency when no tab or preferred currency", async () => {
        const { client } = setup({
          clientConfigProps: { suggestedCurrency: "EUR" },
        });

        const experience = await client.getExperience();

        expect(experience?.offerings[0].price.currency.isoCode).toBe("EUR");
        expect(experience?.offerings[0].price.text).toBe("€1.00");
      });
    });

    describe("with tab", () => {
      beforeEach(() => {
        server.withGetTab({
          data: [createTabData("BRL")],
          metadata: {
            count: 0,
            perPage: 1,
            links: { previous: "", next: "" },
            numberPages: 0,
          },
        });
      });

      test("handles tab currency when tab exists", async () => {
        const { client } = setup();

        server.withGetTab({
          data: [createTabData("BRL")],
          metadata: {
            count: 1,
            perPage: 1,
            links: { previous: "", next: "" },
            numberPages: 1,
          },
        });

        const experience = await client.getExperience();

        expect(experience?.offerings[0].price.currency.isoCode).toBe("BRL");
        expect(experience?.offerings[0].price.text).toBe("R$1.00");
      });
    });
  });

  describe(".getCurrencyDetails", () => {
    test("returns currency details for valid ISO code", async () => {
      const { client } = setup();

      const result = await client.getCurrencyDetails("USD");

      expect(result).toEqual({
        isoCode: "USD",
        name: "US Dollar",
        symbol: "$",
        baseUnit: 100,
        firstTabLimit: {
          amount: 100,
          text: "$1",
        },
        tabLimit: {
          amount: 500,
          text: "$5",
        },
      });
    });

    test("returns null for invalid ISO code", async () => {
      const { client } = setup();

      const result = await client.getCurrencyDetails("INVALID");

      expect(result).toBeNull();
    });

    test("uses suggested currency when no ISO code provided", async () => {
      const { client } = setup({
        clientConfigProps: { suggestedCurrency: "EUR" },
      });

      const result = await client.getCurrencyDetails();

      expect(result?.isoCode).toBe("EUR");
    });

    test("formats tab limits based on locale", async () => {
      const { client } = setup({ language: "de-DE" });

      const result = await client.getCurrencyDetails("EUR");

      expect(result).toEqual({
        isoCode: "EUR",
        name: "Euro",
        symbol: "€",
        baseUnit: 100,
        firstTabLimit: {
          amount: 100,
          text: "1\u00A0€",
        },
        tabLimit: {
          amount: 500,
          text: "5\u00A0€",
        },
      });
    });

    test("formats CHF without currency symbol", async () => {
      const { client } = setup();

      const result = await client.getCurrencyDetails("CHF");

      expect(result).toEqual({
        isoCode: "CHF",
        name: "Swiss Franc",
        symbol: "",
        baseUnit: 100,
        firstTabLimit: {
          amount: 100,
          text: "CHF\u00A01",
        },
        tabLimit: {
          amount: 500,
          text: "CHF\u00A05",
        },
      });
    });
  });

  describe(".formatTab", () => {
    test("formats tab with correct currency and amounts", () => {
      const { client, clientExperiencesConfig } = setup();

      const tab = createTabData("USD");

      const formattedTab = client.formatTab({
        tab,
        config: clientExperiencesConfig,
      });

      expect(formattedTab).toEqual({
        id: "test-tab-id",
        status: "open",
        total: {
          amount: 50,
          text: "$0.50",
        },
        limit: {
          amount: 500,
          text: "$5",
        },
        currency: {
          isoCode: "USD",
          baseUnit: 100,
        },
        paymentModel: "pay_later",
        purchases: [
          {
            id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
            purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
            summary: "test-summary",
            price: {
              amount: 50,
              text: "$0.50",
              currency: {
                isoCode: "USD",
                baseUnit: 100,
              },
            },
            validTo: null,
            recurringDetails: null,
          },
        ],
      });
    });

    test("uses client config when provided", () => {
      const { client, clientConfig } = setup();

      const tab = createTabData("USD");

      const formattedTab = client.formatTab({
        tab,
        clientConfig,
      });

      expect(formattedTab).toEqual({
        id: "test-tab-id",
        status: "open",
        total: {
          amount: 50,
          text: "$0.50",
        },
        limit: {
          amount: 500,
          text: "$5",
        },
        currency: {
          isoCode: "USD",
          baseUnit: 100,
        },
        paymentModel: "pay_later",
        purchases: [
          {
            id: "purchase.4df706b5-297a-49c5-a4cd-2a10eca12ff9",
            purchaseDate: new Date("2023-11-03T15:34:44.852Z"),
            summary: "test-summary",
            price: {
              amount: 50,
              text: "$0.50",
              currency: {
                isoCode: "USD",
                baseUnit: 100,
              },
            },
            validTo: null,
            recurringDetails: null,
          },
        ],
      });
    });

    test("throws error when config is missing", () => {
      const { client } = setup();

      const tab = createTabData("USD");

      // eslint-disable-next-line
      expect(() => client.formatTab({ tab, config: null as any })).toThrow(
        "Missing config object",
      );
    });

    test("throws error when currency is not found", () => {
      const { client, clientExperiencesConfig } = setup();

      const tab = {
        ...createTabData("USD"),
        currency: "INVALID",
      };

      expect(() =>
        client.formatTab({ tab, config: clientExperiencesConfig }),
      ).toThrow("Currency details not found");
    });

    test("throws error on currency mismatch in purchases", () => {
      const { client, clientExperiencesConfig } = setup();

      const tab = {
        ...createTabData("EUR"),
        currency: "USD",
      };

      expect(() =>
        client.formatTab({ tab, config: clientExperiencesConfig }),
      ).toThrow("Currency mismatch");
    });
  });
});
