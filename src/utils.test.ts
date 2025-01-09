import { describe, test, expect } from "bun:test";
import { Currency, PaymentModel } from "@getsupertab/tapper-sdk";
import { setupCurrencyHandling } from "./utils";

describe("setupCurrencyHandling", () => {
  const mockCurrencies = [
    {
      isoCode: "USD",
      baseUnit: 100,
      name: "US Dollar",
    },
    {
      isoCode: "EUR",
      baseUnit: 100,
      name: "Euro",
    },
    {
      isoCode: "BRL",
      baseUnit: 100,
      name: "Brazilian Real",
    },
  ] as Currency[];

  test("returns presentedCurrency from tab when available", async () => {
    const { presentedCurrency } = await setupCurrencyHandling({
      tab: {
        id: "test-id",
        status: "open",
        total: {
          amount: 0,
          text: "0",
        },
        limit: {
          amount: 0,
          text: "0",
        },
        currency: {
          isoCode: "EUR",
          baseUnit: 100,
        },
        paymentModel: PaymentModel.Later,
        purchases: [],
      },
      currencies: mockCurrencies,
      suggestedCurrency: "USD",
      language: "en-US",
    });

    expect(presentedCurrency).toBe("EUR");
  });

  test("returns presentedCurrency from preferredCurrencyCode when no tab", async () => {
    const { presentedCurrency } = await setupCurrencyHandling({
      tab: null,
      preferredCurrencyCode: "BRL",
      currencies: mockCurrencies,
      suggestedCurrency: "USD",
      language: "en-US",
    });

    expect(presentedCurrency).toBe("BRL");
  });

  test("returns presentedCurrency from suggestedCurrency when no tab or preferred currency", async () => {
    const { presentedCurrency } = await setupCurrencyHandling({
      tab: null,
      currencies: mockCurrencies,
      suggestedCurrency: "EUR",
      language: "en-US",
    });

    expect(presentedCurrency).toBe("EUR");
  });

  test("formats price with correct currency and text", async () => {
    const { getPrice } = await setupCurrencyHandling({
      tab: null,
      currencies: mockCurrencies,
      suggestedCurrency: "USD",
      language: "en-US",
    });

    const result = getPrice({
      amount: 1000,
      currency: "USD",
    });

    expect(result).toEqual({
      amount: 1000,
      currency: {
        isoCode: "USD",
        baseUnit: 100,
      },
      text: "$10.00",
    });
  });

  test("formats price with different locale", async () => {
    const { getPrice } = await setupCurrencyHandling({
      tab: null,
      currencies: mockCurrencies,
      suggestedCurrency: "EUR",
      language: "de-DE",
    });

    const result = getPrice({
      amount: 1000,
      currency: "EUR",
    });

    expect(result).toEqual({
      amount: 1000,
      currency: {
        isoCode: "EUR",
        baseUnit: 100,
      },
      text: "10,00\u00A0€", // \u00A0 is the non-breaking space character
    });
  });

  test("formats CHF price without symbol", async () => {
    const chfCurrencies = [
      ...mockCurrencies,
      {
        isoCode: "CHF",
        baseUnit: 100,
        name: "Swiss Franc",
      },
    ] as Currency[];

    const { getPrice } = await setupCurrencyHandling({
      tab: null,
      currencies: chfCurrencies,
      suggestedCurrency: "CHF",
      language: "en-US",
    });

    const result = getPrice({
      amount: 1000,
      currency: "CHF",
    });

    expect(result).toEqual({
      amount: 1000,
      currency: {
        isoCode: "CHF",
        baseUnit: 100,
      },
      text: "CHF\u00A010.00",
    });
  });

  test("falls back to default currency if requested currency is not found", async () => {
    const { getPrice } = await setupCurrencyHandling({
      tab: null,
      currencies: mockCurrencies,
      suggestedCurrency: "USD",
      language: "en-US",
    });

    const result = getPrice({
      amount: 1000,
      currency: "INVALID",
    });

    expect(result.currency.isoCode).toBe("USD");
  });
});
