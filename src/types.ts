import { Supertab } from ".";
import { AuthStatus } from "./auth";

export interface Authenticable {
  authStatus: AuthStatus;
}

export type ScreenHint = "login" | "register";

export interface SystemUrls {
  authUrl: string;
  tokenUrl: string;
  ssoBaseUrl: string;
  tapiBaseUrl: string;
  checkoutBaseUrl: string;
}

export type FormattedTab = Awaited<
  ReturnType<typeof Supertab.prototype.formatTab>
>;
