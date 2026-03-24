import { NextRequest, NextResponse } from "next/server";
import {
  renderStatsCard,
  renderTopLanguages,
  renderStreakCard,
  renderGistCard,
  renderRepoCard,
  renderWakatimeCard,
} from "@/src/cards/index.js";
import { buildCacheControl, buildErrorCacheControl, CACHE_TTL } from "@/src/common/cache.js";
import { renderError, renderMultiColumnLayout } from "@/src/common/render.js";
import { fetchStats } from "@/src/fetchers/stats.js";
import { fetchTopLanguages } from "@/src/fetchers/top-languages.js";
import { streakFetcher } from "@/src/fetchers/streak.js";
import { fetchGist } from "@/src/fetchers/gist.js";
import { fetchRepo } from "@/src/fetchers/repo.js";
import { fetchWakatimeStats } from "@/src/fetchers/wakatime.js";

export const runtime = "nodejs";

/**
 * Renders a single card based on type and parameters
 */
async function renderCard(cardConfig: {
  type: string;
  username?: string;
  repo?: string;
  gistId?: string;
  params: Record<string, string>;
}) {
  const { type, username, repo, gistId, params } = cardConfig;

  const parseBoolean = (val: string) => val === "true";
  const parseArray = (val: string) => (val ? val.split(",") : []);

  const colors = {
    title_color: params.title_color || "",
    text_color: params.text_color || "",
    bg_color: params.bg_color || "",
    border_color: params.border_color || "",
    theme: params.theme || "default",
    ring_color: params.ring_color || "",
    icon_color: params.icon_color || "",
  };

  const commonOptions = {
    hide_title: parseBoolean(params.hide_title || "false"),
    hide_border: parseBoolean(params.hide_border || "false"),
    disable_animations: parseBoolean(params.disable_animations || "false"),
    border_radius: params.border_radius || "4.5",
  };

  try {
    switch (type) {
      case "stats": {
        if (!username) return null;
        const stats = await fetchStats(
          username,
          parseBoolean(params.include_all_commits || "false"),
          parseArray(params.exclude_repo || ""),
          false,
          false,
          false,
          0,
        );
        return renderStatsCard(stats, {
          hide: parseArray(params.hide || ""),
          show_icons: parseBoolean(params.show_icons || "false"),
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          card_width: parseInt(params.card_width, 10) || 287,
          hide_rank: parseBoolean(params.hide_rank || "false"),
          include_all_commits: parseBoolean(params.include_all_commits || "false"),
          commits_year: parseInt(params.commits_year, 10) || 0,
          line_height: params.line_height || "1",
          title_color: colors.title_color,
          ring_color: colors.ring_color,
          icon_color: colors.icon_color,
          text_color: colors.text_color,
          text_bold: parseBoolean(params.text_bold || "false"),
          bg_color: colors.bg_color,
          theme: colors.theme,
          custom_title: params.custom_title || "",
          border_radius: commonOptions.border_radius,
          border_color: colors.border_color,
          number_format: params.number_format || "short",
          number_precision: parseInt(params.number_precision, 10) || 0,
          locale: params.locale || null,
          disable_animations: commonOptions.disable_animations,
          show: parseArray(params.show || ""),
        });
      }

      case "top-langs": {
        if (!username) return null;
        const langs = await fetchTopLanguages(username);
        return renderTopLanguages(langs, {
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          hide: params.hide || "",
          card_width: parseInt(params.card_width, 10) || 300,
          langs_count: parseInt(params.langs_count, 10) || 5,
          layout: params.layout || "normal",
          custom_title: params.custom_title || "",
          colors: colors,
          border_radius: commonOptions.border_radius,
          disable_animations: commonOptions.disable_animations,
        });
      }

      case "streak": {
        if (!username) return null;
        const streak = await streakFetcher({ username });
        return renderStreakCard(streak, {
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          card_width: parseInt(params.card_width, 10) || 287,
          custom_title: params.custom_title || "",
          colors: colors,
          border_radius: commonOptions.border_radius,
          disable_animations: commonOptions.disable_animations,
          locale: params.locale || "",
        });
      }

      case "gist": {
        if (!gistId) return null;
        const gist = await fetchGist(gistId);
        return renderGistCard(gist, {
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          show_owner: parseBoolean(params.show_owner || "false"),
          card_width: parseInt(params.card_width, 10) || 287,
        });
      }

      case "pin": {
        if (!username || !repo) return null;
        const repoData = await fetchRepo(username, repo);
        return renderRepoCard(repoData, {
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          show_owner: parseBoolean(params.show_owner || "false"),
          card_width: parseInt(params.card_width, 10) || 287,
          custom_title: params.custom_title || "",
        });
      }

      case "wakatime": {
        if (!username) return null;
        const waka = await fetchWakatimeStats({ username, api_domain: params.api_domain });
        return renderWakatimeCard(waka, {
          hide: [],
          hide_title: commonOptions.hide_title,
          hide_border: commonOptions.hide_border,
          card_width: parseInt(params.card_width, 10) || 287,
          custom_title: params.custom_title || "",
          layout: params.layout || "normal",
          colors: colors,
          border_radius: commonOptions.border_radius,
          disable_animations: commonOptions.disable_animations,
        });
      }

      default:
        return null;
    }
  } catch (error) {
    console.error(`Error rendering ${type} card:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const q = Object.fromEntries(request.nextUrl.searchParams);

  const { cards, columns = "2", rows, gap = "25", total_width, total_height } = q;

  if (!cards) {
    return new NextResponse(
      renderError({
        message: "Missing cards parameter",
        secondaryMessage: "Please provide card configurations",
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }

  try {
    // Parse card configurations from JSON string
    let cardConfigs;
    try {
      cardConfigs = JSON.parse(cards);
    } catch {
      return new NextResponse(
        renderError({
          message: "Invalid cards format",
          secondaryMessage: "Cards must be a valid JSON array",
        }),
        { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
      );
    }

    if (!Array.isArray(cardConfigs) || cardConfigs.length === 0) {
      return new NextResponse(
        renderError({
          message: "No cards provided",
          secondaryMessage: "Please provide at least one card",
        }),
        { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
      );
    }

    // Render each card
    const renderedCards = await Promise.all(cardConfigs.map((config) => renderCard(config)));

    // Filter out null cards (failed to render)
    const validCards = renderedCards.filter(Boolean);

    if (validCards.length === 0) {
      return new NextResponse(
        renderError({
          message: "Failed to render cards",
          secondaryMessage: "Check card configurations",
        }),
        { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
      );
    }

    // Create multi-column layout
    const svg = renderMultiColumnLayout({
      items: validCards,
      columns: parseInt(columns, 10) || 2,
      rows: rows ? parseInt(rows, 10) : undefined,
      gap: parseInt(gap, 10) || 25,
      totalWidth: total_width ? parseInt(total_width, 10) : undefined,
      totalHeight: total_height ? parseInt(total_height, 10) : undefined,
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": buildCacheControl(CACHE_TTL.STATS_CARD.DEFAULT),
      },
    });
  } catch (error) {
    console.error("Error in multi-column cards endpoint:", error);
    return new NextResponse(
      renderError({
        message: "An unexpected error occurred",
        secondaryMessage: error.message || "Unknown error",
      }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": buildErrorCacheControl() } },
    );
  }
}
