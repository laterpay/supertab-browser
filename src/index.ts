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
  AccessApi,
  ClientConfig,
  TabsApi,
  TabStatus,
  ResponseError,
  PurchaseEventResponseFromJSON,
  TabResponse,
  PurchaseOutcome,
  ExperiencesApi,
  ClientExperiencesConfigResponse,
  PaymentModel,
  OfferingResponse,
} from "@getsupertab/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken, AuthStatus } from "./auth";
import { DEFAULT_CURRENCY, formatPrice } from "./price";
import {
  Authenticable,
  FormattedTab,
  ScreenHint,
  SystemUrls,
  UiConfig,
} from "./types";
import { handleChildWindow, openBlankChildWindow } from "./window";
import { getPublicCurrencyDetails, setupCurrencyHandling } from "./utils";

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
  private _clientExperiencesConfig?: ClientExperiencesConfigResponse;
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
    const experiencesConfig = await this.#getClientExperiencesConfig();
    return authFlow({
      silently: !!silently,
      screenHint,
      state,
      authUrl: this.systemUrls.authUrl,
      tokenUrl: this.systemUrls.tokenUrl,
      redirectUri: `${this.systemUrls.ssoBaseUrl}/oauth2/auth-proxy?origin=${
        redirectUri ?? experiencesConfig.redirectUri
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

  async #getClientExperiencesConfig() {
    if (this._clientExperiencesConfig) {
      return this._clientExperiencesConfig;
    }

    this._clientExperiencesConfig = await new ExperiencesApi(
      this.tapperConfig,
    ).getClientExperiencesConfig({
      clientId: this.clientId,
    });

    return this._clientExperiencesConfig;
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

    const { presentedCurrency, currenciesByCode, getPrice } =
      await setupCurrencyHandling({
        tab,
        preferredCurrencyCode,
        currencies: clientConfig.currencies,
        suggestedCurrency: clientConfig.suggestedCurrency,
        language,
      });

    const offerings = clientConfig.offerings
      .filter((eachOffering) => !!currenciesByCode[eachOffering.price.currency])
      // Format all offerings
      .map((eachOffering) => {
        const prices = eachOffering.prices?.map((eachPrice) =>
          getPrice(eachPrice),
        );

        const preferredCurrencyPrice = eachOffering.prices.find(
          (price) => price.currency === presentedCurrency,
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
          price: getPrice(preferredCurrencyPrice!),
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
  async checkAccess(contentKey?: string) {
    if (!contentKey) {
      const clientConfig = await this.#getClientConfig();
      contentKey = clientConfig.contentKeys.map(
        (item) => item.contentKey,
      )[0] as string;
    }

    const access = await new AccessApi(this.tapperConfig).checkAccessV2({
      contentKey,
    });

    if (access.access) {
      return {
        access: {
          contentKey: access.access.contentKey,
          validTo: access.access.validTo
            ? new Date(access.access.validTo * 1000)
            : undefined,
          isSubscription:
            !!access.access.subscriptionId &&
            access.access.subscriptionId !== "None",
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
      return this.formatTab({ tab, config: clientConfig });
    }
    return null;
  }

  @authenticated
  async getTabs(
    { limit, paymentModel }: { limit: number; paymentModel?: PaymentModel } = {
      limit: 5,
      paymentModel: PaymentModel.Later,
    },
  ): Promise<FormattedTab[]> {
    const experiencesConfig = await this.#getClientExperiencesConfig();
    const tabs = await new TabsApi(this.tapperConfig).paginatedTabsListUserV1({
      limit,
      paymentModel,
    });

    return tabs.data.map((tab) =>
      this.formatTab({ tab, config: experiencesConfig }),
    );
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
          tab: this.formatTab({ tab, config: clientConfig }),
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
        tab: this.formatTab({ tab, config: clientConfig }),
      };
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 402) {
        const { tab, detail } = PurchaseEventResponseFromJSON(
          await e.response.json(),
        );
        return {
          itemAdded: !!detail?.itemAdded,
          purchaseOutcome: detail?.purchaseOutcome || null,
          tab: this.formatTab({ tab, config: clientConfig }),
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
    config,
    clientConfig,
  }: {
    tab: TabResponse;
    config?: ClientConfig | ClientExperiencesConfigResponse;
    clientConfig?: ClientConfig; // keeping for backwards compatibility
  }) {
    const configObject = clientConfig || config;

    if (!configObject) {
      throw new Error("Missing config object");
    }

    const currencyObject = configObject.currencies.find(
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

  async getExperience({
    id,
    language = this.language,
    preferredCurrencyCode = this.preferredCurrencyCode,
  }: {
    id?: string;
    language?: string;
    preferredCurrencyCode?: string;
  } = {}) {
    const experiencesConfig = await this.#getClientExperiencesConfig();

    const experience = id
      ? experiencesConfig.experiences.find((experience) => experience.id === id)
      : experiencesConfig.experiences?.[0];

    if (!experience) {
      return null;
    }

    let tab = null;

    /* eslint-disable */
    try {
      tab = await this.getTab();
    } catch (e) {}
    /* eslint-enable */

    const { presentedCurrency, getPrice } = await setupCurrencyHandling({
      tab,
      preferredCurrencyCode,
      currencies: experiencesConfig.currencies,
      suggestedCurrency: experiencesConfig.suggestedCurrency,
      language,
    });

    const formatOffering = (offering: OfferingResponse) => {
      // Format all prices.
      const prices = offering.prices.map((price) => getPrice(price));

      // The price in a currency that's going to be featured in
      // `price` object. This is providing quick access to the
      // price without having to iterate over the `prices` array.
      const preferredCurrencyPrice = offering.prices.find(
        (price) => price.currency === presentedCurrency,
      );

      return {
        id: offering.id,
        description: offering.description,
        salesModel: offering.salesModel,
        paymentModel: offering.paymentModel,
        // The `preferredCurrencyPrice` is never undefined because
        // it uses `USD` as a fallback.
        price: getPrice(preferredCurrencyPrice!),
        prices,
        timePassDetails: offering.timePassDetails,
        recurringDetails: offering.recurringDetails,
      };
    };

    return {
      id: experience.id,
      name: experience.name,
      type: experience.type,
      uiConfig: experience.uiConfig as UiConfig,
      product: {
        id: experience.product.id,
        name: experience.product.name,
        contentKey: experience.product.contentKey,
        contentKeyRequired: experience.product.contentKeyRequired,
      },
      offerings: experience.offerings.map(formatOffering),
      upsells: experience.upsells.map((upsell) => {
        return {
          mainOffering: formatOffering(upsell.mainOffering),
          upsellOffering: formatOffering(upsell.upsellOffering),
          discount: upsell.discount,
        };
      }),
    };
  }

  async getSiteDetails() {
    const experiencesConfig = await this.#getClientExperiencesConfig();
    const { siteName, siteLogoUrl } = experiencesConfig;

    return {
      siteName,
      siteLogoUrl,
    };
  }

  async getCurrencyDetails(isoCode?: string) {
    const experiencesConfig = await this.#getClientExperiencesConfig();

    if (!isoCode) {
      isoCode = experiencesConfig.suggestedCurrency || DEFAULT_CURRENCY;
    }

    const currency = experiencesConfig.currencies.find(
      (currency) => currency.isoCode === isoCode,
    );

    if (!currency) {
      return null;
    }

    const formatTabLimit = (amount: number) =>
      formatPrice({
        amount,
        currency: currency.isoCode,
        baseUnit: currency.baseUnit,
        localeCode: this.language,
        showZeroFractionDigits: false,
        showSymbol: currency.isoCode !== "CHF",
      });

    const DEFAULT_FIRST_TAB_LIMIT = 100;
    const DEFAULT_TAB_LIMIT = 500;

    return {
      isoCode: currency.isoCode,
      name: currency.name,
      symbol: currency.symbol,
      baseUnit: currency.baseUnit,
      firstTabLimit: {
        amount: currency.firstTabLimit,
        text: formatTabLimit(currency.firstTabLimit ?? DEFAULT_FIRST_TAB_LIMIT),
      },
      tabLimit: {
        amount: currency.tabLimit,
        text: formatTabLimit(currency.tabLimit ?? DEFAULT_TAB_LIMIT),
      },
    };
  }
}
