import { describe, expect, it } from "@jest/globals";
import { getByTestId, queryAllByTestId, queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { cssToObject } from "@uppercod/css-to-object";
import { renderStatsCard } from "../src/cards/stats.js";
import { CustomError } from "../src/common/error.js";
import { themes } from "../themes/index.js";

const stats = {
  name: "Anurag Hazra",
  totalStars: 100, totalCommits: 200, totalIssues: 300, totalPRs: 400,
  totalPRsMerged: 320, mergedPRsPercentage: 80, totalReviews: 50,
  totalDiscussionsStarted: 10, totalDiscussionsAnswered: 50,
  contributedTo: 500, rank: { level: "A+", percentile: 40 },
};

describe("Test renderStatsCard", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderStatsCard(stats);
    expect(document.getElementsByClassName("header")[0].textContent).toBe("Anurag Hazra's GitHub Stats");
    expect(document.body.getElementsByTagName("svg")[0].getAttribute("height")).toBe("195");
    expect(getByTestId(document.body, "stars").textContent).toBe("100");
    expect(getByTestId(document.body, "commits").textContent).toBe("200");
    expect(getByTestId(document.body, "issues").textContent).toBe("300");
    expect(getByTestId(document.body, "prs").textContent).toBe("400");
    expect(getByTestId(document.body, "contribs").textContent).toBe("500");
    expect(queryByTestId(document.body, "card-bg")).toBeInTheDocument();
    expect(queryByTestId(document.body, "rank-circle")).toBeInTheDocument();
    // Default hidden stats
    expect(queryByTestId(document.body, "reviews")).not.toBeInTheDocument();
    expect(queryByTestId(document.body, "prs_merged")).not.toBeInTheDocument();
  });

  it("should have proper name apostrophe", () => {
    document.body.innerHTML = renderStatsCard({ ...stats, name: "Anil Das" });
    expect(document.getElementsByClassName("header")[0].textContent).toBe("Anil Das' GitHub Stats");

    document.body.innerHTML = renderStatsCard({ ...stats, name: "Felix" });
    expect(document.getElementsByClassName("header")[0].textContent).toBe("Felix's GitHub Stats");
  });

  it("should hide individual stats", () => {
    document.body.innerHTML = renderStatsCard(stats, { hide: ["issues", "prs", "contribs"] });
    expect(document.body.getElementsByTagName("svg")[0].getAttribute("height")).toBe("150");
    expect(queryByTestId(document.body, "issues")).toBeNull();
    expect(queryByTestId(document.body, "prs")).toBeNull();
    expect(queryByTestId(document.body, "contribs")).toBeNull();
  });

  it("should show additional stats", () => {
    document.body.innerHTML = renderStatsCard(stats, {
      show: ["reviews", "discussions_started", "discussions_answered", "prs_merged", "prs_merged_percentage"],
    });
    expect(queryByTestId(document.body, "reviews")).toBeDefined();
    expect(queryByTestId(document.body, "prs_merged")).toBeDefined();
    expect(queryByTestId(document.body, "prs_merged_percentage")).toBeDefined();
  });

  it("should hide_rank", () => {
    document.body.innerHTML = renderStatsCard(stats, { hide_rank: true });
    expect(queryByTestId(document.body, "rank-circle")).not.toBeInTheDocument();
  });

  it("should render with custom width", () => {
    document.body.innerHTML = renderStatsCard(stats);
    expect(document.querySelector("svg")).toHaveAttribute("width", "450");

    document.body.innerHTML = renderStatsCard(stats, { card_width: 500 });
    expect(document.querySelector("svg")).toHaveAttribute("width", "500");
  });

  it("should render default colors properly", () => {
    document.body.innerHTML = renderStatsCard(stats);
    const styleTag = document.querySelector("style");
    const stylesObject = cssToObject(styleTag.textContent);
    expect(stylesObject[":host"][".header "].fill.trim()).toBe("#2f80ed");
    expect(stylesObject[":host"][".stat "].fill.trim()).toBe("#434d58");
    expect(queryByTestId(document.body, "card-bg")).toHaveAttribute("fill", "#fffefe");
  });

  it("should render custom colors properly", () => {
    const customColors = { title_color: "5a0", icon_color: "1b998b", text_color: "9991", bg_color: "252525" };
    document.body.innerHTML = renderStatsCard(stats, { ...customColors });
    const stylesObject = cssToObject(document.querySelector("style").innerHTML);
    expect(stylesObject[":host"][".header "].fill.trim()).toBe(`#${customColors.title_color}`);
    expect(stylesObject[":host"][".stat "].fill.trim()).toBe(`#${customColors.text_color}`);
    expect(queryByTestId(document.body, "card-bg")).toHaveAttribute("fill", "#252525");
  });

  it("should render without rounding", () => {
    document.body.innerHTML = renderStatsCard(stats, { border_radius: "0" });
    expect(document.querySelector("rect")).toHaveAttribute("rx", "0");
    document.body.innerHTML = renderStatsCard(stats, {});
    expect(document.querySelector("rect")).toHaveAttribute("rx", "4.5");
  });

  it("should shorten values", () => {
    const s = { ...stats, totalCommits: 1999 };
    document.body.innerHTML = renderStatsCard(s);
    expect(getByTestId(document.body, "commits").textContent).toBe("2k");
    document.body.innerHTML = renderStatsCard(s, { number_format: "long" });
    expect(getByTestId(document.body, "commits").textContent).toBe("1999");
  });

  it("should throw if all stats and rank are hidden", () => {
    expect(() =>
      renderStatsCard(stats, {
        hide: ["stars", "commits", "prs", "issues", "contribs"],
        hide_rank: true,
      }),
    ).toThrow(new CustomError("Could not render stats card.", "Either stats or rank are required."));
  });
});
