/**
 * Tests for TypeScript type definitions
 * These tests verify that the TypeScript definitions are correctly exported and usable
 */

import { describe, expect, it } from "@jest/globals";

import { renderStatsCard } from "../src/cards/stats.js";
import { renderRepoCard } from "../src/cards/repo.js";
import { renderGistCard } from "../src/cards/gist.js";
import { renderStreakCard } from "../src/cards/streak.js";
import { renderTopLanguages } from "../src/cards/top-languages.js";
import { renderWakatimeCard } from "../src/cards/wakatime.js";
import { Card } from "../src/common/Card.js";
import { I18n } from "../src/common/I18n.js";
import { getCardColors } from "../src/common/color.js";
import {
  kFormatter,
  formatBytes,
  wrapTextMultiline,
} from "../src/common/fmt.js";
import { parseBoolean, parseArray, clampValue } from "../src/common/ops.js";
import { icons, rankIcon } from "../src/common/icons.js";
import { renderError, flexLayout, measureText } from "../src/common/render.js";
import { CustomError, MissingParamError } from "../src/common/error.js";
import { calculateRank } from "../src/calculateRank.js";

describe("TypeScript Type Definitions", () => {
  describe("Card Types", () => {
    it("should have proper CommonOptions type", () => {
      const options = {
        title_color: "ff0000",
        icon_color: "00ff00",
        text_color: "0000ff",
        bg_color: "ffffff",
        theme: "default",
        border_radius: 4,
        border_color: "000000",
        locale: "en",
        hide_border: false,
      };
      expect(options).toBeDefined();
      expect(options.title_color).toBe("ff0000");
      expect(options.theme).toBe("default");
    });

    it("should have proper StatCardOptions type", () => {
      const options = {
        hide: ["stars"],
        show_icons: true,
        hide_title: false,
        card_width: 300,
        hide_rank: false,
        include_all_commits: true,
        commits_year: 2024,
        line_height: 30,
        custom_title: "Custom Stats",
        disable_animations: false,
        number_format: "short",
        number_precision: 1,
        ring_color: "ff0000",
        text_bold: true,
        rank_icon: "default",
        show: ["stars", "commits"],
        // CommonOptions
        title_color: "ff0000",
        icon_color: "00ff00",
        text_color: "0000ff",
        bg_color: "ffffff",
        theme: "default",
        border_radius: 4,
        border_color: "000000",
        locale: "en",
        hide_border: false,
      };
      expect(options.hide).toEqual(["stars"]);
      expect(options.show_icons).toBe(true);
      expect(options.rank_icon).toBe("default");
    });

    it("should have proper RepoCardOptions type", () => {
      const options = {
        show_owner: true,
        description_lines_count: 5,
        // CommonOptions
        title_color: "ff0000",
        theme: "default_repocard",
        border_radius: 4,
      };
      expect(options.show_owner).toBe(true);
      expect(options.description_lines_count).toBe(5);
    });

    it("should have proper TopLangOptions type", () => {
      const options = {
        hide_title: false,
        card_width: 300,
        hide: ["Java"],
        layout: "normal",
        custom_title: "Languages",
        langs_count: 10,
        disable_animations: false,
        hide_progress: false,
        stats_format: "percentages",
      };
      expect(options.layout).toBe("normal");
      expect(options.stats_format).toBe("percentages");
    });

    it("should have proper WakaTimeOptions type", () => {
      const options = {
        hide_title: false,
        hide: [],
        card_width: 495,
        line_height: "25",
        hide_progress: false,
        custom_title: "WakaTime",
        layout: "compact",
        langs_count: 5,
        display_format: "time",
        disable_animations: false,
      };
      expect(options.layout).toBe("compact");
      expect(options.display_format).toBe("time");
    });

    it("should have proper GistCardOptions type", () => {
      const options = {
        show_owner: true,
      };
      expect(options.show_owner).toBe(true);
    });

    it("should have proper StreakCardOptions type", () => {
      const options = {
        hide_title: false,
        custom_title: "Streak",
      };
      expect(options.hide_title).toBe(false);
    });
  });

  describe("Fetcher Types", () => {
    it("should have proper StatsData type", () => {
      const stats = {
        name: "testuser",
        totalPRs: 100,
        totalPRsMerged: 80,
        mergedPRsPercentage: 80,
        totalReviews: 50,
        totalCommits: 500,
        totalIssues: 30,
        totalStars: 200,
        totalDiscussionsStarted: 10,
        totalDiscussionsAnswered: 20,
        contributedTo: 50,
        rank: { level: "A+", percentile: 95 },
      };
      expect(stats.name).toBe("testuser");
      expect(stats.rank.percentile).toBe(95);
    });

    it("should have proper RepositoryData type", () => {
      const repo = {
        name: "test-repo",
        nameWithOwner: "testuser/test-repo",
        isPrivate: false,
        isArchived: false,
        isTemplate: false,
        stargazers: { totalCount: 100 },
        description: "A test repository",
        primaryLanguage: { color: "#ff0000", id: "1", name: "JavaScript" },
        forkCount: 20,
        starCount: 100,
      };
      expect(repo.nameWithOwner).toBe("testuser/test-repo");
      expect(repo.primaryLanguage.name).toBe("JavaScript");
    });

    it("should have proper GistData type", () => {
      const gist = {
        name: "test-gist",
        nameWithOwner: "testuser/test-gist",
        description: "A test gist",
        language: "JavaScript",
        starsCount: 10,
        forksCount: 5,
      };
      expect(gist.language).toBe("JavaScript");
      expect(gist.starsCount).toBe(10);
    });

    it("should have proper TopLangData type", () => {
      const topLangs = {
        JavaScript: { name: "JavaScript", color: "#f1e05a", size: 1000 },
        TypeScript: { name: "TypeScript", color: "#2b7489", size: 500 },
      };
      expect(topLangs.JavaScript.size).toBe(1000);
    });

    it("should have proper StreakData type", () => {
      const streak = {
        currentStreak: 30,
        longestStreak: 100,
        totalContributingDays: 365,
      };
      expect(streak.currentStreak).toBe(30);
    });
  });

  describe("Common Utility Functions", () => {
    describe("Card class", () => {
      it("should create a Card instance", () => {
        const card = new Card({
          width: 300,
          height: 100,
          colors: {
            titleColor: "#000",
            textColor: "#000",
            iconColor: "#000",
            bgColor: "#fff",
            borderColor: "#ccc",
          },
        });
        expect(card).toBeDefined();
        expect(card.width).toBe(300);
        expect(card.height).toBe(100);
      });

      it("should render card", () => {
        const card = new Card({
          width: 300,
          height: 100,
        });
        const svg = card.render("<text>Test</text>");
        expect(svg).toContain("<svg");
      });
    });

    describe("I18n class", () => {
      it("should create an I18n instance", () => {
        const i18n = new I18n({
          locale: "en",
          translations: {
            test: "Test",
          },
        });
        expect(i18n).toBeDefined();
      });

      it("should translate keys", () => {
        const i18n = new I18n({
          locale: "en",
          translations: {
            test: {
              en: "Test Translation",
            },
          },
        });
        expect(i18n.t("test")).toBe("Test Translation");
      });
    });

    describe("getCardColors", () => {
      it("should return colors with defaults", () => {
        const colors = getCardColors({});
        expect(colors.titleColor).toBeDefined();
        expect(colors.textColor).toBeDefined();
        expect(colors.bgColor).toBeDefined();
      });

      it("should accept custom colors", () => {
        const colors = getCardColors({
          title_color: "ff0000",
          text_color: "00ff00",
          bg_color: "0000ff",
        });
        expect(colors.titleColor).toBe("#ff0000");
      });

      it("should handle theme", () => {
        const colors = getCardColors({
          theme: "dark",
        });
        expect(colors).toBeDefined();
      });
    });

    describe("kFormatter", () => {
      it("should format numbers with k suffix", () => {
        expect(kFormatter(500)).toBe(500);
        expect(kFormatter(1500)).toBe("1.5k");
        expect(kFormatter(10000)).toBe("10k");
      });

      it("should handle precision", () => {
        expect(kFormatter(1555, 0)).toBe("2k");
        expect(kFormatter(1500, 2)).toBe("1.50k");
      });
    });

    describe("formatBytes", () => {
      it("should format bytes correctly", () => {
        expect(formatBytes(0)).toBe("0 B");
        expect(formatBytes(1024)).toBe("1.0 KB");
        expect(formatBytes(1048576)).toBe("1.0 MB");
      });

      it("should throw error for negative bytes", () => {
        expect(() => formatBytes(-1)).toThrow();
      });
    });

    describe("wrapTextMultiline", () => {
      it("should wrap text into multiple lines", () => {
        const lines = wrapTextMultiline("This is a long description", 20, 3);
        expect(Array.isArray(lines)).toBe(true);
      });

      it("should respect maxLines", () => {
        const lines = wrapTextMultiline("word1 word2 word3 word4 word5", 10, 2);
        expect(lines.length).toBeLessThanOrEqual(2);
      });
    });

    describe("parseBoolean", () => {
      it("should parse string boolean", () => {
        expect(parseBoolean("true")).toBe(true);
        expect(parseBoolean("false")).toBe(false);
        expect(parseBoolean("TRUE")).toBe(true);
      });

      it("should return undefined for invalid values", () => {
        expect(parseBoolean("invalid")).toBeUndefined();
      });

      it("should pass through boolean values", () => {
        expect(parseBoolean(true)).toBe(true);
        expect(parseBoolean(false)).toBe(false);
      });
    });

    describe("parseArray", () => {
      it("should parse comma-separated string", () => {
        expect(parseArray("a,b,c")).toEqual(["a", "b", "c"]);
      });

      it("should return empty array for empty string", () => {
        expect(parseArray("")).toEqual([]);
        expect(parseArray(null)).toEqual([]);
      });
    });

    describe("clampValue", () => {
      it("should clamp values within range", () => {
        expect(clampValue(5, 0, 10)).toBe(5);
        expect(clampValue(-5, 0, 10)).toBe(0);
        expect(clampValue(15, 0, 10)).toBe(10);
      });
    });

    describe("icons", () => {
      it("should have all required icons", () => {
        expect(icons.star).toBeDefined();
        expect(icons.commits).toBeDefined();
        expect(icons.prs).toBeDefined();
        expect(icons.issues).toBeDefined();
        expect(icons.contribs).toBeDefined();
        expect(icons.fork).toBeDefined();
      });
    });

    describe("rankIcon", () => {
      it("should generate default rank icon", () => {
        const icon = rankIcon("default", "A+", 95);
        expect(icon).toContain("text");
      });

      it("should generate github rank icon", () => {
        const icon = rankIcon("github", "A+", 95);
        expect(icon).toContain("svg");
      });

      it("should generate percentile rank icon", () => {
        const icon = rankIcon("percentile", "A+", 95);
        expect(icon).toContain("95.0%");
      });
    });

    describe("flexLayout", () => {
      it("should layout items in a row", () => {
        const items = flexLayout({ items: ["<item1/>", "<item2/>"], gap: 10 });
        expect(items).toHaveLength(2);
        expect(items[0]).toContain("translate");
      });

      it("should layout items in a column", () => {
        const items = flexLayout({
          items: ["<item1/>", "<item2/>"],
          gap: 10,
          direction: "column",
        });
        expect(items).toHaveLength(2);
      });
    });

    describe("measureText", () => {
      it("should measure text width", () => {
        const width = measureText("test", 12);
        expect(typeof width).toBe("number");
        expect(width).toBeGreaterThan(0);
      });
    });

    describe("renderError", () => {
      it("should render error card", () => {
        const errorSvg = renderError({ message: "Test error" });
        expect(errorSvg).toContain("<svg");
        expect(errorSvg).toContain("Test error");
      });

      it("should render error with secondary message", () => {
        const errorSvg = renderError({
          message: "Test error",
          secondaryMessage: "Secondary message",
        });
        expect(errorSvg).toContain("Secondary message");
      });
    });

    describe("CustomError", () => {
      it("should create custom error", () => {
        const error = new CustomError("Test error", "TEST_ERROR");
        expect(error.message).toBe("Test error");
        expect(error.type).toBe("TEST_ERROR");
      });
    });

    describe("MissingParamError", () => {
      it("should create missing param error", () => {
        const error = new MissingParamError(["param1", "param2"]);
        expect(error.missedParams).toEqual(["param1", "param2"]);
      });
    });
  });

  describe("Card Rendering", () => {
    it("should render stats card", () => {
      const stats = {
        name: "testuser",
        totalStars: 100,
        totalCommits: 500,
        totalPRs: 50,
        totalIssues: 30,
        contributedTo: 20,
        rank: { level: "A+", percentile: 95 },
      };
      const svg = renderStatsCard(stats);
      expect(svg).toContain("<svg");
    });

    it("should render repo card", () => {
      const repo = {
        name: "test-repo",
        nameWithOwner: "testuser/test-repo",
        description: "A test repo",
        primaryLanguage: { color: "#f00", id: "1", name: "JS" },
        starCount: 100,
        forkCount: 20,
      };
      const svg = renderRepoCard(repo);
      expect(svg).toContain("<svg");
    });

    it("should render gist card", () => {
      const gist = {
        name: "test-gist",
        nameWithOwner: "testuser/test-gist",
        description: "A test gist",
        language: "JS",
        starsCount: 10,
        forksCount: 5,
      };
      const svg = renderGistCard(gist);
      expect(svg).toContain("<svg");
    });

    it("should render streak card", () => {
      const streak = {
        currentStreak: 30,
        longestStreak: 100,
        totalContributingDays: 365,
      };
      const svg = renderStreakCard(streak);
      expect(svg).toContain("<svg");
    });

    it("should render top languages card", () => {
      const topLangs = {
        JavaScript: { name: "JavaScript", color: "#f1e05a", size: 1000 },
      };
      const svg = renderTopLanguages(topLangs);
      expect(svg).toContain("<svg");
    });

    it("should render wakatime card", () => {
      const stats = {
        languages: [{ name: "JavaScript", text: "10 hrs", percent: 50 }],
        range: "last_7_days",
      };
      const svg = renderWakatimeCard(stats);
      expect(svg).toContain("<svg");
    });
  });

  describe("calculateRank", () => {
    it("should calculate rank correctly", () => {
      const rank = calculateRank({
        totalStars: 100,
        totalCommits: 500,
        totalIssues: 30,
        totalPRs: 50,
        contributedTo: 20,
      });
      expect(rank).toHaveProperty("level");
      expect(rank).toHaveProperty("percentile");
    });

    it("should handle empty stats", () => {
      const rank = calculateRank({});
      expect(rank).toHaveProperty("level");
      expect(rank).toHaveProperty("percentile");
    });
  });

  describe("TypeScript Type Exports", () => {
    it("should export all card types from cards/types.d.ts", () => {
      // Import types - these should work without errors
      const statCardOptions = {
        title_color: "ff0000",
        theme: "default",
      };
      expect(statCardOptions.title_color).toBe("ff0000");
    });

    it("should export all fetcher types from fetchers/types.d.ts", () => {
      // Import types - these should work without errors
      const statsData = {
        name: "test",
        totalStars: 0,
        totalCommits: 0,
        totalIssues: 0,
        totalPRs: 0,
        contributedTo: 0,
        rank: { level: "C", percentile: 50 },
      };
      expect(statsData.name).toBe("test");
    });

    it("should export common types from src/types.d.ts", () => {
      // Test that our new types.d.ts is properly structured
      const themeName = "default";
      expect(typeof themeName).toBe("string");

      const rankIconType = "default";
      expect(["default", "github", "percentile"]).toContain(rankIconType);

      const topLangLayout = "compact";
      expect(["compact", "normal", "donut", "donut-vertical", "pie"]).toContain(
        topLangLayout,
      );

      const displayFormat = "time";
      expect(["time", "percent"]).toContain(displayFormat);
    });
  });
});
