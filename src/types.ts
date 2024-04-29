import { AuthStatus } from "./auth";

export interface Authenticable {
  authStatus: AuthStatus;
}

export type ScreenHint = "login" | "register";

export interface SystemUrls {
  authBaseUrl: string;
  ssoBaseUrl: string;
  tapiBaseUrl: string;
  checkoutBaseUrl: string;
}
