import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { renderWakatimeCard } from "../src/cards/wakatime.js";

const wakaTimeData = {
  is_coding_activity_visible: true,
  is_other_usage_visible: true,
  range: "last_7_days",
  languages: [
    { digital: "0:19", hours: 0, minutes: 19, name: "Other", percent: 60, text: "19 mins", total_seconds: 1170 },
    { digital: "0:01", hours: 0, minutes: 1, name: "TypeScript", percent: 40, text: "1 min", total_seconds: 83 },
  ],
};

describe("Test Render WakaTime Card", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderWakatimeCard(wakaTimeData);
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent(
      "WakaTime Stats (last 7 days)",
    );
    expect(queryByTestId(document.body, "Other")).toBeInTheDocument();
    expect(queryByTestId(document.body, "TypeScript")).toBeInTheDocument();
  });

  it("should render correctly with compact layout", () => {
    document.body.innerHTML = renderWakatimeCard(wakaTimeData, { layout: "compact" });
    expect(document.querySelector("svg")).toBeInTheDocument();
    const langNames = document.querySelectorAll("[data-testid='lang-name']");
    expect(langNames.length).toBeGreaterThan(0);
  });

  it("should hide languages when hide is passed", () => {
    document.body.innerHTML = renderWakatimeCard(wakaTimeData, { hide: ["TypeScript"] });
    expect(queryByTestId(document.body, /TypeScript/i)).toBeNull();
    expect(queryByTestId(document.body, "Other")).not.toBeNull();
  });

  it("should render translations", () => {
    document.body.innerHTML = renderWakatimeCard({}, { locale: "cn" });
    expect(document.getElementsByClassName("header")[0]).toHaveTextContent("WakaTime 周统计");
  });

  it("should render without rounding", () => {
    document.body.innerHTML = renderWakatimeCard(wakaTimeData, { border_radius: "0" });
    expect(document.querySelector("rect")).toHaveAttribute("rx", "0");
    document.body.innerHTML = renderWakatimeCard(wakaTimeData, {});
    expect(document.querySelector("rect")).toHaveAttribute("rx", "4.5");
  });

  it("should show no coding activity message when languages is undefined", () => {
    document.body.innerHTML = renderWakatimeCard(
      { ...wakaTimeData, languages: undefined },
      {},
    );
    expect(document.querySelector(".stat").textContent).toBe("No coding activity this week");
  });

  it("should show no coding activity message in compact layout when no activity", () => {
    document.body.innerHTML = renderWakatimeCard(
      { ...wakaTimeData, languages: undefined },
      { layout: "compact" },
    );
    expect(document.querySelector(".stat").textContent).toBe("No coding activity this week");
  });

  it("should show not public message when coding activity not visible", () => {
    document.body.innerHTML = renderWakatimeCard(
      { ...wakaTimeData, languages: undefined, is_coding_activity_visible: false },
      {},
    );
    expect(document.querySelector(".stat").textContent).toBe("WakaTime user profile not public");
  });
});
