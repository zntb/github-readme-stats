import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { renderRepoCard } from "../src/cards/repo.js";

const repo = {
  nameWithOwner: "anuraghazra/convoychat",
  name: "convoychat",
  description: "Help us take over the world! React + TS + GraphQL Chat App",
  primaryLanguage: { color: "#2b7489", id: "MDg6TGFuZ3VhZ2UyODc=", name: "TypeScript" },
  starCount: 38000,
  forkCount: 100,
};

describe("Test renderRepoCard", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderRepoCard(repo);
    const [header] = document.getElementsByClassName("header");
    expect(header).toHaveTextContent("convoychat");
    expect(header).not.toHaveTextContent("anuraghazra");
    expect(document.getElementsByClassName("description")[0]).toHaveTextContent(
      "Help us take over the world! React + TS + GraphQL Chat App",
    );
    expect(queryByTestId(document.body, "stargazers")).toHaveTextContent("38k");
    expect(queryByTestId(document.body, "forkcount")).toHaveTextContent("100");
    expect(queryByTestId(document.body, "lang-name")).toHaveTextContent("TypeScript");
    expect(queryByTestId(document.body, "lang-color")).toHaveAttribute("fill", "#2b7489");
  });

  it("should display username in title when show_owner is true", () => {
    document.body.innerHTML = renderRepoCard(repo, { show_owner: true });
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent(
      "anuraghazra/convoychat",
    );
  });

  it("should trim header if too long", () => {
    document.body.innerHTML = renderRepoCard({
      ...repo,
      name: "some-really-long-repo-name-for-test-purposes",
    });
    expect(document.getElementsByClassName("header")[0].textContent).toBe(
      "some-really-long-repo-name-for-test...",
    );
  });

  it("should hide language if primaryLanguage is null", () => {
    document.body.innerHTML = renderRepoCard({ ...repo, primaryLanguage: null });
    expect(queryByTestId(document.body, "primary-lang")).toBeNull();
  });

  it("should not render star count if zero", () => {
    document.body.innerHTML = renderRepoCard({ ...repo, starCount: 0 });
    expect(queryByTestId(document.body, "stargazers")).toBeNull();
    expect(queryByTestId(document.body, "forkcount")).toBeInTheDocument();
  });

  it("should render without rounding", () => {
    document.body.innerHTML = renderRepoCard(repo, { border_radius: "0" });
    expect(document.querySelector("rect")).toHaveAttribute("rx", "0");
    document.body.innerHTML = renderRepoCard(repo, {});
    expect(document.querySelector("rect")).toHaveAttribute("rx", "4.5");
  });

  it("should fallback to default description when undefined", () => {
    document.body.innerHTML = renderRepoCard({ ...repo, description: undefined });
    expect(document.getElementsByClassName("description")[0]).toHaveTextContent(
      "No description provided",
    );
  });
});
