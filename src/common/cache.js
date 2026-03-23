// @ts-check
import { clampValue } from "./ops.js";

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const DURATIONS = {
  ONE_MINUTE: MIN,
  FIVE_MINUTES: 5 * MIN,
  TEN_MINUTES: 10 * MIN,
  FIFTEEN_MINUTES: 15 * MIN,
  THIRTY_MINUTES: 30 * MIN,
  TWO_HOURS: 2 * HOUR,
  FOUR_HOURS: 4 * HOUR,
  SIX_HOURS: 6 * HOUR,
  EIGHT_HOURS: 8 * HOUR,
  TWELVE_HOURS: 12 * HOUR,
  ONE_DAY: DAY,
  TWO_DAY: 2 * DAY,
  SIX_DAY: 6 * DAY,
  TEN_DAY: 10 * DAY,
};

const CACHE_TTL = {
  STATS_CARD: { DEFAULT: DURATIONS.ONE_DAY, MIN: DURATIONS.TWELVE_HOURS, MAX: DURATIONS.TWO_DAY },
  TOP_LANGS_CARD: { DEFAULT: DURATIONS.SIX_DAY, MIN: DURATIONS.TWO_DAY, MAX: DURATIONS.TEN_DAY },
  PIN_CARD: { DEFAULT: DURATIONS.TEN_DAY, MIN: DURATIONS.ONE_DAY, MAX: DURATIONS.TEN_DAY },
  GIST_CARD: { DEFAULT: DURATIONS.TWO_DAY, MIN: DURATIONS.ONE_DAY, MAX: DURATIONS.TEN_DAY },
  WAKATIME_CARD: { DEFAULT: DURATIONS.ONE_DAY, MIN: DURATIONS.TWELVE_HOURS, MAX: DURATIONS.TWO_DAY },
  ERROR: DURATIONS.TEN_MINUTES,
};

const resolveCacheSeconds = ({ requested, def, min, max }) => {
  let cacheSeconds = clampValue(isNaN(requested) ? def : requested, min, max);
  if (process.env.CACHE_SECONDS) {
    const envCacheSeconds = parseInt(process.env.CACHE_SECONDS, 10);
    if (!isNaN(envCacheSeconds)) cacheSeconds = envCacheSeconds;
  }
  return cacheSeconds;
};

/**
 * Build Cache-Control header string.
 * @param {number} cacheSeconds
 * @returns {string}
 */
const buildCacheControl = (cacheSeconds) => {
  if (cacheSeconds < 1 || process.env.NODE_ENV === "development") {
    return "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0";
  }
  return `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${DURATIONS.ONE_DAY}`;
};

/**
 * Build Cache-Control string for error responses.
 * @returns {string}
 */
const buildErrorCacheControl = () => {
  const envCacheSeconds = process.env.CACHE_SECONDS
    ? parseInt(process.env.CACHE_SECONDS, 10)
    : NaN;
  if ((!isNaN(envCacheSeconds) && envCacheSeconds < 1) || process.env.NODE_ENV === "development") {
    return "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0";
  }
  return `max-age=${CACHE_TTL.ERROR}, s-maxage=${CACHE_TTL.ERROR}, stale-while-revalidate=${DURATIONS.ONE_DAY}`;
};

export { resolveCacheSeconds, buildCacheControl, buildErrorCacheControl, DURATIONS, CACHE_TTL };
