import { Currency } from "@getsupertab/tapper-sdk";
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

export type PublicCurrencyDetails = Pick<Currency, "isoCode" | "baseUnit">;

export type UiConfig = {
  colors: {
    text: string;
    background: string;
    highlightedOfferingText: string | null;
  };
  mainScreen: {
    offeringIds: (string | null)[];
    highlightedOfferingId: string;
    upsellOfferingIds: (string | null)[];
  } | null;
  moreOptionsScreen: {
    offeringIds: (string | null)[];
    highlightedOfferingId: string;
    upsellOfferingIds: (string | null)[];
  } | null;
};
