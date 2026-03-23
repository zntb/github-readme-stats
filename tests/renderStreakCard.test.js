import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { renderStreakCard } from "../src/cards/streak.js";

const streakData = {
  currentStreak: 5,
  longestStreak: 30,
  totalContributingDays: 150,
};

describe("Test renderStreakCard", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderStreakCard(streakData);
    const [header] = document.getElementsByClassName("header");
    expect(header).toHaveTextContent("Activity Streak");
    expect(queryByTestId(document.body, "currentStreak")).toHaveTextContent("5");
    expect(queryByTestId(document.body, "longestStreak")).toHaveTextContent("30");
    expect(queryByTestId(document.body, "totalContributingDays")).toHaveTextContent("150");
    expect(queryByTestId(document.body, "card-bg")).toBeInTheDocument();
  });

  it("should hide title when hide_title is true", () => {
    document.body.innerHTML = renderStreakCard(streakData, { hide_title: true });
    expect(document.getElementsByClassName("header").length).toBe(0);
  });

  it("should hide border when hide_border is true", () => {
    document.body.innerHTML = renderStreakCard(streakData, { hide_border: true });
    expect(queryByTestId(document.body, "card-bg")).toHaveAttribute("stroke-opacity", "0");
  });

  it("should render custom title", () => {
    document.body.innerHTML = renderStreakCard(streakData, { custom_title: "My Streak" });
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent("My Streak");
  });

  it("should use kFormatter for large numbers", () => {
    const largeData = { currentStreak: 1500, longestStreak: 5000, totalContributingDays: 10000 };
    document.body.innerHTML = renderStreakCard(largeData);
    expect(queryByTestId(document.body, "currentStreak")).toHaveTextContent("1.5k");
    expect(queryByTestId(document.body, "longestStreak")).toHaveTextContent("5k");
    expect(queryByTestId(document.body, "totalContributingDays")).toHaveTextContent("10k");
  });
});
