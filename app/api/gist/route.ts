import { NextRequest, NextResponse } from "next/server";
import { renderGistCard } from "@/src/cards/gist.js";
import { guardAccess } from "@/src/common/access.js";
import {
  resolveCacheSeconds,
  buildCacheControl,
  buildErrorCacheControl,
  CACHE_TTL,
} from "@/src/common/cache.js";
import { MissingParamError, retrieveSecondaryMessage } from "@/src/common/error.js";
import { parseBoolean } from "@/src/common/ops.js";
import { renderError } from "@/src/common/render.js";
import { fetchGist } from "@/src/fetchers/gist.js";
import { isLocaleAvailable } from "@/src/translations.js";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);
  const {
    id,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    show_owner,
    hide_border,
  } = q;

  const colorOpts = { title_color, text_color, bg_color, border_color, theme };

  const access = guardAccess({ id, type: "gist", colors: colorOpts });
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
    const gistData = await fetchGist(id);
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.GIST_CARD.DEFAULT,
      min: CACHE_TTL.GIST_CARD.MIN,
      max: CACHE_TTL.GIST_CARD.MAX,
    });

    const svg = renderGistCard(gistData, {
      title_color,
      icon_color,
      text_color,
      bg_color,
      theme,
      border_radius,
      border_color,
      locale: locale ? locale.toLowerCase() : null,
      show_owner: parseBoolean(show_owner),
      hide_border: parseBoolean(hide_border),
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
