import { test, expect, describe } from "bun:test";
import Supertab from ".";

describe("Supertab", () => {
  test("assign window.Supertab", () => {
    expect(window.Supertab).toBe(Supertab);
  });
});
