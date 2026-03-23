/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";

type CardType = "stats" | "pin" | "top-langs" | "streak" | "gist" | "wakatime";

const THEMES = [
  "default",
  "dark",
  "algolia",
  "ambient_gradient",
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

interface ColorConfig {
  titleColor: string;
  iconColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
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
  const [mounted] = useState(true); // Always true on client - no hydration issue for this use case

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

  const buildUrl = useCallback((): { url: string; valid: boolean } => {
    const params = new URLSearchParams();

    if (theme) {
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
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = valid ? `${baseUrl}${endpoint}?${params.toString()}` : "";
    return { url, valid };
  }, [
    cardType,
    theme,
    colors,
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
  ]);

  const { url, valid } = buildUrl();

  const copyUrl = async () => {
    if (valid && url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs: { id: CardType; label: string; icon: string }[] = [
    { id: "stats", label: "Stats", icon: "📊" },
    { id: "pin", label: "Pin", icon: "📌" },
    { id: "top-langs", label: "Languages", icon: "🌐" },
    { id: "streak", label: "Streak", icon: "🔥" },
    { id: "gist", label: "Gist", icon: "📝" },
    { id: "wakatime", label: "Wakatime", icon: "⏱️" },
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCardType(tab.id)}
                    className={`
                      relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      flex items-center justify-center gap-2 group
                      ${
                        cardType === tab.id
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-[1.02]"
                          : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary hover:text-text border border-card-border"
                      }
                    `}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {cardType === tab.id && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
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

                {cardType === "wakatime" && (
                  <div className="space-y-5 animate-fade-in-up animate-delay-200">
                    <FormGroup label="Wakatime Username *" description="Your Wakatime username">
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
              </div>
            </section>

            {/* Appearance Panel */}
            <section className="glass-card animate-fade-in-up animate-delay-300">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full" />
                Appearance
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
                </h2>

                <div className="relative rounded-xl overflow-hidden mb-6 bg-bg-secondary border border-card-border shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                  <div className="relative flex items-center justify-center min-h-[280px] p-6">
                    {mounted && valid && url ? (
                      <img
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
                          {mounted ? "Configure your card to see the preview" : "Loading..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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
                </div>

                {valid && url && (
                  <div className="mt-6 animate-fade-in-up">
                    <label className="block text-sm font-semibold mb-3 text-text">
                      Markdown Snippet
                    </label>
                    <pre className="rounded-xl p-4 text-xs overflow-x-auto bg-bg-secondary border border-card-border shadow-inner">
                      <code className="text-text-secondary font-mono">{`![GitHub Stats](${url})`}</code>
                    </pre>
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
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span>All parameters are optional except required fields</span>
                  </li>
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
