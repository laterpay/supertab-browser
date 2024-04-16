export function formatPrice({
  amount,
  currency,
  baseUnit,
  localeCode,
  showZeroFractionDigits = false,
}: {
  amount: number;
  currency: string;
  baseUnit: number;
  localeCode: string;
  showZeroFractionDigits?: boolean;
}) {
  const isoCodePattern = new RegExp(currency, "i");
  const amountRest = amount % baseUnit;
  const hasZeroFractionDigits = amountRest !== 0;

  const options = {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency,
    minimumFractionDigits:
      hasZeroFractionDigits || (showZeroFractionDigits && baseUnit !== 1)
        ? 2
        : 0,
  };
  const value = new Intl.NumberFormat(localeCode, options)
    .format(amount / baseUnit)
    .replace(isoCodePattern, "")
    .trim();

  return value;
}

export const DEFAULT_CURRENCY = "USD";
