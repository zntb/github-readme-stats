import { MultiCard, ColorConfig, GRADIENT_TEMPLATES, GRADIENT_THEMES } from "./types";

/**
 * Build URL for a single card in multi-col mode
 */
export function buildSingleCardUrl(
  card: MultiCard,
  globalUsername: string,
  theme: string,
  colors: ColorConfig,
  gradientEnabled: boolean,
  selectedGradient: string,
  gradientAngle: number,
  gradientColor1: string,
  gradientColor2: string,
  origin: string,
): string {
  const params = new URLSearchParams();

  // Theme/color params
  if (gradientEnabled && (selectedGradient || gradientColor1 || gradientColor2)) {
    const template = GRADIENT_TEMPLATES.find((g) => g.id === selectedGradient);
    const isTheme = GRADIENT_THEMES.includes(selectedGradient);
    if (template) {
      const templateColors = template.colors.map((c: string) => c.replace("#", ""));
      params.set("bg_color", [template.angle, ...templateColors].join(","));
    } else if (isTheme) {
      params.set("theme", selectedGradient);
    } else {
      const c1 = gradientColor1.replace("#", "");
      const c2 = gradientColor2.replace("#", "");
      params.set("bg_color", [gradientAngle, c1, c2].join(","));
    }
    const hex = (c: string) => c.replace("#", "");
    if (hex(colors.titleColor) !== "2f80ed") params.set("title_color", hex(colors.titleColor));
    if (hex(colors.iconColor) !== "4c71f2") params.set("icon_color", hex(colors.iconColor));
    if (hex(colors.textColor) !== "434d58") params.set("text_color", hex(colors.textColor));
    if (hex(colors.borderColor) !== "e4e2e2") params.set("border_color", hex(colors.borderColor));
  } else if (theme) {
    params.set("theme", theme);
  } else {
    const hex = (c: string) => c.replace("#", "");
    if (hex(colors.titleColor) !== "2f80ed") params.set("title_color", hex(colors.titleColor));
    if (hex(colors.iconColor) !== "4c71f2") params.set("icon_color", hex(colors.iconColor));
    if (hex(colors.textColor) !== "434d58") params.set("text_color", hex(colors.textColor));
    if (hex(colors.bgColor) !== "fffefe") params.set("bg_color", hex(colors.bgColor));
    if (hex(colors.borderColor) !== "e4e2e2") params.set("border_color", hex(colors.borderColor));
  }

  let endpoint = "/api";
  // Use card's username for wakatime, otherwise use global username
  const username = card.type === "wakatime" ? card.username : card.username || globalUsername;

  if (card.type === "stats") {
    if (!username) return "";
    params.set("username", username);
    params.set("show_icons", "true");
  } else if (card.type === "pin") {
    if (!username || !card.repo) return "";
    endpoint = "/api/pin";
    params.set("username", username);
    params.set("repo", card.repo);
  } else if (card.type === "top-langs") {
    if (!username) return "";
    endpoint = "/api/top-langs";
    params.set("username", username);
    if (card.layout && card.layout !== "normal") params.set("layout", card.layout);
    if (card.langsCount && card.langsCount !== "5") params.set("langs_count", card.langsCount);
  } else if (card.type === "streak") {
    if (!username) return "";
    endpoint = "/api/streak";
    params.set("username", username);
  } else if (card.type === "gist") {
    if (!card.gistId) return "";
    endpoint = "/api/gist";
    params.set("id", card.gistId);
  } else if (card.type === "wakatime") {
    if (!username) return "";
    endpoint = "/api/wakatime";
    params.set("username", username);
    if (card.layout && card.layout !== "normal") params.set("layout", card.layout);
  }

  return `${origin}${endpoint}?${params.toString()}`;
}

/**
 * Build multi-col HTML snippet for GitHub READMEs.
 *
 * Uses a fixed `height` on every <img> so all cards sit at the same row height
 * while each card renders at its natural width (aspect-ratio preserved).
 * GitHub renders consecutive inline <a><img /></a> blocks side by side.
 */
export function buildMultiHtml(multiUrls: string[], cardHeight: string): string {
  if (multiUrls.length === 0) return "";

  const h = cardHeight && Number(cardHeight) > 0 ? cardHeight : "200";

  return multiUrls
    .map((u) => `<a href="${u}"><img height="${h}" src="${u}" alt="GitHub Stats Card" /></a>`)
    .join("\n");
}
