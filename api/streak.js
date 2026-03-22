// @ts-check

import { renderStreakCard } from "../src/cards/streak.js";
import { streakFetcher } from "../src/fetchers/streak.js";
import {
  CACHE_TTL,
  resolveCacheSeconds,
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import { guardAccess } from "../src/common/access.js";
import {
  MissingParamError,
  retrieveSecondaryMessage,
} from "../src/common/error.js";
import { renderError } from "../src/common/render.js";

// @ts-ignore
export default async (req, res) => {
  const {
    username,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    border_radius,
    border_color,
    hide_border,
    hide_title,
    custom_title,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  const access = guardAccess({
    res,
    id: username,
    type: "username",
    colors: {
      title_color,
      text_color,
      bg_color,
      border_color,
      theme,
    },
  });
  if (!access.isPassed) {
    return access.result;
  }

  try {
    // @ts-ignore - streakFetcher return type is inferred from calculateStreakData
    const streakData = await streakFetcher({ username });
    // @ts-ignore - Type assertion to satisfy TypeScript
    const streak =
      /** @type {{ currentStreak: number, longestStreak: number, totalContributingDays: number }} */ (
        streakData
      );
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });

    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderStreakCard(streak, {
        title_color,
        icon_color,
        text_color,
        bg_color,
        theme,
        border_radius,
        border_color,
        hide_border: hide_border === "1" || hide_border === "true",
        hide_title: hide_title === "1" || hide_title === "true",
        custom_title,
      }),
    );
  } catch (err) {
    setErrorCacheHeaders(res);
    if (err instanceof Error) {
      return res.send(
        renderError({
          message: err.message,
          secondaryMessage: retrieveSecondaryMessage(err),
          renderOptions: {
            title_color,
            text_color,
            bg_color,
            border_color,
            theme,
            show_repo_link: !(err instanceof MissingParamError),
          },
        }),
      );
    }
    return res.send(
      renderError({
        message: "An unknown error occurred",
        renderOptions: {
          title_color,
          text_color,
          bg_color,
          border_color,
          theme,
        },
      }),
    );
  }
};
