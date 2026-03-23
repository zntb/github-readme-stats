"use client";

import { useState, useCallback } from "react";

type CardType = "stats" | "pin" | "top-langs" | "streak" | "gist" | "wakatime";

const THEMES = [
  "default", "dark", "radical", "merko", "gruvbox", "gruvbox_light",
  "tokyonight", "onedark", "dracula", "monokai", "nightowl", "buefy",
  "blue-green", "algolia", "great-gatsby", "ayu-mirage", "midnight-purple",
  "calm", "flag-india", "omni", "cobalt", "synthwave", "highcontrast",
  "prussian", "maroongold", "yeblu", "blueberry", "slateorange", "kacho_ga",
  "outrun", "ocean_dark", "city_lights", "github_dark", "github_dark_dimmed",
  "discord_old_blurple", "aura_dark", "panda", "noctis_minimus", "cobalt2",
  "swift", "aura", "apprentice", "moltack", "codeSTACKr", "rose_pine",
  "catppuccin_latte", "catppuccin_mocha", "date_night", "one_dark_pro",
  "rose", "holi", "neon", "blue_navy", "calm_pink", "ambient_gradient",
  "transparent",
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

  // Card-specific state
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

  // Advanced options
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
  }, [cardType, theme, colors, borderRadius, cardWidth, cacheSeconds, locale,
    hideBorder, hideTitle, disableAnimations, statsUsername, statsTitle,
    statsHide, statsShow, pinUsername, pinRepo, pinTitle, pinShowOwner,
    langsUsername, langsTitle, langsLayout, langsCount, streakUsername,
    streakTitle, gistId, gistShowOwner, wakaUsername, wakaTitle, wakaLayout]);

  const { url, valid } = buildUrl();

  const copyUrl = async () => {
    if (valid && url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs: { id: CardType; label: string }[] = [
    { id: "stats", label: "Stats" },
    { id: "pin", label: "Pin" },
    { id: "top-langs", label: "Top Languages" },
    { id: "streak", label: "Streak" },
    { id: "gist", label: "Gist" },
    { id: "wakatime", label: "Wakatime" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
          GitHub Readme Stats — URL Builder
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Build your custom card URL with live preview
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-12" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Configuration Panel */}
        <div>
          {/* Card Type Tabs */}
          <div
            className="rounded-lg p-6 mb-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
              Card Type
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCardType(tab.id)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    background: cardType === tab.id ? "var(--primary)" : "var(--card-bg)",
                    color: cardType === tab.id ? "white" : "var(--text)",
                    border: `1px solid ${cardType === tab.id ? "var(--primary)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Stats Options */}
            {cardType === "stats" && (
              <div className="space-y-4">
                <FormGroup label="Username *">
                  <input
                    className="input-field"
                    placeholder="Your GitHub username"
                    value={statsUsername}
                    onChange={(e) => setStatsUsername(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Custom Title">
                  <input
                    className="input-field"
                    placeholder="e.g., My GitHub Stats"
                    value={statsTitle}
                    onChange={(e) => setStatsTitle(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Hide Stats (comma-separated)">
                  <input
                    className="input-field"
                    placeholder="e.g., prs,issues"
                    value={statsHide}
                    onChange={(e) => setStatsHide(e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Additional Stats">
                  <div className="flex flex-wrap gap-3">
                    {["prs_merged", "prs_merged_percentage", "reviews", "discussions_started", "discussions_answered"].map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statsShow.includes(s)}
                          onChange={(e) => {
                            if (e.target.checked) setStatsShow([...statsShow, s]);
                            else setStatsShow(statsShow.filter((x) => x !== s));
                          }}
                        />
                        {s.replace(/_/g, " ")}
                      </label>
                    ))}
                  </div>
                </FormGroup>
              </div>
            )}

            {/* Pin Options */}
            {cardType === "pin" && (
              <div className="space-y-4">
                <FormGroup label="Username *">
                  <input className="input-field" placeholder="Your GitHub username" value={pinUsername} onChange={(e) => setPinUsername(e.target.value)} />
                </FormGroup>
                <FormGroup label="Repository *">
                  <input className="input-field" placeholder="e.g., github-readme-stats" value={pinRepo} onChange={(e) => setPinRepo(e.target.value)} />
                </FormGroup>
                <FormGroup label="Custom Title">
                  <input className="input-field" placeholder="e.g., My Repo" value={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                </FormGroup>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={pinShowOwner} onChange={(e) => setPinShowOwner(e.target.checked)} />
                  Show Owner
                </label>
              </div>
            )}

            {/* Top Languages Options */}
            {cardType === "top-langs" && (
              <div className="space-y-4">
                <FormGroup label="Username *">
                  <input className="input-field" placeholder="Your GitHub username" value={langsUsername} onChange={(e) => setLangsUsername(e.target.value)} />
                </FormGroup>
                <FormGroup label="Custom Title">
                  <input className="input-field" placeholder="e.g., Most Used Languages" value={langsTitle} onChange={(e) => setLangsTitle(e.target.value)} />
                </FormGroup>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <FormGroup label="Layout">
                    <select className="input-field" value={langsLayout} onChange={(e) => setLangsLayout(e.target.value)}>
                      <option value="normal">Normal</option>
                      <option value="compact">Compact</option>
                      <option value="donut">Donut</option>
                      <option value="donut-vertical">Donut Vertical</option>
                      <option value="pie">Pie</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Lang Count">
                    <input className="input-field" type="number" min="1" max="20" value={langsCount} onChange={(e) => setLangsCount(e.target.value)} />
                  </FormGroup>
                </div>
              </div>
            )}

            {/* Streak Options */}
            {cardType === "streak" && (
              <div className="space-y-4">
                <FormGroup label="Username *">
                  <input className="input-field" placeholder="Your GitHub username" value={streakUsername} onChange={(e) => setStreakUsername(e.target.value)} />
                </FormGroup>
                <FormGroup label="Custom Title">
                  <input className="input-field" placeholder="e.g., Activity Streak" value={streakTitle} onChange={(e) => setStreakTitle(e.target.value)} />
                </FormGroup>
              </div>
            )}

            {/* Gist Options */}
            {cardType === "gist" && (
              <div className="space-y-4">
                <FormGroup label="Gist ID *">
                  <input className="input-field" placeholder="e.g., bbfce31e0217a3689c8d961a356cb10d" value={gistId} onChange={(e) => setGistId(e.target.value)} />
                </FormGroup>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={gistShowOwner} onChange={(e) => setGistShowOwner(e.target.checked)} />
                  Show Owner
                </label>
              </div>
            )}

            {/* Wakatime Options */}
            {cardType === "wakatime" && (
              <div className="space-y-4">
                <FormGroup label="Wakatime Username *">
                  <input className="input-field" placeholder="Your Wakatime username" value={wakaUsername} onChange={(e) => setWakaUsername(e.target.value)} />
                </FormGroup>
                <FormGroup label="Custom Title">
                  <input className="input-field" placeholder="e.g., WakaTime Stats" value={wakaTitle} onChange={(e) => setWakaTitle(e.target.value)} />
                </FormGroup>
                <FormGroup label="Layout">
                  <select className="input-field" value={wakaLayout} onChange={(e) => setWakaLayout(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="compact">Compact</option>
                  </select>
                </FormGroup>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div
            className="rounded-lg p-6 mb-4"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
              Appearance
            </h2>

            <FormGroup label="Theme">
              <select
                className="input-field"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="">Custom Colors</option>
                {THEMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormGroup>

            {!theme && (
              <div className="mt-4 space-y-3">
                {(Object.entries({
                  titleColor: "Title Color",
                  iconColor: "Icon Color",
                  textColor: "Text Color",
                  bgColor: "Background",
                  borderColor: "Border Color",
                }) as [keyof ColorConfig, string][]).map(([key, label]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: "0.75rem" }}>
                    <span className="text-sm font-medium">{label}</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                        className="rounded border"
                        style={{ width: 40, height: 32, padding: 2, cursor: "pointer", border: "1px solid var(--border)" }}
                      />
                      <input
                        type="text"
                        value={colors[key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColors({ ...colors, [key]: v });
                        }}
                        className="input-field"
                        style={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Advanced Toggle */}
            <button
              className="mt-4 text-sm flex items-center gap-2"
              style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setAdvanced(!advanced)}
            >
              <span>{advanced ? "▲" : "▼"}</span> Advanced Options
            </button>

            {advanced && (
              <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <FormGroup label="Border Radius">
                    <input className="input-field" type="number" value={borderRadius} min="0" max="30" step="0.5" onChange={(e) => setBorderRadius(e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Card Width">
                    <input className="input-field" type="number" placeholder="e.g., 500" value={cardWidth} onChange={(e) => setCardWidth(e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Cache (seconds)">
                    <input className="input-field" type="number" placeholder="e.g., 86400" value={cacheSeconds} onChange={(e) => setCacheSeconds(e.target.value)} />
                  </FormGroup>
                  <FormGroup label="Locale">
                    <input className="input-field" placeholder="e.g., en, cn, de" value={locale} onChange={(e) => setLocale(e.target.value)} />
                  </FormGroup>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Hide Border", val: hideBorder, set: setHideBorder },
                    { label: "Hide Title", val: hideTitle, set: setHideTitle },
                    { label: "Disable Animations", val: disableAnimations, set: setDisableAnimations },
                  ].map(({ label, val, set }) => (
                    <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
          <div
            className="rounded-lg p-6"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
              Live Preview
            </h2>

            {/* Preview Frame */}
            <div
              className="rounded-lg flex items-center justify-center mb-4 overflow-hidden"
              style={{
                background: "#fafbfc",
                border: "1px solid var(--border)",
                minHeight: 200,
                padding: "1rem",
              }}
            >
              {valid && url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt="Card Preview"
                  className="max-w-full h-auto rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span style="color:var(--text-muted);font-style:italic">Error loading preview. Check your username.</span>';
                  }}
                />
              ) : (
                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  Configure your card to see the preview
                </span>
              )}
            </div>

            {/* Generated URL */}
            <label className="block text-sm font-semibold mb-2">Generated URL</label>
            <div
              className="rounded-lg p-3 mb-3 text-sm font-mono break-all"
              style={{
                background: "#f6f8fa",
                border: "1px solid var(--border)",
                maxHeight: 100,
                overflowY: "auto",
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: valid ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {url || "Enter a username to generate URL"}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyUrl}
                disabled={!valid}
                className="px-4 py-2 rounded-md text-sm font-semibold"
                style={{
                  background: valid ? "var(--primary)" : "#ccc",
                  color: "white",
                  border: "none",
                  cursor: valid ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                {copied ? "✓ Copied!" : "Copy URL"}
              </button>
              {valid && url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md text-sm font-semibold"
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                  }}
                >
                  Open ↗
                </a>
              )}
            </div>

            {/* Markdown snippet */}
            {valid && url && (
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">Markdown Snippet</label>
                <pre
                  className="rounded-lg p-3 text-sm overflow-auto"
                  style={{
                    background: "#f6f8fa",
                    border: "1px solid var(--border)",
                    fontSize: "0.75rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >{`![Card](${url})`}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--card-bg);
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.1);
        }
        select.input-field {
          cursor: pointer;
        }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        @media (max-width: 768px) {
          .max-w-7xl { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}
