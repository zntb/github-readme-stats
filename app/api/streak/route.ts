import { NextRequest, NextResponse } from "next/server";
import { renderStreakCard } from "@/src/cards/streak.js";
import { guardAccess } from "@/src/common/access.js";
import {
  resolveCacheSeconds,
  buildCacheControl,
  buildErrorCacheControl,
  CACHE_TTL,
} from "@/src/common/cache.js";
import { MissingParamError, retrieveSecondaryMessage } from "@/src/common/error.js";
import { renderError } from "@/src/common/render.js";
import { streakFetcher } from "@/src/fetchers/streak.js";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);
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
    card_width,
  } = q;

  const colorOpts = { title_color, text_color, bg_color, border_color, theme };

  const access = guardAccess({ id: username, type: "username", colors: colorOpts });
  if (!access.isPassed) {
    return new NextResponse(access.errorSvg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() },
    });
  }

  try {
    const streakData = (await streakFetcher({ username })) as {
      currentStreak: number;
      longestStreak: number;
      totalContributingDays: number;
    };
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.STATS_CARD.DEFAULT,
      min: CACHE_TTL.STATS_CARD.MIN,
      max: CACHE_TTL.STATS_CARD.MAX,
    });

    const svg = renderStreakCard(streakData, {
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
      card_width: parseInt(card_width, 10),
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": buildCacheControl(cacheSeconds),
      },
    });
  } catch (err) {
    const svg = renderError({
      message: err.message || "An unknown error occurred",
      secondaryMessage: retrieveSecondaryMessage(err),
      renderOptions: { ...colorOpts, show_repo_link: !(err instanceof MissingParamError) },
    });
    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() },
    });
  }
}
