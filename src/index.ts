import {
  AUTH_BASE_URL,
  CHECKOUT_BASE_URL,
  SSO_BASE_URL,
  TAPI_BASE_URL,
} from "@/env";
import {
  Configuration,
  InternalApi,
  UserIdentityApi,
  ItemsApi,
  Currency,
  AccessApi,
  ClientConfig,
  TabsApi,
  TabStatus,
  ResponseError,
  PurchaseOfferingResponseFromJSON,
  Price,
  SiteOffering,
} from "@laterpay/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken, AuthStatus } from "./auth";
import { DEFAULT_CURRENCY, formatPrice } from "./price";
import { Authenticable, ScreenHint } from "./types";
import { handleChildWindow, openBlankChildWindow } from "./window";

function authenticated(
  target: Authenticable,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor.value = function (...args: any[]) {
    if (target.authStatus === AuthStatus.MISSING) {
      throw new Error(`Missing auth: ${propertyKey}`);
    }
    if (target.authStatus === AuthStatus.EXPIRED) {
      throw new Error(`Expired auth: ${propertyKey}`);
    }
    if (target.authStatus !== AuthStatus.VALID) {
      throw new Error(`Invalid auth: ${propertyKey}`);
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
}

export class Supertab {
  private clientId: string;
  private tapperConfig: Configuration;
  private language: string;
  private preferredCurrencyCode: string | undefined;
  private _clientConfig?: ClientConfig;

  constructor(options: {
    clientId: string;
    language?: string;
    preferredCurrencyCode?: string;
  }) {
    this.clientId = options.clientId;
    this.language = options.language || window.navigator.language;
    this.preferredCurrencyCode = options.preferredCurrencyCode;
    this.tapperConfig = new Configuration({
      basePath: TAPI_BASE_URL,
      accessToken: () => `Bearer ${getAccessToken()}`,
    });
  }

  get authStatus() {
    return getAuthStatus();
  }

  async authorize({
    silently,
    screenHint,
    state,
    redirectUri,
  }: {
    silently?: boolean;
    screenHint?: ScreenHint;
    state?: object;
    redirectUri?: string;
  } = {}) {
    return authFlow({
      silently: !!silently,
      screenHint,
      state,
      authBaseUrl: AUTH_BASE_URL,
      redirectUri: `${SSO_BASE_URL}/oauth2/auth-proxy?origin=${
        redirectUri ?? window.location.origin
      }`,
      clientId: this.clientId,
    });
  }

  async getApiVersion() {
    const healthCheck = await new InternalApi(this.tapperConfig).health();

    return healthCheck.version;
  }

  @authenticated
  async getUser() {
    const user = await new UserIdentityApi(
      this.tapperConfig,
    ).getCurrentUserV1();

    return {
      id: user.id,
    };
  }

  async #getClientConfig() {
    if (this._clientConfig) {
      return this._clientConfig;
    }

    this._clientConfig = await new ItemsApi(
      this.tapperConfig,
    ).getClientConfigV1({
      clientId: this.clientId,
    });

    return this._clientConfig;
  }

  async getOfferings({
    language = this.language,
    preferredCurrencyCode = this.preferredCurrencyCode,
  }: { language?: string; preferredCurrencyCode?: string } = {}) {
    const clientConfig = await this.#getClientConfig();
    const presentedCurrency =
      preferredCurrencyCode ??
      clientConfig.suggestedCurrency ??
      DEFAULT_CURRENCY;

    const currenciesByCode: Record<string, Currency> =
      clientConfig.currencies.reduce(
        (acc, eachCurrency) => ({
          ...acc,
          [eachCurrency.isoCode]: eachCurrency,
        }),
        {},
      );

    const getPrice = (
      offering: SiteOffering,
      price: Price,
      currencyCode?: string,
    ) => {
      const currency =
        currenciesByCode[currencyCode ?? price.currency] ??
        currenciesByCode[DEFAULT_CURRENCY];

      const text = formatPrice({
        amount: offering.price.amount,
        currency: currency.isoCode,
        baseUnit: currency.baseUnit,
        localeCode: language,
        showZeroFractionDigits: true,
        showSymbol: currency.isoCode !== "CHF",
      });

      return {
        amount: offering.price.amount,
        currency: currency.isoCode,
        text,
      };
    };

    const offerings = clientConfig.offerings
      .filter((eachOffering) => !!currenciesByCode[eachOffering.price.currency])
      .map((eachOffering) => {
        const prices = eachOffering.prices?.map((eachPrice) =>
          getPrice(eachOffering, eachPrice),
        );
        return {
          id: eachOffering.id,
          description: eachOffering.description,
          salesModel: eachOffering.salesModel,
          price: getPrice(eachOffering, eachOffering.price, presentedCurrency),
          prices,
        };
      });

    return offerings;
  }

  @authenticated
  async checkAccess() {
    const clientConfig = await this.#getClientConfig();
    const contentKey = clientConfig.contentKeys.map(
      (item) => item.contentKey,
    )[0] as string;

    const access = await new AccessApi(this.tapperConfig).checkAccessV2({
      contentKey,
    });

    if (access.access) {
      return {
        validTo: access.access.validTo
          ? new Date(access.access.validTo * 1000)
          : undefined,
      };
    } else {
      throw new Error("Access denied");
    }
  }

  @authenticated
  async getTab() {
    const clientConfig = await this.#getClientConfig();
    const {
      data: [tab],
    } = await new TabsApi(this.tapperConfig).paginatedTabsListUserV1({
      limit: 1,
      paymentModel: "pay_later",
    });

    const filterStatuses: TabStatus[] = [TabStatus.Open, TabStatus.Full];

    if (filterStatuses.includes(tab?.status)) {
      const currencyObject = clientConfig.currencies.find(
        (currency) => currency.isoCode === tab.currency,
      );

      return {
        id: tab.id,
        status: tab.status,
        total: {
          amount: tab.total,
          text: formatPrice({
            amount: tab.total,
            currency: currencyObject?.isoCode ?? "",
            baseUnit: currencyObject?.baseUnit ?? 100,
            localeCode: this.language,
            showZeroFractionDigits: true,
            showSymbol: currencyObject?.isoCode !== "CHF",
          }),
        },
        limit: tab.limit,
        currency: tab.currency,
        purchases: tab.purchases.map((purchase) => {
          return {
            purchaseDate: purchase.purchaseDate,
            summary: purchase.summary,
            price: {
              amount: purchase.price.amount,
              text: formatPrice({
                amount: purchase.price.amount,
                currency: currencyObject?.isoCode ?? "",
                baseUnit: currencyObject?.baseUnit ?? 100,
                localeCode: this.language,
                showZeroFractionDigits: true,
                showSymbol: currencyObject?.isoCode !== "CHF",
              }),
              currency: purchase.price.currency,
            },
          };
        }),
      };
    }
  }

  @authenticated
  async payTab(id: string) {
    const checkoutWindow = openBlankChildWindow({
      width: 400,
      height: 800,
      target: "supertabCheckout",
    });

    const tab = await new TabsApi(this.tapperConfig).tabViewV1({
      tabId: id,
    });

    if (tab.status !== TabStatus.Full) {
      checkoutWindow?.close();
      throw new Error("Tab is not full");
    }

    const url = new URL(CHECKOUT_BASE_URL);
    url.searchParams.append("tab_id", id);
    url.searchParams.append("language", this.language);
    url.searchParams.append("testmode", tab.testMode ? "true" : "false");

    return handleChildWindow({
      url,
      childWindow: checkoutWindow,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMessage: async (ev): Promise<any> => {
        if (
          ev.data.status !== "payment_completed" ||
          ev.origin !== url.origin
        ) {
          throw new Error("Payment failed");
        }
      },
    });
  }

  @authenticated
  async purchase({
    offeringId,
    preferredCurrencyCode = this.preferredCurrencyCode,
  }: {
    offeringId: string;
    preferredCurrencyCode?: string;
  }) {
    const tab = await this.getTab();
    const clientConfig = await this.#getClientConfig();
    const currency = tab?.currency || preferredCurrencyCode || DEFAULT_CURRENCY;

    try {
      const { tab, detail } = await new TabsApi(
        this.tapperConfig,
      ).purchaseOfferingV1({
        offeringId,
        currency,
        purchaseOfferingRequest: {
          metadata: {},
        },
      });
      const currencyObject = clientConfig.currencies.find(
        (currency) => currency.isoCode === tab.currency,
      );

      return {
        itemAdded: detail?.itemAdded,
        tab: {
          id: tab.id,
          status: tab.status,
          total: {
            amount: tab.total,
            text: formatPrice({
              amount: tab.total,
              currency: currencyObject?.isoCode ?? "",
              baseUnit: currencyObject?.baseUnit ?? 100,
              localeCode: this.language,
              showZeroFractionDigits: true,
              showSymbol: currencyObject?.isoCode !== "CHF",
            }),
          },
          limit: tab.limit,
          currency: tab.currency,
        },
      };
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 402) {
        const { tab, detail } = PurchaseOfferingResponseFromJSON(
          await e.response.json(),
        );
        const currencyObject = clientConfig.currencies.find(
          (currency) => currency.isoCode === tab.currency,
        );

        return {
          itemAdded: detail?.itemAdded,
          tab: {
            id: tab.id,
            status: tab.status,
            total: {
              amount: tab.total,
              text: formatPrice({
                amount: tab.total,
                currency: currencyObject?.isoCode ?? "",
                baseUnit: currencyObject?.baseUnit ?? 100,
                localeCode: this.language,
                showZeroFractionDigits: true,
                showSymbol: currencyObject?.isoCode !== "CHF",
              }),
            },
            limit: tab.limit,
            currency: tab.currency,
          },
        };
      }

      throw e;
    }
  }

  async openAboutSupertab() {
    const url = new URL("https://supertab.co/personal");
    window.open(url, "_blank");
  }
}
