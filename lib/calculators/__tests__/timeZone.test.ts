import { describe, it, expect } from "vitest";
import { convertTimeZone } from "../timeZone";

describe("convertTimeZone", () => {
  it("computes an offset difference between Riyadh and London (winter, no DST)", () => {
    const result = convertTimeZone("2026-01-15T12:00:00Z", "Asia/Riyadh", "Europe/London");
    // Riyadh is UTC+3 fixed, London is UTC+0 in January (no DST)
    expect(result.offsetHours).toBe(-3);
  });

  it("throws on invalid date", () => {
    expect(() => convertTimeZone("not-a-date", "Asia/Riyadh", "Europe/London")).toThrow();
  });
});
