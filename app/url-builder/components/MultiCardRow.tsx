import { MultiCard, SingleCardType, CARD_TYPE_LABELS } from "../types";

interface MultiCardRowProps {
  card: MultiCard;
  index: number;
  onUpdate: (updates: Partial<MultiCard>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function MultiCardRow({ card, index, onUpdate, onRemove, canRemove }: MultiCardRowProps) {
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