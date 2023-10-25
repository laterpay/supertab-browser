import { AUTH_BASE_URL, SSO_BASE_URL, TAPI_BASE_URL } from "@/env";
import {
  Configuration,
  InternalApi,
  UserIdentityApi,
  ItemsApi,
  Currency,
} from "@laterpay/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken, AuthStatus } from "./auth";

import { formatPrice } from "./price";

interface Authenticable {
  authStatus: AuthStatus;
}

function authenticated(
  target: Authenticable,
  propertyKey: string,
  descriptor: PropertyDescriptor,
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
    },
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
      this.tapperConfig,
    ).getCurrentUserV1();

    return {
      id: user.id,
    };
  }

  async getOfferings({
    currency,
    language = this.language,
  }: { currency?: string; language?: string } = {}) {
    const clientConfig = await new ItemsApi(
      this.tapperConfig,
    ).getClientConfigV1({
      clientId: this.clientId,
      currency,
    });

    const currenciesByCode: Record<string, Currency> =
      clientConfig.currencies.reduce(
        (acc, eachCurrency) => ({
          ...acc,
          [eachCurrency.isoCode]: eachCurrency,
        }),
        {},
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
}
