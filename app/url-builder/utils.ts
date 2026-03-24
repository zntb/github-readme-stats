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
 * Build URL for single card mode
 */
export interface BuildUrlParams {
  cardType: string;
  theme: string;
  colors: ColorConfig;
  gradientEnabled: boolean;
  selectedGradient: string;
  gradientAngle: number;
  gradientColor1: string;
  gradientColor2: string;
  borderRadius: string;
  cardWidth: string;
  cacheSeconds: string;
  locale: string;
  hideBorder: boolean;
  hideTitle: boolean;
  disableAnimations: boolean;
  // Stats
  statsUsername: string;
  statsTitle: string;
  statsHide: string;
  statsShow: string[];
  // Pin
  pinUsername: string;
  pinRepo: string;
  pinTitle: string;
  pinShowOwner: boolean;
  // Top Langs
  langsUsername: string;
  langsTitle: string;
  langsLayout: string;
  langsCount: string;
  // Streak
  streakUsername: string;
  streakTitle: string;
  // Gist
  gistId: string;
  gistShowOwner: boolean;
  // Wakatime
  wakaUsername: string;
  wakaTitle: string;
  wakaLayout: string;
  // Multi
  multiCards: MultiCard[];
}

export function buildUrl(params: BuildUrlParams): { url: string; valid: boolean } {
  const {
    cardType,
    theme,
    colors,
    gradientEnabled,
    selectedGradient,
    gradientAngle,
    gradientColor1,
    gradientColor2,
    borderRadius,
    cardWidth,
    cacheSeconds,
    locale,
    hideBorder,
    hideTitle,
    disableAnimations,
    statsUsername,
    statsTitle,
    statsHide,
    statsShow,
    pinUsername,
    pinRepo,
    pinTitle,
    pinShowOwner,
    langsUsername,
    langsTitle,
    langsLayout,
    langsCount,
    streakUsername,
    streakTitle,
    gistId,
    gistShowOwner,
    wakaUsername,
    wakaTitle,
    wakaLayout,
    multiCards,
  } = params;

  const urlParams = new URLSearchParams();

  // Gradient/Theme/Colors
  if (gradientEnabled && (selectedGradient || gradientColor1 || gradientColor2)) {
    const template = GRADIENT_TEMPLATES.find((g) => g.id === selectedGradient);
    const isTheme = GRADIENT_THEMES.includes(selectedGradient);
    if (template) {
      const templateColors = template.colors.map((c: string) => c.replace("#", ""));
      urlParams.set("bg_color", [template.angle, ...templateColors].join(","));
    } else if (isTheme) {
      urlParams.set("theme", selectedGradient);
    } else {
      const c1 = gradientColor1.replace("#", "");
      const c2 = gradientColor2.replace("#", "");
      urlParams.set("bg_color", [gradientAngle, c1, c2].join(","));
    }
    const hex = (c: string) => c.replace("#", "");
    if (hex(colors.titleColor) !== "2f80ed") urlParams.set("title_color", hex(colors.titleColor));
    if (hex(colors.iconColor) !== "4c71f2") urlParams.set("icon_color", hex(colors.iconColor));
    if (hex(colors.textColor) !== "434d58") urlParams.set("text_color", hex(colors.textColor));
    if (hex(colors.borderColor) !== "e4e2e2")
      urlParams.set("border_color", hex(colors.borderColor));
  } else if (theme) {
    urlParams.set("theme", theme);
  } else {
    const hex = (c: string) => c.replace("#", "");
    if (hex(colors.titleColor) !== "2f80ed") urlParams.set("title_color", hex(colors.titleColor));
    if (hex(colors.iconColor) !== "4c71f2") urlParams.set("icon_color", hex(colors.iconColor));
    if (hex(colors.textColor) !== "434d58") urlParams.set("text_color", hex(colors.textColor));
    if (hex(colors.bgColor) !== "fffefe") urlParams.set("bg_color", hex(colors.bgColor));
    if (hex(colors.borderColor) !== "e4e2e2")
      urlParams.set("border_color", hex(colors.borderColor));
  }

  // Advanced options
  if (borderRadius && borderRadius !== "4.5") urlParams.set("border_radius", borderRadius);
  if (cardWidth) urlParams.set("card_width", cardWidth);
  if (cacheSeconds) urlParams.set("cache_seconds", cacheSeconds);
  if (locale) urlParams.set("locale", locale);
  if (hideBorder) urlParams.set("hide_border", "true");
  if (hideTitle) urlParams.set("hide_title", "true");
  if (disableAnimations) urlParams.set("disable_animations", "true");

  let endpoint = "/api";
  let valid = false;

  if (cardType === "stats") {
    if (statsUsername) {
      urlParams.set("username", statsUsername);
      valid = true;
      if (statsTitle) urlParams.set("custom_title", statsTitle);
      if (statsHide) urlParams.set("hide", statsHide);
      if (statsShow.length > 0) urlParams.set("show", statsShow.join(","));
    }
  } else if (cardType === "pin") {
    if (pinUsername && pinRepo) {
      endpoint = "/api/pin";
      urlParams.set("username", pinUsername);
      urlParams.set("repo", pinRepo);
      valid = true;
      if (pinTitle) urlParams.set("custom_title", pinTitle);
      if (pinShowOwner) urlParams.set("show_owner", "true");
    }
  } else if (cardType === "top-langs") {
    if (langsUsername) {
      endpoint = "/api/top-langs";
      urlParams.set("username", langsUsername);
      valid = true;
      if (langsTitle) urlParams.set("custom_title", langsTitle);
      if (langsLayout !== "normal") urlParams.set("layout", langsLayout);
      if (langsCount !== "5") urlParams.set("langs_count", langsCount);
    }
  } else if (cardType === "streak") {
    if (streakUsername) {
      endpoint = "/api/streak";
      urlParams.set("username", streakUsername);
      valid = true;
      if (streakTitle) urlParams.set("custom_title", streakTitle);
    }
  } else if (cardType === "gist") {
    if (gistId) {
      endpoint = "/api/gist";
      urlParams.set("id", gistId);
      valid = true;
      if (gistShowOwner) urlParams.set("show_owner", "true");
    }
  } else if (cardType === "wakatime") {
    if (wakaUsername) {
      endpoint = "/api/wakatime";
      urlParams.set("username", wakaUsername);
      valid = true;
      if (wakaTitle) urlParams.set("custom_title", wakaTitle);
      if (wakaLayout !== "normal") urlParams.set("layout", wakaLayout);
    }
  } else if (cardType === "multi") {
    valid = multiCards.some((c) => {
      if (c.type === "pin") return c.username && c.repo;
      if (c.type === "gist") return !!c.gistId;
      return !!c.username;
    });
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const url = valid && cardType !== "multi" ? `${baseUrl}${endpoint}?${urlParams.toString()}` : "";
  return { url, valid };
}

/**
 * Build multi-col HTML snippet
 */
export function buildMultiHtml(
  multiUrls: string[],
  multiCards: MultiCard[],
  multiCardWidth: string,
  gap: string = "10px",
): string {
  if (multiUrls.length === 0) return "";

  // Use simple approach: render images directly one after another with spacing
  // This is the most compatible for GitHub readmes
  const images = multiUrls
    .map((u, i) => {
      const h = multiCards[i]?.height ?? Number(multiCardWidth) ?? 200;
      // Add horizontal spacing between cards (except last one)
      const spacing = i < multiUrls.length - 1 ? ` margin-right: ${gap}` : "";
      return `<a href="${u}" style="display: inline-block${spacing}"><img height="${h}" src="${u}" alt="GitHub Card" style="height: ${h}px" /></a>`;
    })
    .join("\n");

  return images;
}
