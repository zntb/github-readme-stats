import { MultiCard } from "../types";
import { MultiCardRow } from "./MultiCardRow";
import { FormGroup } from "./FormGroup";

interface MultiColFormProps {
  cards: MultiCard[];
  cardWidth: string;
  multiUrls: string[];
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<MultiCard>) => void;
  onCardWidthChange: (value: string) => void;
  gap: string;
  onGapChange: (value: string) => void;
}

export function MultiColForm({
  cards,
  cardWidth,
  multiUrls,
  onAddCard,
  onRemoveCard,
  onUpdateCard,
  onCardWidthChange,
  gap,
  onGapChange,
}: MultiColFormProps) {
  return (
    <div className="space-y-4 animate-fade-in-up animate-delay-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Configure multiple cards to display side by side. They share the global theme/colors.
        </p>
      </div>

      <FormGroup
        label="README img height (px)"
        description="Height applied to <img> tags in the HTML snippet for README alignment. Does not affect the live preview above."
      >
        <input
          type="number"
          value={cardWidth}
          min="100"
          max="500"
          placeholder="200"
          onChange={(e) => onCardWidthChange(e.target.value)}
          className="font-mono"
        />
      </FormGroup>

      <FormGroup
        label="Gap between cards"
        description="Space between cards in the HTML snippet (e.g., 10px, 20px)."
      >
        <input
          type="text"
          value={gap}
          placeholder="10px"
          onChange={(e) => onGapChange(e.target.value)}
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
          Fill in required fields (username/id) for each card to generate a preview.
        </p>
      )}
    </div>
  );
}
