import { FormGroup } from "./FormGroup";
import { ColorConfig, THEMES, GRADIENT_TEMPLATES, GRADIENT_THEMES } from "../types";

interface AppearancePanelProps {
  cardType: string;
  theme: string;
  colors: ColorConfig;
  gradientEnabled: boolean;
  selectedGradient: string;
  gradientAngle: number;
  gradientColor1: string;
  gradientColor2: string;
  advanced: boolean;
  borderRadius: string;
  cardWidth: string;
  cacheSeconds: string;
  locale: string;
  hideBorder: boolean;
  hideTitle: boolean;
  disableAnimations: boolean;
  onThemeChange: (value: string) => void;
  onColorsChange: (colors: ColorConfig) => void;
  onGradientEnabledChange: (enabled: boolean) => void;
  onSelectedGradientChange: (value: string) => void;
  onGradientAngleChange: (value: number) => void;
  onGradientColor1Change: (value: string) => void;
  onGradientColor2Change: (value: string) => void;
  onAdvancedChange: (value: boolean) => void;
  onBorderRadiusChange: (value: string) => void;
  onCardWidthChange: (value: string) => void;
  onCacheSecondsChange: (value: string) => void;
  onLocaleChange: (value: string) => void;
  onHideBorderChange: (value: boolean) => void;
  onHideTitleChange: (value: boolean) => void;
  onDisableAnimationsChange: (value: boolean) => void;
}

export function AppearancePanel({
  cardType,
  theme,
  colors,
  gradientEnabled,
  selectedGradient,
  gradientAngle,
  gradientColor1,
  gradientColor2,
  advanced,
  borderRadius,
  cardWidth,
  cacheSeconds,
  locale,
  hideBorder,
  hideTitle,
  disableAnimations,
  onThemeChange,
  onColorsChange,
  onGradientEnabledChange,
  onSelectedGradientChange,
  onGradientAngleChange,
  onGradientColor1Change,
  onGradientColor2Change,
  onAdvancedChange,
  onBorderRadiusChange,
  onCardWidthChange,
  onCacheSecondsChange,
  onLocaleChange,
  onHideBorderChange,
  onHideTitleChange,
  onDisableAnimationsChange,
}: AppearancePanelProps) {
  const handleGradientTemplateSelect = (selectedId: string) => {
    onSelectedGradientChange(selectedId);
    const template = GRADIENT_TEMPLATES.find((g) => g.id === selectedId);
    if (template) {
      onGradientAngleChange(template.angle);
      onGradientColor1Change(template.colors[0]);
      onGradientColor2Change(template.colors[1] || template.colors[0]);
    }
  };

  const handleGradientToggle = (enabled: boolean) => {
    onGradientEnabledChange(enabled);
    if (!enabled) onSelectedGradientChange("");
  };

  return (
    <section className="glass-card animate-fade-in-up animate-delay-300">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full" />
        Appearance
        {cardType === "multi" && (
          <span className="text-xs font-normal text-text-muted ml-2">(applied to all cards)</span>
        )}
      </h2>

      <div className="space-y-6">
        <FormGroup label="Theme" description="Choose a preset theme or customize colors">
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
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
              onChange={(e) => handleGradientToggle(e.target.checked)}
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
                  onChange={(e) => handleGradientTemplateSelect(e.target.value)}
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
                <span className="text-sm font-medium text-text-secondary">Custom Colors</span>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      ["Color 1", gradientColor1, onGradientColor1Change],
                      ["Color 2", gradientColor2, onGradientColor2Change],
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
                  <label className="text-xs text-text-secondary">Angle: {gradientAngle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={gradientAngle}
                    onChange={(e) => onGradientAngleChange(parseInt(e.target.value))}
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
                        const template = GRADIENT_TEMPLATES.find((g) => g.id === selectedGradient);
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
                    onChange={(e) => onColorsChange({ ...colors, [key]: e.target.value })}
                    className="w-10 h-10 rounded-lg border-2 border-card-border cursor-pointer hover:border-primary transition-colors"
                  />
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onColorsChange({ ...colors, [key]: v });
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
              onClick={() => onAdvancedChange(!advanced)}
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
                      onChange={(e) => onBorderRadiusChange(e.target.value)}
                      className="font-mono"
                    />
                  </FormGroup>
                  <FormGroup label="Card Width" description="Fixed width in pixels">
                    <input
                      type="number"
                      placeholder="e.g., 500"
                      value={cardWidth}
                      onChange={(e) => onCardWidthChange(e.target.value)}
                      className="font-mono"
                    />
                  </FormGroup>
                  <FormGroup label="Cache (seconds)" description="Cache duration">
                    <input
                      type="number"
                      placeholder="e.g., 86400"
                      value={cacheSeconds}
                      onChange={(e) => onCacheSecondsChange(e.target.value)}
                      className="font-mono"
                    />
                  </FormGroup>
                  <FormGroup label="Locale" description="Language code">
                    <input
                      type="text"
                      placeholder="e.g., en, cn, de"
                      value={locale}
                      onChange={(e) => onLocaleChange(e.target.value)}
                      className="font-mono"
                    />
                  </FormGroup>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Hide Border", val: hideBorder, set: onHideBorderChange },
                    { label: "Hide Title", val: hideTitle, set: onHideTitleChange },
                    {
                      label: "Disable Animations",
                      val: disableAnimations,
                      set: onDisableAnimationsChange,
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
  );
}
