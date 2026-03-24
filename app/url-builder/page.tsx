/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";

type SingleCardType = "stats" | "pin" | "top-langs" | "streak" | "gist" | "wakatime";
type CardType = SingleCardType | "multi";

const THEMES = [
  "default",
  "dark",
  "algolia",
  "apprentice",
  "aura",
  "aura_dark",
  "ayu-mirage",
  "blue-green",
  "blue_navy",
  "blueberry",
  "buefy",
  "calm",
  "calm_pink",
  "catppuccin_latte",
  "catppuccin_mocha",
  "city_lights",
  "cobalt",
  "cobalt2",
  "codeSTACKr",
  "date_night",
  "discord_old_blurple",
  "dracula",
  "flag-india",
  "github_dark",
  "github_dark_dimmed",
  "great-gatsby",
  "gruvbox",
  "gruvbox_light",
  "highcontrast",
  "holi",
  "kacho_ga",
  "maroongold",
  "merko",
  "midnight-purple",
  "moltack",
  "monokai",
  "neon",
  "nightowl",
  "noctis_minimus",
  "ocean_dark",
  "omni",
  "one_dark_pro",
  "onedark",
  "outrun",
  "panda",
  "prussian",
  "radical",
  "rose",
  "rose_pine",
  "slateorange",
  "swift",
  "synthwave",
  "tokyonight",
  "transparent",
  "yeblu",
];

const GRADIENT_TEMPLATES = [
  { id: "sunset", name: "Sunset", angle: 135, colors: ["#ff6b6b", "#feca57", "#ff9ff3"] },
  { id: "ocean", name: "Ocean", angle: 45, colors: ["#2b5876", "#4e4376"] },
  { id: "midnight", name: "Midnight", angle: 90, colors: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "aurora", name: "Aurora", angle: 45, colors: ["#00c9ff", "#92fe9d"] },
  { id: "candy", name: "Candy", angle: 45, colors: ["#d53369", "#daae51"] },
  { id: "deepsea", name: "Deep Sea", angle: 90, colors: ["#1a2988", "#26d0ce"] },
  { id: "purple-love", name: "Purple Love", angle: 45, colors: ["#cc2b5e", "#753a88"] },
  { id: "flamingo", name: "Flamingo", angle: 45, colors: ["#d53369", "#daae51"] },
];

const GRADIENT_THEMES = ["ambient_gradient"];

const CARD_TYPE_LABELS: Record<SingleCardType, string> = {
  stats: "Stats",
  pin: "Repo Pin",
  "top-langs": "Top Languages",
  streak: "Streak",
  gist: "Gist",
  wakatime: "WakaTime",
};

