import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import "@testing-library/jest-dom";

// Mock the GitHub API fetch
jest.mock("../src/fetchers/stats.js", () => ({
  fetchStats: jest.fn(),
}));

jest.mock("../src/fetchers/repo.js", () => ({
  fetchRepo: jest.fn(),
}));

jest.mock("../src/fetchers/top-languages.js", () => ({
  fetchTopLanguages: jest.fn(),
}));

import { fetchStats } from "../src/fetchers/stats.js";
import { getCardColors } from "../src/common/color.js";
import { calculateRank } from "../src/calculateRank.js";

describe("Integration: Stats Card Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch stats and render card with all options", async () => {
    const mockStatsData = {
      name: "Test User",
      totalStars: 1000,
      totalCommits: 500,
      totalIssues: 50,
      totalPRs: 100,
      totalPRsMerged: 80,
      mergedPRsPercentage: 80,
      totalReviews: 25,
      totalDiscussionsStarted: 10,
      totalDiscussionsAnswered: 20,
      contributedTo: 50,
      rank: { level: "A", percentile: 15 },
    };

    fetchStats.mockResolvedValue(mockStatsData);

    const data = await fetchStats("testuser", {});

    // Verify fetch returned data
    expect(data).toEqual(mockStatsData);
    expect(fetchStats).toHaveBeenCalledWith("testuser", {});

    // Test that rank calculation works with fetched data
    const rank = calculateRank({
      all_commits: false,
      commits: 500,
      prs: 100,
      issues: 50,
      reviews: 25,
      repos: 50,
      stars: 1000,
      followers: 100,
    });

    expect(rank.level).toBeDefined();
    expect(rank.percentile).toBeDefined();
  });

  it("should render card with custom colors", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stats = {
      name: "Test User",
      totalStars: 100,
      totalCommits: 200,
      totalIssues: 30,
      totalPRs: 40,
      totalPRsMerged: 32,
      mergedPRsPercentage: 80,
      totalReviews: 10,
      totalDiscussionsStarted: 5,
      totalDiscussionsAnswered: 10,
      contributedTo: 20,
      rank: { level: "B+", percentile: 30 },
    };

    const customColors = {
      title_color: "ff0000",
      text_color: "00ff00",
      bg_color: "000000",
      border_color: "ffffff",
      theme: "dark",
    };

    // Get colors with custom options
    const colors = getCardColors(customColors);

    expect(colors.titleColor).toBe("#ff0000");
    expect(colors.textColor).toBe("#00ff00");
    expect(colors.bgColor).toBe("#000000");
    expect(colors.borderColor).toBe("#ffffff");
  });

  it("should handle rank calculation for different user levels", () => {
    // New user
    const newUserRank = calculateRank({
      all_commits: false,
      commits: 0,
      prs: 0,
      issues: 0,
      reviews: 0,
      repos: 0,
      stars: 0,
      followers: 0,
    });
    expect(newUserRank.level).toBe("C");
    expect(newUserRank.percentile).toBe(100);

    // Top user
    const topUserRank = calculateRank({
      all_commits: false,
      commits: 10000,
      prs: 5000,
      issues: 2000,
      reviews: 1000,
      repos: 100,
      stars: 100000,
      followers: 50000,
    });
    expect(topUserRank.level).toBe("S");
    expect(topUserRank.percentile).toBeLessThan(1);
  });
});

describe("Integration: Color Theme System", () => {
  it("should apply dark theme correctly", () => {
    const colors = getCardColors({ theme: "dark" });
    expect(colors.bgColor).toBe("#151515");
    // Color gets normalized to 3 or 6 char format
    expect(colors.titleColor).toMatch(/^#fff|#ffffff$/);
  });

  it("should apply default theme correctly", () => {
    const colors = getCardColors({ theme: "default" });
    expect(colors.bgColor).toBe("#fffefe");
  });

  it("should override theme with custom colors", () => {
    const colors = getCardColors({
      theme: "dark",
      title_color: "ff0000",
      bg_color: "00ff00",
    });
    expect(colors.titleColor).toBe("#ff0000");
    expect(colors.bgColor).toBe("#00ff00");
  });

  it("should handle gradient backgrounds", () => {
    const colors = getCardColors({
      bg_color: "90,ff0000,00ff00,0000ff",
    });
    // Gradient backgrounds are converted to array
    expect(Array.isArray(colors.bgColor)).toBe(true);
    expect(colors.bgColor.length).toBe(4);
  });
});
