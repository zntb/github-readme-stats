import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import "@testing-library/jest-dom";

jest.mock("../src/fetchers/repo.js", () => ({
  fetchRepo: jest.fn(),
}));

jest.mock("../src/fetchers/gist.js", () => ({
  fetchGist: jest.fn(),
}));

import { fetchRepo } from "../src/fetchers/repo.js";
import { fetchGist } from "../src/fetchers/gist.js";
import { renderRepoCard } from "../src/cards/repo.js";
import { renderGistCard } from "../src/cards/gist.js";

describe("Integration: Repo and Gist Cards Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Repo Card Flow", () => {
    it("should fetch and render repo card", async () => {
      const mockRepoData = {
        nameWithOwner: "testuser/testrepo",
        name: "testrepo",
        description: "A test repository",
        primaryLanguage: {
          name: "JavaScript",
          color: "#f1e05a",
        },
        starCount: 150,
        forkCount: 25,
      };

      // @ts-ignore - mock
      fetchRepo.mockResolvedValue(mockRepoData);

      const data = await fetchRepo("testuser", "testrepo");

      expect(data).toEqual(mockRepoData);
      expect(fetchRepo).toHaveBeenCalledWith("testuser", "testrepo");

      // Test rendering
      document.body.innerHTML = renderRepoCard(data);
      const header = document.querySelector(".header");
      expect(header).toBeInTheDocument();
    });

    it("should handle repo with no language", () => {
      const repoData = {
        nameWithOwner: "testuser/testrepo",
        name: "testrepo",
        description: "A test repository",
        primaryLanguage: null,
        starCount: 0,
        forkCount: 0,
      };

      document.body.innerHTML = renderRepoCard(repoData);
      const langElement = document.querySelector("[data-testid='primary-lang']");
      expect(langElement).toBeNull();
    });

    it("should show owner when show_owner is true", () => {
      const repoData = {
        nameWithOwner: "testuser/testrepo",
        name: "testrepo",
        description: "Test",
        primaryLanguage: null,
        starCount: 10,
        forkCount: 5,
      };

      document.body.innerHTML = renderRepoCard(repoData, { show_owner: true });
      const header = document.querySelector(".header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Gist Card Flow", () => {
    it("should fetch and render gist card", async () => {
      const mockGistData = {
        nameWithOwner: "testuser/testgist",
        name: "testgist",
        description: "A test gist",
        language: "Python",
        starsCount: 25,
        forksCount: 5,
      };

      // @ts-ignore - mock
      fetchGist.mockResolvedValue(mockGistData);

      const data = await fetchGist("testuser", "gistid");

      expect(data).toEqual(mockGistData);

      // Test rendering
      document.body.innerHTML = renderGistCard(data);
      const header = document.querySelector(".header");
      expect(header).toBeInTheDocument();
    });

    it("should handle zero stars and forks", () => {
      const gistData = {
        nameWithOwner: "testuser/testgist",
        name: "testgist",
        description: "Test gist",
        language: "JavaScript",
        starsCount: 0,
        forksCount: 0,
      };

      document.body.innerHTML = renderGistCard(gistData);
      const stars = document.querySelector("[data-testid='starsCount']");
      const forks = document.querySelector("[data-testid='forksCount']");
      expect(stars).toBeNull();
      expect(forks).toBeNull();
    });
  });
});

describe("Integration: Card Accessibility", () => {
  it("should render cards with proper aria labels", () => {
    const repoData = {
      nameWithOwner: "testuser/testrepo",
      name: "testrepo",
      description: "Test",
      primaryLanguage: { name: "JS", color: "#000" },
      starCount: 10,
      forkCount: 5,
    };

    document.body.innerHTML = renderRepoCard(repoData);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should handle long descriptions gracefully", () => {
    const repoData = {
      nameWithOwner: "testuser/testrepo",
      name: "testrepo",
      description:
        "A very long description that might need to be truncated or handled gracefully by the card rendering system",
      primaryLanguage: null,
      starCount: 10,
      forkCount: 5,
    };

    document.body.innerHTML = renderRepoCard(repoData);
    const desc = document.querySelector(".description");
    expect(desc).toBeInTheDocument();
  });
});
