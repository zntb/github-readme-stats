import { describe, expect, it } from "@jest/globals";
import { renderMultiColumnLayout } from "../src/common/render.js";

describe("renderMultiColumnLayout", () => {
  const mockCard1 = `<svg width="287" height="100">Card 1</svg>`;
  const mockCard2 = `<svg width="287" height="100">Card 2</svg>`;
  const mockCard3 = `<svg width="287" height="100">Card 3</svg>`;
  const mockCard4 = `<svg width="287" height="100">Card 4</svg>`;

  it("should render empty string for empty items array", () => {
    const result = renderMultiColumnLayout({ items: [] });
    expect(result).toBe("");
  });

  it("should render empty string when items is undefined", () => {
    const result = renderMultiColumnLayout({ items: undefined });
    expect(result).toBe("");
  });

  it("should render single card with auto-calculated dimensions", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1],
      columns: 1,
      gap: 25,
    });
    // Total width: 287 (auto-calculated from SVG)
    expect(result).toContain('width="287"');
    // Height: 100 (auto-calculated from SVG)
    expect(result).toContain('height="100"');
    expect(result).toContain("Card 1");
  });

  it("should render two cards side by side in two columns", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1, mockCard2],
      columns: 2,
      gap: 25,
    });
    // Total width: 2 * 287 + 25 = 599
    expect(result).toContain('width="599"');
    // Height remains 100 since it's single row
    expect(result).toContain('height="100"');
    expect(result).toContain("Card 1");
    expect(result).toContain("Card 2");
  });

  it("should render four cards in 2x2 grid", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1, mockCard2, mockCard3, mockCard4],
      columns: 2,
      gap: 25,
    });
    // Total width: 2 * 287 + 25 = 599
    expect(result).toContain('width="599"');
    // Total height: 2 * 100 + 25 = 225
    expect(result).toContain('height="225"');
    expect(result).toContain("Card 1");
    expect(result).toContain("Card 2");
    expect(result).toContain("Card 3");
    expect(result).toContain("Card 4");
  });

  it("should handle more items than columns (creates new row)", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1, mockCard2, mockCard3],
      columns: 2,
      gap: 25,
    });
    // Total width: 2 * 287 + 25 = 599
    expect(result).toContain('width="599"');
    // Total height: 2 * 100 + 25 = 225 (2 rows)
    expect(result).toContain('height="225"');
  });

  it("should respect custom totalWidth when provided", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1],
      columns: 1,
      gap: 25,
      totalWidth: 500,
    });
    expect(result).toContain('width="500"');
  });

  it("should respect custom totalHeight when provided", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1],
      columns: 1,
      gap: 25,
      totalHeight: 200,
    });
    expect(result).toContain('height="200"');
  });

  it("should use rows parameter when specified", () => {
    const result = renderMultiColumnLayout({
      items: [mockCard1, mockCard2, mockCard3, mockCard4, mockCard3, mockCard4],
      columns: 3,
      rows: 2,
      gap: 25,
    });
    // With 2 rows and 3 columns = 6 cards
    // 3 columns with gap: 3 * 287 + 2 * 25 = 911
    expect(result).toContain('width="911"');
    // Height: 2 * 100 + 25 = 225
    expect(result).toContain('height="225"');
  });

  it("should handle different card sizes in same layout", () => {
    const smallCard = `<svg width="200" height="80">Small</svg>`;
    const largeCard = `<svg width="300" height="150">Large</svg>`;
    const result = renderMultiColumnLayout({
      items: [smallCard, largeCard],
      columns: 2,
      gap: 25,
    });
    // Max width per column: 200, 300
    // Total width: 200 + 300 + 25 = 525
    expect(result).toContain('width="525"');
    // Max height: 150
    expect(result).toContain('height="150"');
  });
});
