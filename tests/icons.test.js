import { describe, expect, it } from "@jest/globals";
import { icons, rankIcon } from "../src/common/icons.js";

describe("Test icons.js", () => {
  describe("icons object", () => {
    it("should have star icon", () => {
      expect(icons.star).toBeDefined();
      expect(icons.star).toContain("<path");
    });

    it("should have commits icon", () => {
      expect(icons.commits).toBeDefined();
      expect(icons.commits).toContain("<path");
    });

    it("should have prs icon", () => {
      expect(icons.prs).toBeDefined();
      expect(icons.prs).toContain("<path");
    });

    it("should have prs_merged icon", () => {
      expect(icons.prs_merged).toBeDefined();
      expect(icons.prs_merged).toContain("<path");
    });

    it("should have prs_merged_percentage icon", () => {
      expect(icons.prs_merged_percentage).toBeDefined();
      expect(icons.prs_merged_percentage).toContain("<path");
    });

    it("should have issues icon", () => {
      expect(icons.issues).toBeDefined();
      expect(icons.issues).toContain("<path");
    });

    it("should have icon icon", () => {
      expect(icons.icon).toBeDefined();
      expect(icons.icon).toContain("<path");
    });

    it("should have contribs icon", () => {
      expect(icons.contribs).toBeDefined();
      expect(icons.contribs).toContain("<path");
    });

    it("should have fork icon", () => {
      expect(icons.fork).toBeDefined();
      expect(icons.fork).toContain("<path");
    });

    it("should have reviews icon", () => {
      expect(icons.reviews).toBeDefined();
      expect(icons.reviews).toContain("<path");
    });

    it("should have discussions_started icon", () => {
      expect(icons.discussions_started).toBeDefined();
      expect(icons.discussions_started).toContain("<path");
    });

    it("should have discussions_answered icon", () => {
      expect(icons.discussions_answered).toBeDefined();
      expect(icons.discussions_answered).toContain("<path");
    });

    it("should have gist icon", () => {
      expect(icons.gist).toBeDefined();
      expect(icons.gist).toContain("<path");
    });
  });

  describe("rankIcon function", () => {
    it("should return github icon when rankIcon is 'github'", () => {
      const result = rankIcon("github", "S", 10);
      expect(result).toContain('data-view-component="true"');
      expect(result).toContain("github-rank-icon");
    });

    it("should return percentile icon when rankIcon is 'percentile'", () => {
      const result = rankIcon("percentile", "S", 10.5);
      expect(result).toContain('data-testid="percentile-top-header"');
      expect(result).toContain('data-testid="percentile-rank-value"');
      expect(result).toContain("10.5%");
    });

    it("should return default rank icon for other values", () => {
      const result = rankIcon("other", "A", 10);
      expect(result).toContain('data-testid="level-rank-icon"');
      expect(result).toContain("A");
    });

    it("should include rankLevel in default icon", () => {
      const result = rankIcon("default", "S", 0);
      expect(result).toContain("S");
    });
  });
});
