import { AUTH_BASE_URL, SSO_BASE_URL } from "@/env";
import {
  Configuration,
  InternalApi,
  UserIdentityApi,
} from "@laterpay/tapper-sdk";

import { authFlow, getAuthStatus } from "./auth";

export class Supertab {
  private clientId: string;

  constructor(options: { clientId: string }) {
    this.clientId = options.clientId;
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
    const config = new Configuration({
      basePath: "https://tapi.sbx.laterpay.net",
    });

    const healthCheck = await new InternalApi(config).health();

    return healthCheck.version;
  }

  async getCurrentUser({ accessToken }: { accessToken: string }) {
    const config = new Configuration({
      basePath: "https://tapi.sbx.laterpay.net",
      accessToken: `Bearer ${accessToken}`,
    });

    return new UserIdentityApi(config).getCurrentUserV1();
  }
}
