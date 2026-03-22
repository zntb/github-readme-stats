import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { renderStreakCard } from "../src/cards/streak.js";

/**
 * @type {{ currentStreak: number, longestStreak: number, totalContributingDays: number }}
 */
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

    expect(queryByTestId(document.body, "currentStreak")).toHaveTextContent(
      "5",
    );
    expect(queryByTestId(document.body, "longestStreak")).toHaveTextContent(
      "30",
    );
    expect(
      queryByTestId(document.body, "totalContributingDays"),
    ).toHaveTextContent("150");
    expect(queryByTestId(document.body, "card-bg")).toBeInTheDocument();
  });

  it("should hide title when hide_title is true", () => {
    document.body.innerHTML = renderStreakCard(streakData, {
      hide_title: true,
    });

    // When hide_title is true, there should be no element with class "header"
    const headers = document.getElementsByClassName("header");
    expect(headers.length).toBe(0);
  });

  it("should hide border when hide_border is true", () => {
    document.body.innerHTML = renderStreakCard(streakData, {
      hide_border: true,
    });

    const cardBg = queryByTestId(document.body, "card-bg");
    expect(cardBg).toHaveAttribute("stroke-opacity", "0");
  });

  it("should render custom title", () => {
    document.body.innerHTML = renderStreakCard(streakData, {
      custom_title: "My Streak",
    });

    const [header] = document.getElementsByClassName("header");
    expect(header).toHaveTextContent("My Streak");
  });

  it("should use kFormatter for large numbers", () => {
    const largeData = {
      currentStreak: 1500,
      longestStreak: 5000,
      totalContributingDays: 10000,
    };

    document.body.innerHTML = renderStreakCard(largeData);

    expect(queryByTestId(document.body, "currentStreak")).toHaveTextContent(
      "1.5k",
    );
    expect(queryByTestId(document.body, "longestStreak")).toHaveTextContent(
      "5k",
    );
    expect(
      queryByTestId(document.body, "totalContributingDays"),
    ).toHaveTextContent("10k");
  });

  it("should render with theme colors", () => {
    document.body.innerHTML = renderStreakCard(streakData, { theme: "dark" });

    const [header] = document.getElementsByClassName("header");
    expect(header).toBeInTheDocument();
  });

  it("should render with only positive values (0 values are filtered out)", () => {
    // Note: iconWithLabel filters out values <= 0, so we test with minimum values of 1
    const positiveData = {
      currentStreak: 1,
      longestStreak: 1,
      totalContributingDays: 1,
    };

    document.body.innerHTML = renderStreakCard(positiveData);

    expect(queryByTestId(document.body, "currentStreak")).toHaveTextContent(
      "1",
    );
    expect(queryByTestId(document.body, "longestStreak")).toHaveTextContent(
      "1",
    );
    expect(
      queryByTestId(document.body, "totalContributingDays"),
    ).toHaveTextContent("1");
  });
});
