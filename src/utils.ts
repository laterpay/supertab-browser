import { Currency, Price } from "@getsupertab/tapper-sdk";
import { DEFAULT_CURRENCY, formatPrice } from "./price";
import { FormattedTab, PublicCurrencyDetails } from "./types";

export async function setupCurrencyHandling({
  tab,
  preferredCurrencyCode,
  currencies,
  suggestedCurrency,
  language,
}: {
  tab: FormattedTab | null;
  preferredCurrencyCode?: string;
  currencies: Currency[];
  suggestedCurrency: string;
  language: string;
}) {
  const presentedCurrency =
    tab?.currency.isoCode ??
    preferredCurrencyCode ??
    suggestedCurrency ??
    DEFAULT_CURRENCY;

  const currenciesByCode: Record<string, Currency> = currencies.reduce(
    (acc, eachCurrency) => ({
      ...acc,
      [eachCurrency.isoCode]: eachCurrency,
    }),
    {},
  );

  const getPrice = (price: Price, currencyCode?: string) => {
    const currency =
      currenciesByCode[currencyCode ?? price.currency] ??
      currenciesByCode[DEFAULT_CURRENCY];

    const text = formatPrice({
      amount: price.amount,
      currency: currency.isoCode,
      baseUnit: currency.baseUnit,
      localeCode: language,
      showZeroFractionDigits: true,
      showSymbol: currency.isoCode !== "CHF",
    });

    return {
      amount: price.amount,
      currency: getPublicCurrencyDetails(currency),
      text,
    };
  };

  return {
    presentedCurrency,
    currenciesByCode,
    getPrice,
  };
}

export function getPublicCurrencyDetails(
  currency: Currency,
): PublicCurrencyDetails {
  return {
    isoCode: currency.isoCode,
    baseUnit: currency.baseUnit,
  };
}
