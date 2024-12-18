import {
  AUTH_URL,
  TOKEN_URL,
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
  TabResponse,
  PurchaseOutcome,
} from "@getsupertab/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken, AuthStatus } from "./auth";
import { DEFAULT_CURRENCY, formatPrice } from "./price";
import {
  Authenticable,
  FormattedTab,
  PublicCurrencyDetails,
  ScreenHint,
  SystemUrls,
} from "./types";
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
  private systemUrls: SystemUrls;

  constructor(options: {
    clientId: string;
    language?: string;
    preferredCurrencyCode?: string;
    systemUrls?: SystemUrls;
  }) {
    this.clientId = options.clientId;
    this.language = options.language || window.navigator.language;
    this.preferredCurrencyCode = options.preferredCurrencyCode;
    this.systemUrls = options.systemUrls || {
      authUrl: AUTH_URL,
      tokenUrl: TOKEN_URL,
      ssoBaseUrl: SSO_BASE_URL,
      tapiBaseUrl: TAPI_BASE_URL,
      checkoutBaseUrl: CHECKOUT_BASE_URL,
    };
    this.tapperConfig = new Configuration({
      basePath: this.systemUrls.tapiBaseUrl,
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
      authUrl: this.systemUrls.authUrl,
      tokenUrl: this.systemUrls.tokenUrl,
      redirectUri: `${this.systemUrls.ssoBaseUrl}/oauth2/auth-proxy?origin=${
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
    const user = await new UserIdentityApi(this.tapperConfig).getIdentityMeV1();

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
    let tab = null;

    /* eslint-disable */
    try {
      tab = await this.getTab();
    } catch (e) {}
    /* eslint-enable */

    const presentedCurrency =
      tab?.currency.isoCode ??
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
        currency: getPublicCurrencyDetails(currency),
        text,
      };
    };

    const offerings = clientConfig.offerings
      .filter((eachOffering) => !!currenciesByCode[eachOffering.price.currency])
      // Format all offerings
      .map((eachOffering) => {
        const prices = eachOffering.prices?.map((eachPrice) =>
          getPrice(eachOffering, eachPrice),
        );

        let connectedSubscriptionOffering;
        // If the offering has a connected subscription offering, store the id
        // temporarily to be able to find the formatted connected subscription
        // offering in the next map function.
        if (eachOffering.connectedSubscriptionOffering?.id) {
          connectedSubscriptionOffering = {
            id: eachOffering.connectedSubscriptionOffering.id,
          };
        }

        return {
          id: eachOffering.id,
          description: eachOffering.description,
          salesModel: eachOffering.salesModel,
          paymentModel: eachOffering.paymentModel,
          price: getPrice(eachOffering, eachOffering.price, presentedCurrency),
          prices,
          timePassDetails: eachOffering.timePassDetails,
          recurringDetails: eachOffering.recurringDetails,
          connectedSubscriptionOffering,
        };
      })
      // Add potential connected subscription offerings
      .map((eachOffering, _, offerings) => {
        let connectedSubscriptionOffering;
        // If the offering has a connected subscription offering, find the
        // formatted connected subscription offering and add it to the offering.
        if (eachOffering.connectedSubscriptionOffering) {
          connectedSubscriptionOffering = offerings.find(
            (offering) =>
              offering.id === eachOffering.connectedSubscriptionOffering?.id,
          );
        }
        return {
          ...eachOffering,
          connectedSubscriptionOffering,
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
        access: {
          validTo: access.access.validTo
            ? new Date(access.access.validTo * 1000)
            : undefined,
          isSubscription: !!access.access.subscriptionId,
        },
      };
    }

    return {
      access: null,
    };
  }

  @authenticated
  async getTab(): Promise<FormattedTab | null> {
    const clientConfig = await this.#getClientConfig();
    const {
      data: [tab],
    } = await new TabsApi(this.tapperConfig).paginatedTabsListUserV1({
      limit: 1,
      paymentModel: "pay_later",
    });

    const filterStatuses: TabStatus[] = [TabStatus.Open, TabStatus.Full];

    if (filterStatuses.includes(tab?.status)) {
      return this.formatTab({ tab, clientConfig });
    }
    return null;
  }

  openCheckoutWindow() {
    return openBlankChildWindow({
      width: 488,
      height: 800,
      target: "supertabCheckout",
    });
  }

  @authenticated
  async payTab(
    id: string,
  ): Promise<
    | { status: "success"; tab: FormattedTab }
    | { status: "error"; error: string }
  > {
    const checkoutWindow = this.openCheckoutWindow();

    const tab = await new TabsApi(this.tapperConfig).tabViewV1({
      tabId: id,
    });

    const url = new URL(this.systemUrls.checkoutBaseUrl);
    url.searchParams.append("tab_id", id);
    url.searchParams.append("language", this.language);
    url.searchParams.append("testmode", tab.testMode ? "true" : "false");

    return handleChildWindow({
      url,
      childWindow: checkoutWindow,
      onMessage: async (ev) => {
        if (
          ev.data.status !== "payment_completed" ||
          ev.origin !== url.origin
        ) {
          throw new Error("Payment failed");
        }

        const [tab, clientConfig] = await Promise.all([
          new TabsApi(this.tapperConfig).tabViewV1({
            tabId: id,
          }),
          this.#getClientConfig(),
        ]);

        return {
          status: "success",
          tab: this.formatTab({ tab, clientConfig }),
        };
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
  }): Promise<{
    itemAdded: boolean;
    purchaseOutcome: PurchaseOutcome | null;
    tab: FormattedTab;
  }> {
    const tab = await this.getTab();
    const clientConfig = await this.#getClientConfig();
    const currency =
      tab?.currency.isoCode ||
      preferredCurrencyCode ||
      clientConfig.suggestedCurrency ||
      DEFAULT_CURRENCY;

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

      return {
        itemAdded: !!detail?.itemAdded,
        purchaseOutcome: detail?.purchaseOutcome || null,
        tab: this.formatTab({ tab, clientConfig }),
      };
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 402) {
        const { tab, detail } = PurchaseOfferingResponseFromJSON(
          await e.response.json(),
        );
        return {
          itemAdded: !!detail?.itemAdded,
          purchaseOutcome: detail?.purchaseOutcome || null,
          tab: this.formatTab({ tab, clientConfig }),
        };
      }

      throw e;
    }
  }

  async openAboutSupertab() {
    const url = new URL("https://supertab.co/personal");
    window.open(url, "_blank");
  }

  async formatAmount(amount: number, currency: string) {
    if (amount === undefined) {
      throw new Error("Missing amount");
    }

    const clientConfig = await this.#getClientConfig();
    const currencyObject = clientConfig.currencies.find(
      (eachCurrency) => eachCurrency.isoCode === currency,
    );

    if (!currencyObject) {
      throw new Error("Currency not found");
    }

    return formatPrice({
      amount,
      currency: currencyObject.isoCode,
      baseUnit: currencyObject.baseUnit,
      localeCode: this.language,
      showZeroFractionDigits: true,
      showSymbol: true,
    });
  }

  formatTab({
    tab,
    clientConfig,
  }: {
    tab: TabResponse;
    clientConfig: ClientConfig;
  }) {
    const currencyObject = clientConfig.currencies.find(
      (currency) => currency.isoCode === tab.currency,
    );
    if (!currencyObject) {
      throw new Error("Currency details not found for isoCode" + tab.currency);
    }
    const priceToText = (amount: number) =>
      formatPrice({
        amount,
        currency: currencyObject.isoCode,
        baseUnit: currencyObject.baseUnit,
        localeCode: this.language,
        showZeroFractionDigits: false,
        showSymbol: currencyObject.isoCode !== "CHF",
      });

    const formattedTab = {
      id: tab.id,
      status: tab.status,
      total: {
        amount: tab.total,
        text: priceToText(tab.total),
      },
      limit: {
        amount: tab.limit,
        text: priceToText(tab.limit),
      },
      currency: getPublicCurrencyDetails(currencyObject),
      paymentModel: tab.paymentModel,
      purchases: tab.purchases.map((purchase) => {
        if (purchase.price.currency !== currencyObject.isoCode) {
          throw new Error(
            "Currency mismatch: Expected tab currency " +
              tab.currency +
              " and purchase currency " +
              purchase.price.currency +
              " to be equal.",
          );
        }
        return {
          id: purchase.id,
          purchaseDate: purchase.purchaseDate,
          summary: purchase.summary,
          price: {
            amount: purchase.price.amount,
            text: priceToText(purchase.price.amount),
            currency: getPublicCurrencyDetails(currencyObject),
          },
          validTo: purchase.validTo,
          recurringDetails: purchase.recurringDetails,
        };
      }),
    };
    return formattedTab;
  }
}

function getPublicCurrencyDetails(currency: Currency): PublicCurrencyDetails {
  return {
    isoCode: currency.isoCode,
    baseUnit: currency.baseUnit,
  };
}
