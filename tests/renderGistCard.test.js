import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { renderGistCard } from "../src/cards/gist.js";

const data = {
  name: "test",
  nameWithOwner: "anuraghazra/test",
  description: "Small test repository with different Python programs.",
  language: "Python",
  starsCount: 163,
  forksCount: 19,
};

describe("test renderGistCard", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderGistCard(data);
    const [header] = document.getElementsByClassName("header");
    expect(header).toHaveTextContent("test");
    expect(header).not.toHaveTextContent("anuraghazra");
    expect(document.getElementsByClassName("description")[0]).toHaveTextContent(
      "Small test repository with different Python programs.",
    );
    expect(queryByTestId(document.body, "starsCount")).toHaveTextContent("163");
    expect(queryByTestId(document.body, "forksCount")).toHaveTextContent("19");
    expect(queryByTestId(document.body, "lang-name")).toHaveTextContent("Python");
  });

  it("should display username in title when show_owner is true", () => {
    document.body.innerHTML = renderGistCard(data, { show_owner: true });
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent("anuraghazra/test");
  });

  it("should trim header if name is too long", () => {
    document.body.innerHTML = renderGistCard({
      ...data,
      name: "some-really-long-repo-name-for-test-purposes",
    });
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent(
      "some-really-long-repo-name-for-test...",
    );
  });

  it("should render emojis in description", () => {
    document.body.innerHTML = renderGistCard({
      ...data,
      description: "This is a test gist with :heart: emoji.",
    });
    expect(document.getElementsByClassName("description")[0]).toHaveTextContent("❤️");
  });

  it("should not render star or fork count if zero", () => {
    document.body.innerHTML = renderGistCard({ ...data, starsCount: 0 });
    expect(queryByTestId(document.body, "starsCount")).toBeNull();
    expect(queryByTestId(document.body, "forksCount")).toBeInTheDocument();

    document.body.innerHTML = renderGistCard({ ...data, starsCount: 0, forksCount: 0 });
    expect(queryByTestId(document.body, "starsCount")).toBeNull();
    expect(queryByTestId(document.body, "forksCount")).toBeNull();
  });

  it("should render without rounding", () => {
    document.body.innerHTML = renderGistCard(data, { border_radius: "0" });
    expect(document.querySelector("rect")).toHaveAttribute("rx", "0");
    document.body.innerHTML = renderGistCard(data, {});
    expect(document.querySelector("rect")).toHaveAttribute("rx", "4.5");
  });

  it("should fallback to default description", () => {
    document.body.innerHTML = renderGistCard({ ...data, description: undefined });
    expect(document.getElementsByClassName("description")[0]).toHaveTextContent(
      "No description provided",
    );
  });

  it("should render custom colors", () => {
    document.body.innerHTML = renderGistCard(data, {
      title_color: "5a0", text_color: "9991", bg_color: "252525",
    });
    expect(queryByTestId(document.body, "card-bg")).toHaveAttribute("fill", "#252525");
  });
});
