import { describe, expect, it } from "@jest/globals";
import { blacklist } from "../src/common/blacklist.js";

describe("Test blacklist.js", () => {
  it("should contain expected blacklisted users", () => {
    expect(blacklist).toContain("renovate-bot");
    expect(blacklist).toContain("technote-space");
    expect(blacklist).toContain("sw-yx");
    expect(blacklist).toContain("YourUsername");
    expect(blacklist).toContain("[YourUsername]");
  });

  it("should be an array", () => {
    expect(Array.isArray(blacklist)).toBe(true);
  });

  it("should have at least 5 entries", () => {
    expect(blacklist.length).toBeGreaterThanOrEqual(5);
  });
});
