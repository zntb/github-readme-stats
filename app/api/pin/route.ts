import { NextRequest, NextResponse } from "next/server";
import { renderRepoCard } from "@/src/cards/repo.js";
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
import { fetchRepo } from "@/src/fetchers/repo.js";
import { isLocaleAvailable } from "@/src/translations.js";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);
  const {
    username,
    repo,
    hide_border,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
    show_owner,
    cache_seconds,
    locale,
    border_radius,
    border_color,
    description_lines_count,
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
        secondaryMessage: "Language not found",
        renderOptions: colorOpts,
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  try {
    const repoData = await fetchRepo(username, repo);
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.PIN_CARD.DEFAULT,
      min: CACHE_TTL.PIN_CARD.MIN,
      max: CACHE_TTL.PIN_CARD.MAX,
    });

    const svg = renderRepoCard(repoData, {
      hide_border: parseBoolean(hide_border),
      title_color,
      icon_color,
      text_color,
      bg_color,
      theme,
      border_radius,
      border_color,
      show_owner: parseBoolean(show_owner),
      locale: locale ? locale.toLowerCase() : null,
      description_lines_count,
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
