import { CardType, CARD_TYPE_TABS } from "../types";

interface CardTypeTabsProps {
  cardType: CardType;
  onChange: (cardType: CardType) => void;
}

export function CardTypeTabs({ cardType, onChange }: CardTypeTabsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {CARD_TYPE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
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
  );
}
