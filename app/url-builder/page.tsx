"use client";

import { useState, useCallback, useEffect } from "react";

import {
  CardType,
  MultiCard,
  ColorConfig,
  DEFAULT_COLORS,
  GRADIENT_TEMPLATES,
  GRADIENT_THEMES,
} from "./types";
import { buildSingleCardUrl, buildMultiHtml } from "./utils";

import {
  Header,
  Footer,
  CardTypeTabs,
  StatsForm,
  PinForm,
  TopLangsForm,
  StreakForm,
  GistForm,
  WakatimeForm,
  MultiColForm,
  AppearancePanel,
  PreviewPanel,
  InfoCard,
} from "./components";

let multiCardCounter = 3;

const STORAGE_KEY = "github-readme-stats-username";

export default function URLBuilder() {
  const [globalUsername, setGlobalUsername] = useState("");
  const [cardType, setCardType] = useState<CardType>("stats");
  const [theme, setTheme] = useState("");
  const [colors, setColors] = useState<ColorConfig>(DEFAULT_COLORS);
  const [advanced, setAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [markdownCopied, setMarkdownCopied] = useState(false);

  // Stats
  const [statsTitle, setStatsTitle] = useState("");
  const [statsHide, setStatsHide] = useState("");
  const [statsShow, setStatsShow] = useState<string[]>(["prs_merged", "prs_merged_percentage"]);

  // Pin
  const [pinRepo, setPinRepo] = useState("");
  const [pinTitle, setPinTitle] = useState("");
  const [pinShowOwner, setPinShowOwner] = useState(false);

  // Top Langs
  const [langsTitle, setLangsTitle] = useState("");
  const [langsLayout, setLangsLayout] = useState("normal");
  const [langsCount, setLangsCount] = useState("5");

  // Streak
  const [streakTitle, setStreakTitle] = useState("");

  // Gist
  const [gistId, setGistId] = useState("");
  const [gistShowOwner, setGistShowOwner] = useState(false);

  // Wakatime
  const [wakaUsername, setWakaUsername] = useState("");
  const [wakaTitle, setWakaTitle] = useState("");
  const [wakaLayout, setWakaLayout] = useState("normal");

  // Advanced
  const [borderRadius, setBorderRadius] = useState("4.5");
  const [cardWidth, setCardWidth] = useState("");
  const [cacheSeconds, setCacheSeconds] = useState("");
  const [locale, setLocale] = useState("");
  const [hideBorder, setHideBorder] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);

  // Gradient
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState("");
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradientColor1, setGradientColor1] = useState("#ff6b6b");
  const [gradientColor2, setGradientColor2] = useState("#feca57");

  // Multi-col
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
  const [multiGap, setMultiGap] = useState("10px");
  const [htmlCopied, setHtmlCopied] = useState(false);

  // Load global username from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setGlobalUsername(stored);
    }
  }, []);

  // Save global username to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, globalUsername);
  }, [globalUsername]);

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
      if (globalUsername) {
        params.set("username", globalUsername);
        valid = true;
        if (statsTitle) params.set("custom_title", statsTitle);
        if (statsHide) params.set("hide", statsHide);
        if (statsShow.length > 0) params.set("show", statsShow.join(","));
      }
    } else if (cardType === "pin") {
      if (globalUsername && pinRepo) {
        endpoint = "/api/pin";
        params.set("username", globalUsername);
        params.set("repo", pinRepo);
        valid = true;
        if (pinTitle) params.set("custom_title", pinTitle);
        if (pinShowOwner) params.set("show_owner", "true");
      }
    } else if (cardType === "top-langs") {
      if (globalUsername) {
        endpoint = "/api/top-langs";
        params.set("username", globalUsername);
        valid = true;
        if (langsTitle) params.set("custom_title", langsTitle);
        if (langsLayout !== "normal") params.set("layout", langsLayout);
        if (langsCount !== "5") params.set("langs_count", langsCount);
      }
    } else if (cardType === "streak") {
      if (globalUsername) {
        endpoint = "/api/streak";
        params.set("username", globalUsername);
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
    globalUsername,
    statsTitle,
    statsHide,
    statsShow,
    pinRepo,
    pinTitle,
    pinShowOwner,
    langsTitle,
    langsLayout,
    langsCount,
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
        globalUsername,
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

  // Generate HTML for multi-col
  const multiHtmlSnippet = multiValid ? buildMultiHtml(multiUrls, multiCards, multiCardWidth, multiGap) : "";

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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container-centered pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <section className="glass-card animate-fade-in-up animate-delay-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                Card Type
              </h2>

              <CardTypeTabs cardType={cardType} onChange={setCardType} />

              {/* Global GitHub Username */}
              <div className="pt-4 border-t border-card-border/30">
                <label className="text-sm font-semibold text-text block mb-2">
                  Global GitHub Username
                </label>
                <input
                  type="text"
                  placeholder="e.g., octocat"
                  value={globalUsername}
                  onChange={(e) => setGlobalUsername(e.target.value)}
                  className="w-full font-mono"
                />
                <p className="text-xs text-text-muted mt-1">
                  Used for all card types. Saved to local storage.
                </p>
              </div>

              <div className="space-y-6">
                {/* Stats */}
                {cardType === "stats" && (
                  <StatsForm
                    title={statsTitle}
                    hide={statsHide}
                    show={statsShow}
                    onTitleChange={setStatsTitle}
                    onHideChange={setStatsHide}
                    onShowChange={setStatsShow}
                  />
                )}

                {/* Pin */}
                {cardType === "pin" && (
                  <PinForm
                    repo={pinRepo}
                    title={pinTitle}
                    showOwner={pinShowOwner}
                    onRepoChange={setPinRepo}
                    onTitleChange={setPinTitle}
                    onShowOwnerChange={setPinShowOwner}
                  />
                )}

                {/* Top Langs */}
                {cardType === "top-langs" && (
                  <TopLangsForm
                    title={langsTitle}
                    layout={langsLayout}
                    langsCount={langsCount}
                    onTitleChange={setLangsTitle}
                    onLayoutChange={setLangsLayout}
                    onLangsCountChange={setLangsCount}
                  />
                )}

                {/* Streak */}
                {cardType === "streak" && (
                  <StreakForm title={streakTitle} onTitleChange={setStreakTitle} />
                )}

                {/* Gist */}
                {cardType === "gist" && (
                  <GistForm
                    gistId={gistId}
                    showOwner={gistShowOwner}
                    onGistIdChange={setGistId}
                    onShowOwnerChange={setGistShowOwner}
                  />
                )}

                {/* Wakatime */}
                {cardType === "wakatime" && (
                  <WakatimeForm
                    username={wakaUsername}
                    title={wakaTitle}
                    layout={wakaLayout}
                    onUsernameChange={setWakaUsername}
                    onTitleChange={setWakaTitle}
                    onLayoutChange={setWakaLayout}
                  />
                )}

                {/* Multi-Col */}
                {cardType === "multi" && (
                  <MultiColForm
                    cards={multiCards}
                    cardWidth={multiCardWidth}
                    multiUrls={multiUrls}
                    onAddCard={addMultiCard}
                    onRemoveCard={removeMultiCard}
                    onUpdateCard={updateMultiCard}
                    onCardWidthChange={setMultiCardWidth}
                    gap={multiGap}
                    onGapChange={setMultiGap}
                  />
                )}
              </div>
            </section>

            <AppearancePanel
              cardType={cardType}
              theme={theme}
              colors={colors}
              gradientEnabled={gradientEnabled}
              selectedGradient={selectedGradient}
              gradientAngle={gradientAngle}
              gradientColor1={gradientColor1}
              gradientColor2={gradientColor2}
              advanced={advanced}
              borderRadius={borderRadius}
              cardWidth={cardWidth}
              cacheSeconds={cacheSeconds}
              locale={locale}
              hideBorder={hideBorder}
              hideTitle={hideTitle}
              disableAnimations={disableAnimations}
              onThemeChange={setTheme}
              onColorsChange={setColors}
              onGradientEnabledChange={setGradientEnabled}
              onSelectedGradientChange={setSelectedGradient}
              onGradientAngleChange={setGradientAngle}
              onGradientColor1Change={setGradientColor1}
              onGradientColor2Change={setGradientColor2}
              onAdvancedChange={setAdvanced}
              onBorderRadiusChange={setBorderRadius}
              onCardWidthChange={setCardWidth}
              onCacheSecondsChange={setCacheSeconds}
              onLocaleChange={setLocale}
              onHideBorderChange={setHideBorder}
              onHideTitleChange={setHideTitle}
              onDisableAnimationsChange={setDisableAnimations}
            />
          </div>

          {/* Preview Panel */}
          <div>
            <div className="sticky top-8 space-y-6">
              <PreviewPanel
                cardType={cardType}
                url={url}
                valid={valid}
                multiUrls={multiUrls}
                multiValid={multiValid}
                multiHtmlSnippet={multiHtmlSnippet}
                copied={copied}
                markdownCopied={markdownCopied}
                htmlCopied={htmlCopied}
                onCopyUrl={copyUrl}
                onCopyMarkdown={copyMarkdown}
                onCopyHtml={copyHtml}
              />

              <InfoCard cardType={cardType} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
