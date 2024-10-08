import { ScreenHint } from "./types";
import { handleChildWindow, openBlankChildWindow } from "./window";

const scope = "tab:tab:read tab:purchase:write auth:user:read offline_access";

export type AuthOptions = {
  clientId: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  screenHint?: ScreenHint;
  loginAction?: string;
  state?: object;
};

export type Authentication = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  tokenType: string;
};

export type Authorization = {
  url: URL;
  codeVerifier: string;
};

export enum AuthStatus {
  EXPIRED = "expired",
  VALID = "valid",
  MISSING = "missing",
}

// Complete authentication flow
export async function authFlow(options: AuthOptions & { silently: boolean }) {
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
    const ssoWindow = openBlankChildWindow({
      width: 400,
      height: 800,
      target: "ssoWindow",
    });

    const { url, codeVerifier } = await authorize(options);

    const authCode = await handleChildWindow({
      url,
      childWindow: ssoWindow,
      onMessage: (ev) => {
        if (url.searchParams.get("state") !== ev.data.state) {
          throw new Error("State mismatch");
        } else if (url.searchParams.get("scope") !== ev.data.scope) {
          throw new Error("Scope mismatch");
        } else if (!ev.data.authCode) {
          throw new Error("Auth code is missing");
        } else {
          const { authCode } = ev.data;
          return authCode;
        }
      },
    });

    if (authCode.error) {
      return authCode;
    }

    const authentication = await authenticate({
      ...options,
      codeVerifier,
      authCode,
    });
    return setAuthentication(authentication);
  }
}

// Return auth status
export function getAuthStatus(): AuthStatus {
  const previousAuth = getAuthentication();
  const isExpired = (previousAuth?.expiresAt || 0) < Date.now();

  if (!previousAuth) {
    return AuthStatus.MISSING;
  }
  if (isExpired) {
    return AuthStatus.EXPIRED;
  }

  return AuthStatus.VALID;
}

// Return accessToken
export function getAccessToken(): string | undefined {
  return getAuthentication()?.accessToken;
}

// Create auth url and wait for auth code
export async function authorize({
  clientId,
  redirectUri,
  screenHint,
  authUrl,
  ...rest
}: AuthOptions): Promise<Authorization> {
  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const state = window.btoa(
    JSON.stringify({
      origin: window.location.origin,
      ...rest.state,
    }),
  );

  const url = new URL(authUrl);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("audience_hint", "consumer");
  if (screenHint) {
    url.searchParams.set("screen_hint", screenHint);
  }

  return { url, codeVerifier };
}

// Exchange auth code for access token
export async function authenticate({
  clientId,
  codeVerifier,
  tokenUrl,
  redirectUri,
  authCode,
}: {
  clientId: string;
  codeVerifier: string;
  tokenUrl: string;
  redirectUri: string;
  authCode: string;
}): Promise<Authentication> {
  const url = new URL(tokenUrl);
  const method = "POST";
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", authCode);
  params.append("code_verifier", codeVerifier);
  params.append("client_id", clientId);
  params.append("redirect_uri", redirectUri);

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (res.status === 200) {
    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
    };
  } else {
    const result = await res.json();
    throw new Error(result?.error?.message);
  }
}

// Refresh access token
export async function refreshAuthentication({
  clientId,
  tokenUrl,
  refreshToken,
}: {
  clientId: string;
  tokenUrl: string;
  refreshToken: string;
}): Promise<Authentication> {
  const url = new URL(tokenUrl);
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", clientId);
  params.append("scope", scope);
  params.append("scope", scope);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (res.status === 200) {
    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
    };
  } else {
    const result = await res.json();
    throw new Error(result?.error?.message);
  }
}

async function generateCodeChallenge(codeVerifier: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );

  return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const getAuthentication = () => {
  const entry = localStorage.getItem("supertab-auth");
  return entry ? (JSON.parse(entry) as Authentication) : null;
};

const setAuthentication = (auth: Authentication) => {
  localStorage.setItem("supertab-auth", JSON.stringify(auth));
  return auth;
};
