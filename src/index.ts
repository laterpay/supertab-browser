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
} from "@laterpay/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken, AuthStatus } from "./auth";
import { formatPrice } from "./price";
import { Authenticable } from "./types";
import { handleChildWindow } from "./window";

function authenticated(
  target: Authenticable,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

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
  private _clientConfig?: ClientConfig;

  constructor(options: { clientId: string; language?: string }) {
    this.clientId = options.clientId;
    this.language = options.language || window.navigator.language;
    this.tapperConfig = new Configuration({
      basePath: TAPI_BASE_URL,
      accessToken: () => `Bearer ${getAccessToken()}`,
    });
  }

  get authStatus() {
    return getAuthStatus();
  }

  async auth(
    {
      silently,
      screenHint,
      state,
      redirectUri,
    }: {
      silently: boolean;
      screenHint?: string;
      state?: object;
      redirectUri: string;
    } = {
      silently: false,
      redirectUri: window.location.href,
    }
  ) {
    return authFlow({
      silently,
      screenHint,
      state,
      authBaseUrl: AUTH_BASE_URL,
      redirectUri: `${SSO_BASE_URL}/oauth2/auth-proxy?origin=${redirectUri}`,
      clientId: this.clientId,
    });
  }

  async getApiVersion() {
    const healthCheck = await new InternalApi(this.tapperConfig).health();

    return healthCheck.version;
  }

  @authenticated
  async getCurrentUser() {
    const user = await new UserIdentityApi(
      this.tapperConfig
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
      this.tapperConfig
    ).getClientConfigV1({
      clientId: this.clientId,
    });

    return this._clientConfig;
  }

  async getOfferings({ language = this.language }: { language?: string } = {}) {
    const clientConfig = await this.#getClientConfig();

    const currenciesByCode: Record<string, Currency> =
      clientConfig.currencies.reduce(
        (acc, eachCurrency) => ({
          ...acc,
          [eachCurrency.isoCode]: eachCurrency,
        }),
        {}
      );

    const offerings = clientConfig.offerings.map((eachOffering) => {
      const currency = currenciesByCode[eachOffering.price.currency];

      const price = formatPrice({
        amount: eachOffering.price.amount,
        currency: currency.isoCode,
        baseUnit: currency.baseUnit,
        localeCode: language,
        showZeroFractionDigits: true,
      });

      return {
        id: eachOffering.id,
        description: eachOffering.description,
        price,
      };
    });

    return offerings;
  }

  @authenticated
  async checkAccess() {
    const clientConfig = await this.#getClientConfig();
    const contentKey = clientConfig.contentKeys.map(
      (item) => item.contentKey
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
  async getUserTab() {
    const {
      data: [tab],
    } = await new TabsApi(this.tapperConfig).paginatedTabsListUserV1({
      limit: 1,
      paymentModel: "pay_later",
    });

    const filterStatuses: TabStatus[] = [TabStatus.Open, TabStatus.Full];

    if (filterStatuses.includes(tab.status)) {
      return {
        id: tab.id,
        status: tab.status,
        total: tab.total,
        limit: tab.limit,
        currency: tab.currency,
        purchases: tab.purchases.map((purchase) => {
          return {
            purchaseDate: purchase.purchaseDate,
            summary: purchase.summary,
            price: purchase.price,
          };
        }),
      };
    } else {
      throw new Error("User has no open tabs.");
    }
  }

  @authenticated
  async pay(id: string) {
    const tab = await new TabsApi(this.tapperConfig).tabViewV1({
      tabId: id,
    });

    if (tab.status !== TabStatus.Full) {
      throw new Error("Tab is not full");
    }

    const url = new URL(CHECKOUT_BASE_URL);
    url.searchParams.append("tab_id", id);
    url.searchParams.append("language", this.language);
    url.searchParams.append("testmode", "false");

    return handleChildWindow({
      url,
      target: "supertabCheckout",
      onMessage: async (ev) => {
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
    preferredCurrency,
  }: {
    offeringId: string;
    preferredCurrency: string;
  }) {
    let currency = preferredCurrency;

    try {
      const tab = await this.getUserTab();
      currency = tab.currency;
    } catch (e) {}

    try {
      const { tab, detail } = await new TabsApi(
        this.tapperConfig
      ).purchaseOfferingV1({
        offeringId,
        currency,
        purchaseOfferingRequest: {
          metadata: {},
        },
      });

      if (tab) {
        return {
          itemAdded: detail?.itemAdded,
          tab: {
            id: tab.id,
            status: tab.status,
            total: tab.total,
            limit: tab.limit,
            currency: tab.currency,
          },
        };
      } else {
        throw new Error("Purchase failed");
      }
    } catch (e) {
      if (e instanceof ResponseError) {
        const responseError = await e.response.json();

        if (responseError.tab && responseError.tab.status === TabStatus.Full) {
          throw new Error("Tab is full. Call pay() to settle tab.");
        }

        throw new Error(responseError.error?.message);
      }
    }
  }
}
