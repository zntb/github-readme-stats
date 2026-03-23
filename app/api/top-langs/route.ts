import { NextRequest, NextResponse } from "next/server";
import { renderTopLanguages } from "@/src/cards/top-languages.js";
import { guardAccess } from "@/src/common/access.js";
import {
  resolveCacheSeconds,
  buildCacheControl,
  buildErrorCacheControl,
  CACHE_TTL,
} from "@/src/common/cache.js";
import { MissingParamError, retrieveSecondaryMessage } from "@/src/common/error.js";
import { parseArray, parseBoolean } from "@/src/common/ops.js";
import { renderError } from "@/src/common/render.js";
import { fetchTopLanguages } from "@/src/fetchers/top-languages.js";
import { isLocaleAvailable } from "@/src/translations.js";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);
  const {
    username,
    hide,
    hide_title,
    hide_border,
    card_width,
    title_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    layout,
    langs_count,
    exclude_repo,
    size_weight,
    count_weight,
    custom_title,
    locale,
    border_radius,
    border_color,
    disable_animations,
    hide_progress,
    stats_format,
  } = q;

  const colorOpts = { title_color, text_color, bg_color, border_color, theme };

  const access = guardAccess({ id: username, type: "username", colors: colorOpts });
  if (!access.isPassed) {
    return new NextResponse(access.errorSvg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() },
    });
  }

  if (locale && !isLocaleAvailable(locale)) {
    return new NextResponse(
      renderError({
        message: "Something went wrong",
        secondaryMessage: "Locale not found",
        renderOptions: colorOpts,
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  if (
    layout !== undefined &&
    (typeof layout !== "string" ||
      !["compact", "normal", "donut", "donut-vertical", "pie"].includes(layout))
  ) {
    return new NextResponse(
      renderError({
        message: "Something went wrong",
        secondaryMessage: "Incorrect layout input",
        renderOptions: colorOpts,
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  if (
    stats_format !== undefined &&
    (typeof stats_format !== "string" || !["bytes", "percentages"].includes(stats_format))
  ) {
    return new NextResponse(
      renderError({
        message: "Something went wrong",
        secondaryMessage: "Incorrect stats_format input",
        renderOptions: colorOpts,
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  try {
    const topLangs = await fetchTopLanguages(
      username,
      parseArray(exclude_repo),
      size_weight ? parseFloat(size_weight) : undefined,
      count_weight ? parseFloat(count_weight) : undefined,
    );
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.TOP_LANGS_CARD.DEFAULT,
      min: CACHE_TTL.TOP_LANGS_CARD.MIN,
      max: CACHE_TTL.TOP_LANGS_CARD.MAX,
    });

    const svg = renderTopLanguages(topLangs, {
      custom_title,
      hide_title: parseBoolean(hide_title),
      hide_border: parseBoolean(hide_border),
      card_width: parseInt(card_width, 10),
      hide: parseArray(hide),
      title_color,
      text_color,
      bg_color,
      theme,
      layout,
      langs_count,
      border_radius,
      border_color,
      locale: locale ? locale.toLowerCase() : null,
      disable_animations: parseBoolean(disable_animations),
      hide_progress: parseBoolean(hide_progress),
      stats_format,
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
