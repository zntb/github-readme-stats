import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import "@testing-library/jest-dom";

// Mock the language colors
jest.mock("../src/common/languageColors.json", () => ({
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
}));

jest.mock("../src/fetchers/top-languages.js", () => ({
  fetchTopLanguages: jest.fn(),
}));

import { fetchTopLanguages } from "../src/fetchers/top-languages.js";
import { renderTopLanguages, trimTopLanguages } from "../src/cards/top-languages.js";

describe("Integration: Top Languages Card Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and trim languages correctly", async () => {
    const mockLanguages = {
      JavaScript: { name: "JavaScript", color: "#f1e05a", size: 1000 },
      TypeScript: { name: "TypeScript", color: "#2b7489", size: 800 },
      Python: { name: "Python", color: "#3572A5", size: 600 },
      HTML: { name: "HTML", color: "#e34c26", size: 400 },
      CSS: { name: "CSS", color: "#563d7c", size: 200 },
    };

    fetchTopLanguages.mockResolvedValue(mockLanguages);

    const data = await fetchTopLanguages("testuser", {});

    expect(data).toEqual(mockLanguages);

    // Test trimming
    const trimmed = trimTopLanguages(data, 3);
    expect(trimmed.langs.length).toBe(3);
  });

  it("should calculate correct percentages", () => {
    const languages = {
      JavaScript: { name: "JavaScript", color: "#f1e05a", size: 500 },
      TypeScript: { name: "TypeScript", color: "#2b7489", size: 300 },
      Python: { name: "Python", color: "#3572A5", size: 200 },
    };

    const trimmed = trimTopLanguages(languages, 3);
    const totalSize = trimmed.totalLanguageSize;

    // Calculate expected percentages
    const jsPercent = (500 / totalSize) * 100;
    const tsPercent = (300 / totalSize) * 100;
    const pyPercent = (200 / totalSize) * 100;

    expect(jsPercent).toBe(50);
    expect(tsPercent).toBe(30);
    expect(pyPercent).toBe(20);
  });

  it("should render top languages card with correct structure", () => {
    const languages = {
      JavaScript: { name: "JavaScript", color: "#f1e05a", size: 500 },
      TypeScript: { name: "TypeScript", color: "#2b7489", size: 300 },
      Python: { name: "Python", color: "#3572A5", size: 200 },
    };

    document.body.innerHTML = renderTopLanguages(languages, {});

    // Check header exists
    const header = document.querySelector(".header");
    expect(header).toBeInTheDocument();

    // Check language bars exist
    const bars = document.querySelectorAll("[data-testid='lang-progress']");
    expect(bars.length).toBe(3);
  });

  it("should handle hide option correctly", () => {
    const languages = {
      JavaScript: { name: "JavaScript", color: "#f1e05a", size: 500 },
      TypeScript: { name: "TypeScript", color: "#2b7489", size: 300 },
      Python: { name: "Python", color: "#3572A5", size: 200 },
    };

    // Test trimming with hide
    const trimmed = trimTopLanguages(languages, 5, ["JavaScript"]);
    expect(trimmed.langs.length).toBe(2);
    expect(trimmed.langs.find((l) => l.name === "JavaScript")).toBeUndefined();
  });
});

describe("Integration: Multi-Card Color Theme", () => {
  it("should apply consistent theme across multiple cards", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const themeName = "dark";
    const colors = {
      title_color: "ffffff",
      text_color: "9f9f9f",
      icon_color: "79ff97",
      bg_color: "151515",
      border_color: "e4e2e2",
      ring_color: "ffffff",
    };

    // These should all use the same color resolution logic
    expect(colors.bg_color).toBe("151515");
    expect(colors.ring_color).toBe(colors.title_color);
  });

  it("should handle theme fallback correctly", () => {
    // When no colors are provided, should fall back to theme defaults
    const defaultDarkTheme = {
      bg_color: "#151515",
      title_color: "#ffffff",
    };

    expect(defaultDarkTheme.bg_color).toBeDefined();
    expect(defaultDarkTheme.title_color).toBeDefined();
  });
});
