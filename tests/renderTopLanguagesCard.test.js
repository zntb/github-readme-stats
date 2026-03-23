import { describe, expect, it } from "@jest/globals";
import { queryAllByTestId, queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import {
  renderTopLanguages,
  trimTopLanguages,
  calculateNormalLayoutHeight,
  calculateCompactLayoutHeight,
  getDefaultLanguagesCountByLayout,
  MIN_CARD_WIDTH,
} from "../src/cards/top-languages.js";

const langs = {
  HTML: { color: "#0f0", name: "HTML", size: 200 },
  javascript: { color: "#0ff", name: "javascript", size: 200 },
  css: { color: "#ff0", name: "css", size: 100 },
};

describe("Test renderTopLanguages helper functions", () => {
  it("calculateNormalLayoutHeight", () => {
    expect(calculateNormalLayoutHeight(0)).toBe(85);
    expect(calculateNormalLayoutHeight(1)).toBe(125);
    expect(calculateNormalLayoutHeight(5)).toBe(285);
  });

  it("calculateCompactLayoutHeight", () => {
    expect(calculateCompactLayoutHeight(0)).toBe(90);
    expect(calculateCompactLayoutHeight(2)).toBe(115);
    expect(calculateCompactLayoutHeight(4)).toBe(140);
  });

  it("trimTopLanguages", () => {
    expect(trimTopLanguages([], 5)).toStrictEqual({ langs: [], totalLanguageSize: 0 });
    const result = trimTopLanguages(langs, 5);
    expect(result.langs.length).toBe(3);
    expect(result.totalLanguageSize).toBe(500);
  });

  it("trimTopLanguages with hide", () => {
    const result = trimTopLanguages(langs, 5, ["HTML"]);
    expect(result.langs.map((l) => l.name)).not.toContain("HTML");
    expect(result.totalLanguageSize).toBe(300);
  });

  it("getDefaultLanguagesCountByLayout", () => {
    expect(getDefaultLanguagesCountByLayout({ layout: "normal" })).toBe(5);
    expect(getDefaultLanguagesCountByLayout({ layout: "compact" })).toBe(6);
    expect(getDefaultLanguagesCountByLayout({ layout: "donut" })).toBe(5);
    expect(getDefaultLanguagesCountByLayout({ layout: "pie" })).toBe(6);
    expect(getDefaultLanguagesCountByLayout({})).toBe(5);
    expect(getDefaultLanguagesCountByLayout({ hide_progress: true })).toBe(6);
  });
});

describe("Test renderTopLanguages", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderTopLanguages(langs);
    expect(queryByTestId(document.body, "header")).toHaveTextContent("Most Used Languages");

    const langNames = queryAllByTestId(document.body, "lang-name");
    expect(langNames[0]).toHaveTextContent("HTML");
    expect(langNames[1]).toHaveTextContent("javascript");
    expect(langNames[2]).toHaveTextContent("css");

    const langBars = queryAllByTestId(document.body, "lang-progress");
    expect(langBars[0]).toHaveAttribute("width", "40%");
    expect(langBars[1]).toHaveAttribute("width", "40%");
    expect(langBars[2]).toHaveAttribute("width", "20%");
  });

  it("should hide languages when hide is passed", () => {
    document.body.innerHTML = renderTopLanguages(langs, { hide: ["HTML"] });
    const names = queryAllByTestId(document.body, "lang-name").map((n) => n.textContent.trim());
    expect(names.some((n) => n.includes("HTML"))).toBe(false);
    expect(names.some((n) => n.includes("javascript"))).toBe(true);
  });

  it("should resize height depending on langs", () => {
    document.body.innerHTML = renderTopLanguages(langs, {});
    expect(document.querySelector("svg")).toHaveAttribute("height", "205");
  });

  it("should render with custom width", () => {
    document.body.innerHTML = renderTopLanguages(langs, {});
    expect(document.querySelector("svg")).toHaveAttribute("width", "300");

    document.body.innerHTML = renderTopLanguages(langs, { card_width: 400 });
    expect(document.querySelector("svg")).toHaveAttribute("width", "400");
  });

  it("should enforce min width", () => {
    document.body.innerHTML = renderTopLanguages(langs, { card_width: 100 });
    expect(document.querySelector("svg")).toHaveAttribute("width", MIN_CARD_WIDTH.toString());
  });

  it("should render default colors properly", () => {
    document.body.innerHTML = renderTopLanguages(langs);
    const style = document.querySelector("style").textContent;
    expect(style).toContain("#2f80ed");
    expect(style).toContain("#434d58");
    expect(queryByTestId(document.body, "card-bg")).toHaveAttribute("fill", "#fffefe");
  });

  it("should render compact layout", () => {
    document.body.innerHTML = renderTopLanguages(langs, { layout: "compact" });
    expect(queryByTestId(document.body, "header")).toHaveTextContent("Most Used Languages");
    const names = queryAllByTestId(document.body, "lang-name");
    expect(names.length).toBeGreaterThan(0);
    // compact shows percentages in lang-name text
    expect(names[0].textContent).toMatch(/40\.00%/);
  });

  it("should show no languages data message when empty", () => {
    document.body.innerHTML = renderTopLanguages({});
    expect(document.querySelector(".stat").textContent).toBe("No languages data.");
  });

  it("should render a translated title", () => {
    document.body.innerHTML = renderTopLanguages(langs, { locale: "cn" });
    expect(document.getElementsByClassName("header")[0].textContent).toBe("最常用的语言");
  });

  it("should render without rounding", () => {
    document.body.innerHTML = renderTopLanguages(langs, { border_radius: "0" });
    expect(document.querySelector("rect")).toHaveAttribute("rx", "0");
    document.body.innerHTML = renderTopLanguages(langs, {});
    expect(document.querySelector("rect")).toHaveAttribute("rx", "4.5");
  });

  it("should render with langs_count", () => {
    document.body.innerHTML = renderTopLanguages(langs, { langs_count: 1 });
    expect(queryAllByTestId(document.body, "lang-name").length).toBe(1);
  });
});
