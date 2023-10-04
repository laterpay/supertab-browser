import {
  Configuration,
  InternalApi,
  UserIdentityApi,
} from "@laterpay/tapper-sdk";

import {
  handleAuthWindow,
  authorize,
  authenticate,
  refreshAuthentication,
  AuthOptions,
  Authentication,
} from "./auth";

const getAuthentication = () => {
  const entry = localStorage.getItem("supertab-auth");
  return entry ? (JSON.parse(entry) as Authentication) : null;
};

const setAuthentication = (auth: Authentication) => {
  localStorage.setItem("supertab-auth", JSON.stringify(auth));
  return auth;
};

export async function auth(options: AuthOptions & { silently: boolean }) {
  const previousAuth = getAuthentication();
  const isExpired = (previousAuth?.expiresAt || 0) < Date.now();

  if (previousAuth && !isExpired) {
    return previousAuth;
  } else if (previousAuth && isExpired) {
    const authentication = await refreshAuthentication({
      ...options,
      ...previousAuth,
    });
    return setAuthentication(authentication);
  } else if (!options.silently) {
    const { url, codeVerifier } = await authorize(options);
    const authCode = await handleAuthWindow(url);
    const authentication = await authenticate({
      ...options,
      codeVerifier,
      authCode,
    });
    return setAuthentication(authentication);
  }
}

export async function getApiVersion() {
  const config = new Configuration({
    basePath: "https://tapi.sbx.laterpay.net",
  });

  const healthCheck = await new InternalApi(config).health();

  return healthCheck.version;
}

export async function getCurrentUser({ accessToken }: { accessToken: string }) {
  const config = new Configuration({
    basePath: "https://tapi.sbx.laterpay.net",
    accessToken: `Bearer ${accessToken}`,
  });

  return new UserIdentityApi(config).getCurrentUserV1();
}
