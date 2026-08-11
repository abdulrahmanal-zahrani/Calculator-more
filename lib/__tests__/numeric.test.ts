import { describe, expect, it } from "vitest";
import { normalizeNumericInput } from "../numeric";

describe("normalizeNumericInput", () => {
  it("parses plain ASCII integers and decimals", () => {
    expect(normalizeNumericInput("125")).toBe(125);
    expect(normalizeNumericInput("12.5")).toBe(12.5);
  });

  it("converts Arabic-Indic digits", () => {
    expect(normalizeNumericInput("١٢٥")).toBe(125);
  });

  it("converts Extended Arabic-Indic (Persian) digits", () => {
    expect(normalizeNumericInput("۱۲۵")).toBe(125);
  });

  it("handles mixed Arabic-Indic and ASCII digits", () => {
    expect(normalizeNumericInput("1٢٥")).toBe(125);
    expect(normalizeNumericInput("١25")).toBe(125);
  });

  it("handles Arabic thousands separator", () => {
    expect(normalizeNumericInput("١٬٢٥٠")).toBe(1250);
  });

  it("handles Arabic decimal separator", () => {
    expect(normalizeNumericInput("١٢٫٥")).toBe(12.5);
  });

  it("handles ASCII thousands-comma with a decimal point", () => {
    expect(normalizeNumericInput("1,250.75")).toBe(1250.75);
  });

  it("handles ASCII decimal comma (no other dot)", () => {
    expect(normalizeNumericInput("12,5")).toBe(12.5);
  });

  it("handles ASCII thousands-only comma", () => {
    expect(normalizeNumericInput("1,250")).toBe(1250);
  });

  it("strips whitespace including Arabic whitespace", () => {
    expect(normalizeNumericInput(" 125 ")).toBe(125);
    expect(normalizeNumericInput("١٢٥ ")).toBe(125);
  });

  it("handles negative numbers", () => {
    expect(normalizeNumericInput("-125")).toBe(-125);
    expect(normalizeNumericInput("-١٢٫٥")).toBe(-12.5);
  });

  it("returns null for empty string", () => {
    expect(normalizeNumericInput("")).toBeNull();
  });

  it("returns null for just a separator", () => {
    expect(normalizeNumericInput(".")).toBeNull();
    expect(normalizeNumericInput(",")).toBeNull();
    expect(normalizeNumericInput("٫")).toBeNull();
    expect(normalizeNumericInput("-")).toBeNull();
  });

  it("returns null for multiple decimal points", () => {
    expect(normalizeNumericInput("1.2.3")).toBeNull();
  });

  it("returns null for non-numeric garbage", () => {
    expect(normalizeNumericInput("abc")).toBeNull();
    expect(normalizeNumericInput("12abc")).toBeNull();
  });

  it("returns null, not NaN, and never throws", () => {
    // @ts-expect-error testing runtime guard against null/undefined input
    expect(normalizeNumericInput(null)).toBeNull();
    // @ts-expect-error testing runtime guard against null/undefined input
    expect(normalizeNumericInput(undefined)).toBeNull();
  });
});
