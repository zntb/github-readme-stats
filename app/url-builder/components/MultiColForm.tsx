import { MultiCard } from "../types";
import { MultiCardRow } from "./MultiCardRow";
import { FormGroup } from "./FormGroup";

interface MultiColFormProps {
  cards: MultiCard[];
  cardHeight: string;
  multiUrls: string[];
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<MultiCard>) => void;
  onCardHeightChange: (value: string) => void;
  // Advanced settings
  borderRadius: string;
  hideBorder: boolean;
  onBorderRadiusChange: (value: string) => void;
  onHideBorderChange: (value: boolean) => void;
}

export function MultiColForm({
  cards,
  cardHeight,
  multiUrls,
  onAddCard,
  onRemoveCard,
  onUpdateCard,
  onCardHeightChange,
  borderRadius,
  hideBorder,
  onBorderRadiusChange,
  onHideBorderChange,
}: MultiColFormProps) {
  return (
    <div className="space-y-4 animate-fade-in-up animate-delay-200">
      <p className="text-sm text-text-secondary">
        Configure multiple cards to display side by side. They share the global theme and colors.
        Each card renders at its natural width; the height below keeps them aligned.
      </p>

      <FormGroup
        label="Card height (px)"
        description="All cards are rendered at this height. Width scales proportionally so each card shows at full width."
      >
        <input
          type="number"
          value={cardHeight}
          min="100"
          max="600"
          placeholder="200"
          onChange={(e) => onCardHeightChange(e.target.value)}
          className="font-mono"
        />
      </FormGroup>

      <div className="space-y-3">
        {cards.map((card, idx) => (
          <MultiCardRow
            key={card.id}
            card={card}
            index={idx}
            onUpdate={(updates) => onUpdateCard(card.id, updates)}
            onRemove={() => onRemoveCard(card.id)}
            canRemove={cards.length > 1}
          />
        ))}
      </div>

      <button
        onClick={onAddCard}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-card-border text-text-muted hover:border-primary/50 hover:text-primary transition-all text-sm font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Card
      </button>

      {cards.length > 0 && multiUrls.length === 0 && (
        <p className="text-xs text-warning text-center pt-1">
          Fill in the global GitHub username above and any required fields for each card to generate a preview.
        </p>
      )}

      {/* Advanced Settings for Multi-Col */}
      <div className="pt-4 border-t border-card-border/30">
        <span className="text-sm font-semibold text-text">Advanced Settings</span>
        <p className="text-xs text-text-muted mb-3">Applied to all cards</p>
        <div className="space-y-3">
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
          <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={hideBorder}
              onChange={(e) => onHideBorderChange(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-text-secondary">Hide Border</span>
          </label>
        </div>
      </div>
    </div>
  );
}
