import { NextRequest, NextResponse } from "next/server";
import { renderWakatimeCard } from "@/src/cards/wakatime.js";
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
import { fetchWakatimeStats } from "@/src/fetchers/wakatime.js";
import { isLocaleAvailable } from "@/src/translations.js";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);
  const {
    username,
    title_color,
    icon_color,
    hide_border,
    card_width,
    line_height,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    hide_title,
    hide_progress,
    custom_title,
    locale,
    layout,
    langs_count,
    hide,
    api_domain,
    border_radius,
    border_color,
    display_format,
    disable_animations,
  } = q;

  const colorOpts = { title_color, text_color, bg_color, border_color, theme };

  const access = guardAccess({ id: username, type: "wakatime", colors: colorOpts });
  if (!access.isPassed) {
    return new NextResponse(access.errorSvg, {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() },
    });
  }

  if (locale && !isLocaleAvailable(locale)) {
    return new NextResponse(
      renderError({
        message: "Something went wrong",
        secondaryMessage: "Language not found",
        renderOptions: colorOpts,
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  try {
    const stats = await fetchWakatimeStats({ username, api_domain });
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.WAKATIME_CARD.DEFAULT,
      min: CACHE_TTL.WAKATIME_CARD.MIN,
      max: CACHE_TTL.WAKATIME_CARD.MAX,
    });

    const svg = renderWakatimeCard(stats, {
      custom_title,
      hide_title: parseBoolean(hide_title),
      hide_border: parseBoolean(hide_border),
      card_width: parseInt(card_width, 10),
      hide: parseArray(hide),
      line_height,
      title_color,
      icon_color,
      text_color,
      bg_color,
      theme,
      hide_progress,
      border_radius,
      border_color,
      locale: locale ? locale.toLowerCase() : null,
      layout,
      langs_count,
      display_format,
      disable_animations: parseBoolean(disable_animations),
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
