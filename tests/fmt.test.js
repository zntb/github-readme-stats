import { describe, expect, it } from "@jest/globals";
import { formatBytes, kFormatter, wrapTextMultiline } from "../src/common/fmt.js";

describe("Test fmt.js", () => {
  it("kFormatter: should format numbers correctly by default", () => {
    expect(kFormatter(1)).toBe(1);
    expect(kFormatter(-1)).toBe(-1);
    expect(kFormatter(500)).toBe(500);
    expect(kFormatter(1000)).toBe("1k");
    expect(kFormatter(1200)).toBe("1.2k");
    expect(kFormatter(10000)).toBe("10k");
    expect(kFormatter(12345)).toBe("12.3k");
  });

  it("kFormatter: should format with 0 precision", () => {
    expect(kFormatter(500, 0)).toBe("1k");
    expect(kFormatter(1000, 0)).toBe("1k");
    expect(kFormatter(12345, 0)).toBe("12k");
  });

  it("kFormatter: should format with 2 precision", () => {
    expect(kFormatter(1000, 2)).toBe("1.00k");
    expect(kFormatter(1200, 2)).toBe("1.20k");
    expect(kFormatter(12345, 2)).toBe("12.35k");
  });

  it("formatBytes: should return expected values", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(100)).toBe("100.0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
  });

  it("formatBytes: should throw for negative bytes", () => {
    expect(() => formatBytes(-1)).toThrow();
  });

  it("wrapTextMultiline: should not wrap small texts", () => {
    expect(wrapTextMultiline("Small text should not wrap")).toEqual(["Small text should not wrap"]);
  });

  it("wrapTextMultiline: should wrap large texts", () => {
    const lines = wrapTextMultiline("Hello world long long long text", 20, 3);
    expect(lines).toEqual(["Hello world long", "long long text"]);
  });

  it("wrapTextMultiline: should wrap and limit max lines", () => {
    const lines = wrapTextMultiline("Hello world long long long text", 10, 2);
    expect(lines).toEqual(["Hello", "world long..."]);
  });
});
