import { describe, expect, it, beforeEach } from "@jest/globals";
import {
  resolveCacheSeconds,
  buildCacheControl,
  buildErrorCacheControl,
  CACHE_TTL,
  DURATIONS,
} from "../src/common/cache.js";

beforeEach(() => {
  process.env.CACHE_SECONDS = undefined;
});

describe("Test cache.js", () => {
  it("resolveCacheSeconds: should return default when request is NaN", () => {
    const result = resolveCacheSeconds({
      requested: NaN,
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });
    expect(result).toBe(CACHE_TTL.STATS_CARD.DEFAULT);
  });

  it("resolveCacheSeconds: should clamp to min", () => {
    const result = resolveCacheSeconds({
      requested: 0,
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });
    expect(result).toBe(CACHE_TTL.STATS_CARD.MIN);
  });

  it("resolveCacheSeconds: should clamp to max", () => {
    const result = resolveCacheSeconds({
      requested: 999999,
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });
    expect(result).toBe(CACHE_TTL.STATS_CARD.MAX);
  });

  it("resolveCacheSeconds: should override with CACHE_SECONDS env var", () => {
    process.env.CACHE_SECONDS = "10000";
    const result = resolveCacheSeconds({
      requested: NaN,
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });
    expect(result).toBe(10000);
  });

  it("buildCacheControl: should return correct header string", () => {
    const result = buildCacheControl(86400);
    expect(result).toBe(
      `max-age=86400, s-maxage=86400, stale-while-revalidate=${DURATIONS.ONE_DAY}`,
    );
  });

  it("buildCacheControl: should disable caching when seconds < 1", () => {
    const result = buildCacheControl(0);
    expect(result).toContain("no-cache");
    expect(result).toContain("no-store");
  });

  it("buildErrorCacheControl: should return short cache for errors", () => {
    const result = buildErrorCacheControl();
    expect(result).toContain(`max-age=${CACHE_TTL.ERROR}`);
  });

  it("DURATIONS: should have correct values", () => {
    expect(DURATIONS.ONE_DAY).toBe(86400);
    expect(DURATIONS.TWELVE_HOURS).toBe(43200);
    expect(DURATIONS.SIX_DAY).toBe(518400);
  });

  it("CACHE_TTL: should have all card TTLs", () => {
    expect(CACHE_TTL.STATS_CARD.DEFAULT).toBe(DURATIONS.ONE_DAY);
    expect(CACHE_TTL.TOP_LANGS_CARD.DEFAULT).toBe(DURATIONS.SIX_DAY);
    expect(CACHE_TTL.PIN_CARD.DEFAULT).toBe(DURATIONS.TEN_DAY);
    expect(CACHE_TTL.GIST_CARD.DEFAULT).toBe(DURATIONS.TWO_DAY);
    expect(CACHE_TTL.WAKATIME_CARD.DEFAULT).toBe(DURATIONS.ONE_DAY);
  });
});