interface ColorConfig {
  titleColor: string;
  iconColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

interface MultiCard {
  id: string;
  type: SingleCardType;
  username: string;
  repo: string;
  gistId: string;
  height: number;
  layout: string;
  langsCount: string;
}

let multiCardCounter = 3;

function buildSingleCardUrl(
  card: MultiCard,
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

  if (card.type === "stats") {
    if (!card.username) return "";
    params.set("username", card.username);
    params.set("show_icons", "true");
  } else if (card.type === "pin") {
    if (!card.username || !card.repo) return "";
    endpoint = "/api/pin";
    params.set("username", card.username);
    params.set("repo", card.repo);
  } else if (card.type === "top-langs") {
    if (!card.username) return "";
    endpoint = "/api/top-langs";
    params.set("username", card.username);
    if (card.layout && card.layout !== "normal") params.set("layout", card.layout);
    if (card.langsCount && card.langsCount !== "5") params.set("langs_count", card.langsCount);
  } else if (card.type === "streak") {
    if (!card.username) return "";
    endpoint = "/api/streak";
    params.set("username", card.username);
  } else if (card.type === "gist") {
    if (!card.gistId) return "";
    endpoint = "/api/gist";
    params.set("id", card.gistId);
  } else if (card.type === "wakatime") {
    if (!card.username) return "";
    endpoint = "/api/wakatime";
    params.set("username", card.username);
    if (card.layout && card.layout !== "normal") params.set("layout", card.layout);
  }

  return `${origin}${endpoint}?${params.toString()}`;
}

export default function URLBuilder() {
  const [cardType, setCardType] = useState<CardType>("stats");
  const [theme, setTheme] = useState("");
  const [colors, setColors] = useState<ColorConfig>({
    titleColor: "#2f80ed",
    iconColor: "#4c71f2",
    textColor: "#434d58",
    bgColor: "#fffefe",
    borderColor: "#e4e2e2",
  });
  const [advanced, setAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [markdownCopied, setMarkdownCopied] = useState(false);

  const [statsUsername, setStatsUsername] = useState("");
  const [statsTitle, setStatsTitle] = useState("");
  const [statsHide, setStatsHide] = useState("");
  const [statsShow, setStatsShow] = useState<string[]>(["prs_merged", "prs_merged_percentage"]);

  const [pinUsername, setPinUsername] = useState("");
  const [pinRepo, setPinRepo] = useState("");
  const [pinTitle, setPinTitle] = useState("");
  const [pinShowOwner, setPinShowOwner] = useState(false);

  const [langsUsername, setLangsUsername] = useState("");
  const [langsTitle, setLangsTitle] = useState("");
  const [langsLayout, setLangsLayout] = useState("normal");
  const [langsCount, setLangsCount] = useState("5");

  const [streakUsername, setStreakUsername] = useState("");
  const [streakTitle, setStreakTitle] = useState("");

  const [gistId, setGistId] = useState("");
  const [gistShowOwner, setGistShowOwner] = useState(false);

  const [wakaUsername, setWakaUsername] = useState("");
  const [wakaTitle, setWakaTitle] = useState("");
  const [wakaLayout, setWakaLayout] = useState("normal");

  const [borderRadius, setBorderRadius] = useState("4.5");
  const [cardWidth, setCardWidth] = useState("");
  const [cacheSeconds, setCacheSeconds] = useState("");
  const [locale, setLocale] = useState("");
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);

  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState("");
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientColor1, setGradientColor1] = useState("#ff6b6b");
  const [gradientColor2, setGradientColor2] = useState("#feca57");

  // Multi-col state
  const [multiCards, setMultiCards] = useState<MultiCard[]>([
    {
      id: "mc1",
      type: "stats",
      username: "",
      repo: "",
      gistId: "",
      height: 200,
      layout: "normal",
      langsCount: "5",
    },
    {
      id: "mc2",
      type: "top-langs",
      username: "",
      repo: "",
      gistId: "",
      height: 200,
      layout: "compact",
      langsCount: "8",
    },
  ]);
  const [multiCardWidth, setMultiCardWidth] = useState("400");
  const [htmlCopied, setHtmlCopied] = useState(false);

  const addMultiCard = () => {
    const newId = `mc${multiCardCounter++}`;
    setMultiCards((prev) => [
      ...prev,
      {
        id: newId,
        type: "stats",
        username: "",
        repo: "",
        gistId: "",
        height: 200,
        layout: "normal",
        langsCount: "5",
      },
    ]);
  };

  const removeMultiCard = (id: string) => {
    setMultiCards((prev) => prev.filter((c) => c.id !== id));
  };

