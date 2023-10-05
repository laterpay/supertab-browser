import { AUTH_BASE_URL, SSO_BASE_URL, TAPI_BASE_URL } from "@/env";
import {
  Configuration,
  InternalApi,
  UserIdentityApi,
} from "@laterpay/tapper-sdk";

import { authFlow, getAuthStatus, getAccessToken } from "./auth";

export class Supertab {
  private clientId: string;
  private tapperConfig: Configuration;

  constructor(options: { clientId: string }) {
    this.clientId = options.clientId;
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

  async getCurrentUser() {
    return new UserIdentityApi(this.tapperConfig).getCurrentUserV1();
  }
}
