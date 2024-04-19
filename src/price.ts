export function formatPrice({
  amount,
  currency,
  baseUnit,
  localeCode,
  showZeroFractionDigits = false,
  showSymbol = true,
}: {
  amount: number;
  currency: string;
  baseUnit: number;
  localeCode: string;
  showZeroFractionDigits?: boolean;
  showSymbol?: boolean;
}) {
  const isoCodePattern = new RegExp(currency, "i");
  const amountRest = amount % baseUnit;
  const hasZeroFractionDigits = amountRest !== 0;

  const options = {
    style: "currency",
    currencyDisplay: showSymbol ? "narrowSymbol" : "code",
    currency,
    minimumFractionDigits:
      hasZeroFractionDigits || (showZeroFractionDigits && baseUnit !== 1)
        ? 2
        : 0,
  };
  const value = showSymbol
    ? new Intl.NumberFormat(localeCode, options)
        .format(amount / baseUnit)
        .replace(isoCodePattern, "")
        .trim()
    : new Intl.NumberFormat(localeCode, options)
        .format(amount / baseUnit)
        .trim();

  return value;
}

export const DEFAULT_CURRENCY = "USD";