  const updateMultiCard = (id: string, updates: Partial<MultiCard>) => {
    setMultiCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const buildUrl = useCallback((): { url: string; valid: boolean } => {
    const params = new URLSearchParams();

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

    if (borderRadius && borderRadius !== "4.5") params.set("border_radius", borderRadius);
    if (cardWidth) params.set("card_width", cardWidth);
    if (cacheSeconds) params.set("cache_seconds", cacheSeconds);
    if (locale) params.set("locale", locale);
    if (hideBorder) params.set("hide_border", "true");
    if (hideTitle) params.set("hide_title", "true");
    if (disableAnimations) params.set("disable_animations", "true");

    let endpoint = "/api";
    let valid = false;

    if (cardType === "stats") {
      if (statsUsername) {
        params.set("username", statsUsername);
        valid = true;
        if (statsTitle) params.set("custom_title", statsTitle);
        if (statsHide) params.set("hide", statsHide);
        if (statsShow.length > 0) params.set("show", statsShow.join(","));
      }
    } else if (cardType === "pin") {
      if (pinUsername && pinRepo) {
        endpoint = "/api/pin";
        params.set("username", pinUsername);
        params.set("repo", pinRepo);
        valid = true;
        if (pinTitle) params.set("custom_title", pinTitle);
        if (pinShowOwner) params.set("show_owner", "true");
      }
    } else if (cardType === "top-langs") {
      if (langsUsername) {
        endpoint = "/api/top-langs";
        params.set("username", langsUsername);
        valid = true;
        if (langsTitle) params.set("custom_title", langsTitle);
        if (langsLayout !== "normal") params.set("layout", langsLayout);
        if (langsCount !== "5") params.set("langs_count", langsCount);
      }
    } else if (cardType === "streak") {
      if (streakUsername) {
        endpoint = "/api/streak";
        params.set("username", streakUsername);
        valid = true;
        if (streakTitle) params.set("custom_title", streakTitle);
      }
    } else if (cardType === "gist") {
      if (gistId) {
        endpoint = "/api/gist";
        params.set("id", gistId);
        valid = true;
        if (gistShowOwner) params.set("show_owner", "true");
      }
    } else if (cardType === "wakatime") {
      if (wakaUsername) {
        endpoint = "/api/wakatime";
        params.set("username", wakaUsername);
        valid = true;
        if (wakaTitle) params.set("custom_title", wakaTitle);
        if (wakaLayout !== "normal") params.set("layout", wakaLayout);
      }
    } else if (cardType === "multi") {
      valid = multiCards.some((c) => {
        if (c.type === "pin") return c.username && c.repo;
        if (c.type === "gist") return !!c.gistId;
        return !!c.username;
      });
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = valid && cardType !== "multi" ? `${baseUrl}${endpoint}?${params.toString()}` : "";
    return { url, valid };
  }, [
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
  ]);

  const { url, valid } = buildUrl();

  // Build multi-col URLs
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const multiUrls = multiCards
    .map((card) =>
      buildSingleCardUrl(
        card,
        theme,
        colors,
        gradientEnabled,
        selectedGradient,
        gradientAngle,
        gradientColor1,
        gradientColor2,
        origin,
      ),
    )
    .filter(Boolean);

  const multiValid = cardType === "multi" && multiUrls.length > 0;

  // Generate HTML for multi-col — use per-card height for the output img tag
  const multiHtml = multiValid
    ? multiUrls
        .map((u, i) => {
          const h = multiCards[i]?.height ?? Number(multiCardWidth) ?? 200;
          return `  <img height="${h}" src="${u}" alt="GitHub Card" />`;
        })
        .join("\n")
    : "";

  const multiHtmlSnippet = multiValid
    ? `<div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-start;">\n${multiHtml}\n</div>`
    : "";

  const copyUrl = async () => {
    if (valid && url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyMarkdown = async () => {
    if (valid && url) {
      const markdown = `![GitHub Stats](${url})`;
      await navigator.clipboard.writeText(markdown);
      setMarkdownCopied(true);
      setTimeout(() => setMarkdownCopied(false), 2000);
    }
  };

  const copyHtml = async () => {
    if (multiValid && multiHtmlSnippet) {
      await navigator.clipboard.writeText(multiHtmlSnippet);
      setHtmlCopied(true);
      setTimeout(() => setHtmlCopied(false), 2000);
    }
  };

  const tabs: { id: CardType; label: string; icon: string }[] = [
    { id: "stats", label: "Stats", icon: "📊" },
    { id: "pin", label: "Pin", icon: "📌" },
    { id: "top-langs", label: "Languages", icon: "🌐" },
    { id: "streak", label: "Streak", icon: "🔥" },
    { id: "gist", label: "Gist", icon: "📝" },
    { id: "wakatime", label: "Wakatime", icon: "⏱️" },
    { id: "multi", label: "Multi-Col", icon: "🗂️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative pt-16 pb-12 text-center animate-fade-in-up container-centered">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-shimmer"
            style={{ animationDuration: "8s" }}
          >
            GitHub Readme Stats
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Craft beautiful, personalized stats cards for your GitHub profile with live preview
          </p>
        </div>
      </header>

      <main className="container-centered pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Card Type Tabs */}
            <section className="glass-card animate-fade-in-up animate-delay-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                Card Type
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCardType(tab.id)}
                    className={`
                      relative px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      flex items-center justify-center gap-1.5 group
                      ${
                        cardType === tab.id
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-[1.02]"
                          : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary hover:text-text border border-card-border"
                      }
                    `}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {cardType === tab.id && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {/* ── STATS ── */}
                {cardType === "stats" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup label="GitHub Username *" description="Enter your GitHub username">
                      <input
                        type="text"
                        placeholder="e.g., octocat"
                        value={statsUsername}
                        onChange={(e) => setStatsUsername(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Custom Title" description="Personalize your card title">
                      <input
                        type="text"
                        placeholder="e.g., My GitHub Stats"
                        value={statsTitle}
                        onChange={(e) => setStatsTitle(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup label="Hide Stats" description="Comma-separated list to hide">
                      <input
                        type="text"
                        placeholder="e.g., prs,issues,commits"
                        value={statsHide}
                        onChange={(e) => setStatsHide(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </FormGroup>
                    <FormGroup
                      label="Additional Stats"
                      description="Select extra metrics to display"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "prs_merged",
                          "prs_merged_percentage",
                          "reviews",
                          "discussions_started",
                          "discussions_answered",
                          "contribs",
                        ].map((s) => (
                          <label
                            key={s}
                            className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={statsShow.includes(s)}
                              onChange={(e) => {
                                if (e.target.checked) setStatsShow([...statsShow, s]);
                                else setStatsShow(statsShow.filter((x) => x !== s));
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                              {s.replace(/_/g, " ")}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FormGroup>
                  </div>
                )}

                {/* ── PIN ── */}
                {cardType === "pin" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup label="GitHub Username *" description="Repository owner">
                      <input
                        type="text"
                        placeholder="e.g., octocat"
                        value={pinUsername}
                        onChange={(e) => setPinUsername(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Repository *" description="Repository name">
                      <input
                        type="text"
                        placeholder="e.g., hello-world"
                        value={pinRepo}
                        onChange={(e) => setPinRepo(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Custom Title" description="Override repository name">
                      <input
                        type="text"
                        placeholder="e.g., My Awesome Project"
                        value={pinTitle}
                        onChange={(e) => setPinTitle(e.target.value)}
                      />
                    </FormGroup>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pinShowOwner}
                        onChange={(e) => setPinShowOwner(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-text-secondary">Show repository owner</span>
                    </label>
                  </div>
                )}

                {/* ── TOP LANGS ── */}
                {cardType === "top-langs" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup
                      label="GitHub Username *"
                      description="User whose languages to display"
                    >
                      <input
                        type="text"
                        placeholder="e.g., octocat"
                        value={langsUsername}
                        onChange={(e) => setLangsUsername(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Custom Title" description="Card title override">
                      <input
                        type="text"
                        placeholder="e.g., Top Languages"
                        value={langsTitle}
                        onChange={(e) => setLangsTitle(e.target.value)}
                      />
                    </FormGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormGroup label="Layout" description="Visual arrangement">
                        <select
                          value={langsLayout}
                          onChange={(e) => setLangsLayout(e.target.value)}
                        >
                          <option value="normal">Normal</option>
                          <option value="compact">Compact</option>
                          <option value="donut">Donut</option>
                          <option value="donut-vertical">Donut Vertical</option>
                          <option value="pie">Pie</option>
                        </select>
                      </FormGroup>
                      <FormGroup label="Languages Count" description="Number to display (1-20)">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={langsCount}
                          onChange={(e) => setLangsCount(e.target.value)}
                          className="font-mono"
                        />
                      </FormGroup>
                    </div>
                  </div>
                )}

                {/* ── STREAK ── */}
                {cardType === "streak" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup label="GitHub Username *" description="User whose streak to show">
                      <input
                        type="text"
                        placeholder="e.g., octocat"
                        value={streakUsername}
                        onChange={(e) => setStreakUsername(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Custom Title" description="Card title override">
                      <input
                        type="text"
                        placeholder="e.g., Activity Streak"
                        value={streakTitle}
                        onChange={(e) => setStreakTitle(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                )}

                {/* ── GIST ── */}
                {cardType === "gist" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup label="Gist ID *" description="The Gist identifier">
                      <input
                        type="text"
                        placeholder="e.g., bbfce31e0217a3689c8d961a356cb10d"
                        value={gistId}
                        onChange={(e) => setGistId(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </FormGroup>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gistShowOwner}
                        onChange={(e) => setGistShowOwner(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-text-secondary">Show gist owner</span>
                    </label>
                  </div>
                )}

                {/* ── WAKATIME ── */}
                {cardType === "wakatime" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup
                      label="WakaTime Username *"
                      description="Your public WakaTime username"
                    >
                      <input
                        type="text"
                        placeholder="e.g., octocat"
                        value={wakaUsername}
                        onChange={(e) => setWakaUsername(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>
                    <FormGroup label="Custom Title" description="Card title override">
                      <input
                        type="text"
                        placeholder="e.g., WakaTime Stats"
                        value={wakaTitle}
                        onChange={(e) => setWakaTitle(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup label="Layout" description="Visual arrangement">
                      <select value={wakaLayout} onChange={(e) => setWakaLayout(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="compact">Compact</option>
                      </select>
                    </FormGroup>
                  </div>
                )}

                {/* ── MULTI-COL ── */}
                {cardType === "multi" && (
                  <div className="space-y-4 animate-fade-in-up animate-delay-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-secondary">
                        Configure multiple cards to display side by side. They share the global
                        theme/colors.
                      </p>
                    </div>

                    <FormGroup
                      label="README img height (px)"
                      description="Height applied to <img> tags in the HTML snippet for README alignment. Does not affect the live preview above."
                    >
                      <input
                        type="number"
                        value={multiCardWidth}
                        min="100"
                        max="500"
                        placeholder="200"
                        onChange={(e) => setMultiCardWidth(e.target.value)}
                        className="font-mono"
                      />
                    </FormGroup>

                    <div className="space-y-3">
                      {multiCards.map((card, idx) => (
                        <MultiCardRow
                          key={card.id}
                          card={card}
                          index={idx}
                          onUpdate={(updates) => updateMultiCard(card.id, updates)}
                          onRemove={() => removeMultiCard(card.id)}
                          canRemove={multiCards.length > 1}
                        />
                      ))}
                    </div>

                    <button
                      onClick={addMultiCard}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-card-border text-text-muted hover:border-primary/50 hover:text-primary transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Card
                    </button>

                    {multiCards.length > 0 && multiUrls.length === 0 && (
                      <p className="text-xs text-warning text-center pt-1">
                        Fill in required fields (username/id) for each card to generate a preview.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Appearance Panel — hidden for multi since theme is shared */}
            <section className="glass-card animate-fade-in-up animate-delay-300">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full" />
                Appearance
                {cardType === "multi" && (
                  <span className="text-xs font-normal text-text-muted ml-2">
                    (applied to all cards)
                  </span>
                )}
              </h2>

              <div className="space-y-6">
                <FormGroup label="Theme" description="Choose a preset theme or customize colors">
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="font-mono"
                  >
                    <option value="">Custom Colors</option>
                    {THEMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                {/* Gradient Background Section */}
                <div className="pt-2 border-t border-card-border/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold text-text">Background</span>
                  </div>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary/50 border border-card-border/50 hover:border-primary/30 transition-all cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={gradientEnabled}
                      onChange={(e) => {
                        setGradientEnabled(e.target.checked);
                        if (!e.target.checked) setSelectedGradient("");
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-text">Gradient Background</span>
                  </label>

                  {gradientEnabled && (
                    <div className="space-y-4 mt-4 animate-fade-in-up">
                      <FormGroup
                        label="Gradient Templates"
                        description="Choose a preset gradient or enter custom colors"
                      >
                        <select
                          value={selectedGradient}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setSelectedGradient(selectedId);
                            const template = GRADIENT_TEMPLATES.find((g) => g.id === selectedId);
                            if (template) {
                              setGradientAngle(template.angle);
                              setGradientColor1(template.colors[0]);
                              setGradientColor2(template.colors[1] || template.colors[0]);
                            }
                          }}
                          className="font-mono"
                        >
                          <option value="">Select a template...</option>
                          {GRADIENT_TEMPLATES.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                          {GRADIENT_THEMES.map((t) => (
                            <option key={t} value={t}>
                              {t.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </FormGroup>

                      <div className="space-y-3">
                        <span className="text-sm font-medium text-text-secondary">
                          Custom Colors
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                          {(
                            [
                              ["Color 1", gradientColor1, setGradientColor1],
                              ["Color 2", gradientColor2, setGradientColor2],
                            ] as [string, string, (v: string) => void][]
                          ).map(([label, val, setter]) => (
                            <div key={label} className="space-y-2">
                              <label className="text-xs text-text-secondary">{label}</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={val}
                                  onChange={(e) => setter(e.target.value)}
                                  className="w-10 h-10 rounded-lg border-2 border-card-border cursor-pointer hover:border-primary transition-colors"
                                />
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setter(v);
                                  }}
                                  className="flex-1 font-mono text-sm bg-bg-secondary border border-card-border rounded-lg px-2 py-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-text-secondary">
                            Angle: {gradientAngle}°
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="15"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                            className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {(gradientColor1 ||
                        gradientColor2 ||
                        GRADIENT_TEMPLATES.find((g) => g.id === selectedGradient)) && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-text-secondary">Preview</span>
                          <div
                            className="h-16 rounded-lg border border-card-border"
                            style={{
                              background: (() => {
                                const template = GRADIENT_TEMPLATES.find(
                                  (g) => g.id === selectedGradient,
                                );
                                if (template)
                                  return `linear-gradient(${template.angle}deg, ${template.colors.join(", ")})`;
                                if (GRADIENT_THEMES.includes(selectedGradient))
                                  return "linear-gradient(135deg, #23a58d, #c850c0, #ffcc70)";
                                return `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
                              })(),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!theme && (
                  <div className="space-y-4 pt-2">
                    {(
                      Object.entries({
                        titleColor: "Title Color",
                        iconColor: "Icon Color",
                        textColor: "Text Color",
                        bgColor: "Background",
                        borderColor: "Border Color",
                      }) as [keyof ColorConfig, string][]
                    ).map(([key, label], idx) => (
                      <div
                        key={key}
                        className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-center p-3 rounded-lg bg-bg-tertiary/50 border border-card-border/50 hover:border-primary/30 transition-all"
                        style={{ animationDelay: `${400 + idx * 100}ms` }}
                      >
                        <span className="text-sm font-medium text-text-secondary">{label}</span>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={colors[key]}
                            onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                            className="w-10 h-10 rounded-lg border-2 border-card-border cursor-pointer hover:border-primary transition-colors"
                          />
                          <input
                            type="text"
                            value={colors[key]}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColors({ ...colors, [key]: v });
                            }}
                            className="flex-1 font-mono text-sm bg-bg-secondary border border-card-border rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cardType !== "multi" && (
                  <>
                    <button
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors group mt-4"
                      onClick={() => setAdvanced(!advanced)}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${advanced ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Advanced Options
                    </button>

                    {advanced && (
                      <div className="space-y-5 pt-4 border-t border-card-border animate-fade-in-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormGroup label="Border Radius" description="Corner rounding (0-30)">
                            <input
                              type="number"
                              value={borderRadius}
                              min="0"
                              max="30"
                              step="0.5"
                              onChange={(e) => setBorderRadius(e.target.value)}
                              className="font-mono"
                            />
                          </FormGroup>
                          <FormGroup label="Card Width" description="Fixed width in pixels">
                            <input
                              type="number"
                              placeholder="e.g., 500"
                              value={cardWidth}
                              onChange={(e) => setCardWidth(e.target.value)}
                              className="font-mono"
                            />
                          </FormGroup>
                          <FormGroup label="Cache (seconds)" description="Cache duration">
                            <input
                              type="number"
                              placeholder="e.g., 86400"
                              value={cacheSeconds}
                              onChange={(e) => setCacheSeconds(e.target.value)}
                              className="font-mono"
                            />
                          </FormGroup>
                          <FormGroup label="Locale" description="Language code">
                            <input
                              type="text"
                              placeholder="e.g., en, cn, de"
                              value={locale}
                              onChange={(e) => setLocale(e.target.value)}
                              className="font-mono"
                            />
                          </FormGroup>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { label: "Hide Border", val: hideBorder, set: setHideBorder },
                            { label: "Hide Title", val: hideTitle, set: setHideTitle },
                            {
                              label: "Disable Animations",
                              val: disableAnimations,
                              set: setDisableAnimations,
                            },
                          ].map(({ label, val, set }) => (
                            <label
                              key={label}
                              className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={val}
                                onChange={(e) => set(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-text-secondary">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Preview Panel */}
          <div>
            <div className="sticky top-8 space-y-6">
              <section className="glass-card animate-fade-in-up animate-delay-400">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-success to-accent rounded-full" />
                  Live Preview
                  {cardType === "multi" && (
                    <span className="text-xs font-normal text-text-muted ml-2">(side-by-side)</span>
                  )}
                </h2>

                <div className="relative rounded-xl overflow-hidden mb-6 bg-bg-secondary border border-card-border shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                  <div className="relative flex items-center justify-center min-h-[200px] p-6">
                    {/* Multi-col preview — render each SVG at its natural intrinsic size */}
                    {cardType === "multi" ? (
                      multiUrls.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            gap: "12px",
                            overflowX: "auto",
                            alignItems: "flex-start",
                            width: "100%",
                          }}
                        >
                          {multiUrls.map((u, i) => (
                            <img
                              key={u + i}
                              src={u}
                              alt={`Card ${i + 1}`}
                              style={{
                                display: "block",
                                height: "auto",
                                width: "auto",
                                flexShrink: 0,
                                borderRadius: "8px",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-5xl mb-4 opacity-30">🗂️</div>
                          <p className="text-text-muted text-sm">
                            Fill in usernames for each card to see the multi-column preview
                          </p>
                        </div>
                      )
                    ) : /* Single card preview */
                    valid && url ? (
                      <img
                        key={url}
                        src={url}
                        alt="Card Preview"
                        className="max-w-full h-auto rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.innerHTML =
                            '<div class="text-center p-8"><div class="text-4xl mb-3">⚠️</div><p class="text-text-muted text-sm">Error loading preview. Check your configuration.</p></div>';
                        }}
                      />
                    ) : (
                      <div className="text-center p-8">
                        <div className="text-5xl mb-4 opacity-30">🎨</div>
                        <p className="text-text-muted text-sm">
                          Configure your card to see the preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Single card output */}
                {cardType !== "multi" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-text">Generated URL</label>
                    <div className="rounded-xl p-4 text-sm font-mono bg-bg-secondary border border-card-border shadow-inner overflow-x-auto leading-relaxed">
                      <span className={valid ? "text-text" : "text-text-muted"}>
                        {url || "Enter a username to generate URL"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={copyUrl}
                        disabled={!valid}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${valid ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]" : "bg-bg-tertiary text-text-muted cursor-not-allowed"}`}
                      >
                        {copied ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy URL
                          </>
                        )}
                      </button>
                      {valid && url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm text-center transition-all duration-300 bg-bg-tertiary border border-card-border text-text hover:border-primary/50 hover:bg-bg-secondary flex items-center justify-center gap-2 group"
                        >
                          <span>Open Card</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    {valid && url && (
                      <div className="mt-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-text">
                            Markdown Snippet
                          </label>
                          <button
                            onClick={copyMarkdown}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-tertiary border border-card-border text-text-secondary hover:text-text hover:border-primary/50 transition-all"
                          >
                            {markdownCopied ? (
                              <>
                                <svg
                                  className="w-3.5 h-3.5 text-success"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="text-success">Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="rounded-xl p-4 text-xs overflow-x-auto bg-bg-secondary border border-card-border shadow-inner">
                          <code className="text-text-secondary font-mono">{`![GitHub Stats](${url})`}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Multi-col HTML output */}
                {cardType === "multi" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-text">HTML Snippet</label>
                      <button
                        onClick={copyHtml}
                        disabled={!multiValid}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${multiValid ? "bg-bg-tertiary border-card-border text-text-secondary hover:text-text hover:border-primary/50" : "bg-bg-tertiary border-card-border text-text-muted cursor-not-allowed"}`}
                      >
                        {htmlCopied ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-success"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-success">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Copy HTML</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded-xl p-4 text-xs overflow-x-auto bg-bg-secondary border border-card-border shadow-inner min-h-[80px]">
                      <code className="text-text-secondary font-mono whitespace-pre-wrap break-all">
                        {multiValid
                          ? multiHtmlSnippet
                          : "Fill in card details above to generate HTML"}
                      </code>
                    </pre>
                    {multiValid && (
                      <p className="text-xs text-text-muted">
                        Paste this HTML into your README.md. GitHub renders inline HTML for
                        side-by-side layout.
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Info Card */}
              <section className="glass-card animate-fade-in-up animate-delay-500">
                <h3 className="text-lg font-semibold mb-4 text-text">Quick Tips</h3>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Use a <strong className="text-text">GitHub Personal Access Token</strong> for
                      higher rate limits
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Custom colors override theme selections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    <span>Cards are cached by default for 24 hours</span>
                  </li>
                  {cardType === "multi" && (
                    <li className="flex items-start gap-2">
                      <span className="text-warning mt-0.5">•</span>
                      <span>
                        Multi-col uses HTML — GitHub Markdown renders it correctly in READMEs
                      </span>
                    </li>
                  )}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 px-4 border-t border-card-border mt-12">
        <p className="text-sm text-text-muted">Built with Next.js 15 • Open source on GitHub</p>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function FormGroup({
  label,
  children,
  description,
}: {
  label: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-text flex items-center gap-2">{label}</label>
      {description && <p className="text-xs text-text-muted">{description}</p>}
      <div className="pt-1">{children}</div>
    </div>
  );
}

function MultiCardRow({
  card,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  card: MultiCard;
  index: number;
  onUpdate: (updates: Partial<MultiCard>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const needsRepo = card.type === "pin";
  const needsGistId = card.type === "gist";
  const hasLayout = card.type === "top-langs" || card.type === "wakatime";
  const usernameLabel = card.type === "wakatime" ? "WakaTime Username *" : "GitHub Username *";
  const usernamePlaceholder = card.type === "wakatime" ? "WakaTime user" : "GitHub user";

  return (
    <div className="rounded-xl border border-card-border bg-bg-tertiary/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Card {index + 1}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"
            title="Remove card"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Card type selector */}
      <div>
        <label className="text-xs text-text-muted block mb-1">Card Type</label>
        <select
          value={card.type}
          onChange={(e) =>
            onUpdate({ type: e.target.value as SingleCardType, repo: "", gistId: "" })
          }
          className="font-mono text-sm"
        >
          {(Object.keys(CARD_TYPE_LABELS) as SingleCardType[]).map((t) => (
            <option key={t} value={t}>
              {CARD_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Username field (not for gist) */}
      {!needsGistId && (
        <div>
          <label className="text-xs text-text-muted block mb-1">{usernameLabel}</label>
          <input
            type="text"
            placeholder={usernamePlaceholder}
            value={card.username}
            onChange={(e) => onUpdate({ username: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* Repo field for pin */}
      {needsRepo && (
        <div>
          <label className="text-xs text-text-muted block mb-1">Repository *</label>
          <input
            type="text"
            placeholder="repo-name"
            value={card.repo}
            onChange={(e) => onUpdate({ repo: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* Gist ID */}
      {needsGistId && (
        <div>
          <label className="text-xs text-text-muted block mb-1">Gist ID *</label>
          <input
            type="text"
            placeholder="e.g., bbfce31e..."
            value={card.gistId}
            onChange={(e) => onUpdate({ gistId: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* Layout for top-langs and wakatime */}
      {hasLayout && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-1">Layout</label>
            <select
              value={card.layout}
              onChange={(e) => onUpdate({ layout: e.target.value })}
              className="text-sm"
            >
              {card.type === "top-langs" ? (
                <>
                  <option value="normal">Normal</option>
                  <option value="compact">Compact</option>
                  <option value="donut">Donut</option>
                  <option value="donut-vertical">Donut Vertical</option>
                  <option value="pie">Pie</option>
                </>
              ) : (
                <>
                  <option value="normal">Normal</option>
                  <option value="compact">Compact</option>
                </>
              )}
            </select>
          </div>
          {card.type === "top-langs" && (
            <div>
              <label className="text-xs text-text-muted block mb-1">Lang Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={card.langsCount}
                onChange={(e) => onUpdate({ langsCount: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Height per card */}
      <div>
        <label className="text-xs text-text-muted block mb-1">Height (px)</label>
        <input
          type="number"
          min="100"
          max="500"
          value={card.height}
          onChange={(e) => onUpdate({ height: Number(e.target.value) })}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}
